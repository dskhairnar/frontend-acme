
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, Scale, Target, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { format, parseISO, subMonths } from 'date-fns';
import { WeightEntry } from '@/types';
import { weightEntryService } from '@/services/weightEntryService';
import WeightEntryForm from './WeightEntryForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const WeightProgress = () => {
  const navigate = useNavigate();
  const { logout, user, token, isLoading: authLoading } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [stats, setStats] = useState({
    currentWeight: 0,
    startingWeight: 0,
    targetWeight: 0,
    weightLoss: 0,
    weightLossPercentage: 0,
    currentBMI: 0,
    daysOnProgram: 0,
  });
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      // Optionally, redirect to login or show a message
      // navigate('/login');
      setIsLoading(false);
      return;
    }
    loadWeightEntries();
  }, [authLoading, user, token]);

  const loadWeightEntries = async () => {
    try {
      setIsLoading(true);
      const entries = await weightEntryService.getWeightEntries({
        sortBy: 'date',
        sortOrder: 'desc',
        limit: 100,
      });
      setWeightEntries(entries);
      calculateStats(entries);
      setAuthError(null);
    } catch (error) {
      console.error('Error loading weight entries:', error);
      if (error instanceof Error && error.message.includes('Authentication')) {
        setAuthError('Your session has expired or your account no longer exists. Please log in again.');
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (entries: WeightEntry[]) => {
    if (entries.length === 0) return;

    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    const currentWeight = lastEntry.weight;
    const startingWeight = firstEntry.weight;
    const weightLoss = startingWeight - currentWeight;
    const weightLossPercentage = startingWeight > 0 ? (weightLoss / startingWeight) * 100 : 0;
    
    // Calculate BMI (assuming average height of 5'7" for demo)
    const heightInMeters = 1.7;
    const currentBMI = currentWeight / (heightInMeters * heightInMeters);
    
    // Calculate days on program
    const enrollmentDate = new Date(firstEntry.date);
    const today = new Date();
    const daysOnProgram = Math.ceil((today.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24));

    setStats({
      currentWeight,
      startingWeight,
      targetWeight: startingWeight - 20, // Demo target: 20 lbs loss
      weightLoss,
      weightLossPercentage,
      currentBMI: Math.round(currentBMI * 10) / 10,
      daysOnProgram,
    });
  };

  const handleSubmitWeight = async (data: Omit<WeightEntry, 'id' | 'userId'>) => {
    try {
      setIsSubmitting(true);
      if (editingEntry) {
        await weightEntryService.updateWeightEntry(editingEntry.id, data);
      } else {
        await weightEntryService.createWeightEntry(data);
      }
      await loadWeightEntries();
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving weight entry:', error);
      // No need to call logout or navigate here; handled globally
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await weightEntryService.deleteWeightEntry(entryId);
      await loadWeightEntries();
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      // No need to call logout or navigate here; handled globally
    }
  };

  const handleEditEntry = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '3months':
        startDate = subMonths(now, 3);
        break;
      case '6months':
        startDate = subMonths(now, 6);
        break;
      case '1year':
        startDate = subMonths(now, 12);
        break;
      default:
        return weightEntries.filter(entry => entry.date);
    }
    
    return weightEntries.filter(entry => entry.date && parseISO(entry.date) >= startDate);
  };

  const chartData = getFilteredData()
    .filter(entry => entry.date) // filter out entries with missing date
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: entry.date ? format(parseISO(entry.date), 'MMM dd') : 'Invalid date',
      weight: entry.weight,
      fullDate: entry.date
    }));

  const progressToTarget = stats.targetWeight 
    ? ((stats.startingWeight - stats.currentWeight) / (stats.startingWeight - stats.targetWeight)) * 100
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-primary">
            Weight: <span className="font-bold">{payload[0].value} lbs</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading weight data...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground mt-2">{authError}</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground mt-2">You are not authenticated. Please log in.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-minimal border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Weight
              </CardTitle>
              <Scale className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{!isNaN(stats.currentWeight) ? stats.currentWeight : '-'} lbs</div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                -{!isNaN(stats.weightLoss) ? stats.weightLoss : '-'} lbs lost
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-minimal border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Weight Loss
              </CardTitle>
              <TrendingDown className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{!isNaN(stats.weightLossPercentage) ? stats.weightLossPercentage.toFixed(1) : '-'}%</div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {stats.weightLoss} lbs lost
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-minimal border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current BMI
              </CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{!isNaN(stats.currentBMI) ? stats.currentBMI : '-'}</div>
              <Badge className="bg-muted text-muted-foreground">
                Normal range
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-minimal border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Days on Program
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{!isNaN(stats.daysOnProgram) ? stats.daysOnProgram : '-'}</div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Goal */}
      {stats.targetWeight && (
        <Card className="shadow-minimal border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-foreground">
                <Target className="mr-3 h-6 w-6 text-primary" />
                Progress to Goal
              </CardTitle>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {Math.round(progressToTarget)}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressToTarget, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Starting: {!isNaN(stats.startingWeight) ? stats.startingWeight : '-'} lbs</span>
                <span>Current: {!isNaN(stats.currentWeight) ? stats.currentWeight : '-'} lbs</span>
                <span>Target: {!isNaN(stats.targetWeight) ? stats.targetWeight : '-'} lbs</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You're <span className="font-semibold text-foreground">{!isNaN(stats.targetWeight - stats.currentWeight) ? stats.targetWeight - stats.currentWeight : '-'} pounds</span> away from your goal!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Chart */}
      <Card className="shadow-minimal border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center text-foreground">
              <TrendingDown className="mr-3 h-6 w-6 text-primary" />
              Weight Progress Over Time
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Log Weight
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Log New Weight Entry</DialogTitle>
                    <DialogDescription>
                      Enter your current weight and any notes to track your progress.
                    </DialogDescription>
                  </DialogHeader>
                  <WeightEntryForm
                    onSubmit={handleSubmitWeight}
                    onCancel={handleCancelForm}
                    initialData={editingEntry || undefined}
                    isLoading={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
                {stats.targetWeight && (
                  <ReferenceLine 
                    y={stats.targetWeight} 
                    stroke="hsl(var(--destructive))" 
                    strokeDasharray="3 3"
                    label="Target"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Scale className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p>No weight data available</p>
              <p className="text-sm">Start logging your weight to see your progress</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Weight Entries */}
      <Card className="shadow-minimal border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Calendar className="mr-3 h-6 w-6 text-primary" />
            Recent Weight Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weightEntries.length > 0 ? (
            <div className="space-y-3">
              {weightEntries.slice(0, 5).map((entry, index) => {
                const prevEntry = weightEntries[index + 1];
                const change = prevEntry ? entry.weight - prevEntry.weight : 0;
                
                return (
                  <div key={entry.id || index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Scale className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{entry.weight} lbs</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.date ? format(parseISO(entry.date), 'MMM dd, yyyy') : 'Invalid date'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {change !== 0 && (
                        <Badge 
                          className={change < 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}
                        >
                          {change > 0 ? '+' : ''}{change} lbs
                        </Badge>
                      )}
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEntry(entry)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Weight Entry</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this weight entry? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => entry.id ? handleDeleteEntry(entry.id) : alert('Invalid entry ID')}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Scale className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p>No weight entries yet</p>
              <p className="text-sm">Start logging your weight to track your progress</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightProgress;
