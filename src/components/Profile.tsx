
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Activity,
  Settings,
  Edit
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { weightEntryService } from '@/services/weightEntryService';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await weightEntryService.getWeightStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user?.id]);

  if (!user) return null;
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const age = user.dateOfBirth ? Math.floor(differenceInDays(new Date(), parseISO(user.dateOfBirth)) / 365.25) : null;
  const enrollmentDays = differenceInDays(new Date(), parseISO(user.enrollmentDate));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="shadow-medical border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-medical rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 mb-4">Patient since {format(parseISO(user.enrollmentDate), 'MMMM yyyy')}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-medical-100 text-medical-700">Active Patient</Badge>
                <Badge className="bg-success-100 text-success-700">
                  {enrollmentDays} days on program
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-medical-500" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <div className="mt-1 text-gray-900">{user.firstName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <div className="mt-1 text-gray-900">{user.lastName}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 py-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-600">Email Address</div>
                <div className="text-gray-900">{user.email}</div>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center space-x-3 py-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-600">Phone Number</div>
                  <div className="text-gray-900">{user.phone}</div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 py-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-600">Date of Birth</div>
                <div className="text-gray-900">
                  {format(parseISO(user.dateOfBirth), 'MMMM dd, yyyy')} 
                  {age && <span className="text-gray-500 ml-2">({age} years old)</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 py-2">
              <Activity className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-600">Enrollment Date</div>
                <div className="text-gray-900">
                  {format(parseISO(user.enrollmentDate), 'MMMM dd, yyyy')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Summary */}
        <Card className="shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-medical-500" />
              Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-medical-50 rounded-lg">
                <div className="text-2xl font-bold text-medical-700">{stats?.lastEntry?.weight ?? '--'}</div>
                <div className="text-sm text-gray-600">Current Weight (lbs)</div>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-700">{stats ? (stats.firstEntry?.weight - stats.lastEntry?.weight) : '--'}</div>
                <div className="text-sm text-gray-600">Weight Lost (lbs)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{stats?.currentBMI ?? '--'}</div>
                <div className="text-sm text-gray-600">Current BMI</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{enrollmentDays}</div>
                <div className="text-sm text-gray-600">Days on Program</div>
              </div>
            </div>

            {/* TODO: Display real target weight and progress */}
            {/* <div className="p-4 bg-gradient-to-r from-medical-50 to-success-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-600">Progress to Goal</div>
                    <div className="text-lg font-bold text-gray-900">
                      {stats.targetWeight - stats.currentWeight} lbs to go
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-medical-700">
                      {Math.round(((stats.startingWeight - stats.currentWeight) / (stats.startingWeight - stats.targetWeight)) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
              </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card className="shadow-medical border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-medical-500" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-12">
              <Mail className="mr-3 h-5 w-5" />
              Update Email Preferences
            </Button>
            <Button variant="outline" className="justify-start h-12">
              <Phone className="mr-3 h-5 w-5" />
              Update Phone Number
            </Button>
            <Button variant="outline" className="justify-start h-12">
              <MapPin className="mr-3 h-5 w-5" />
              Update Shipping Address
            </Button>
            <Button variant="outline" className="justify-start h-12">
              <Settings className="mr-3 h-5 w-5" />
              Privacy Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
