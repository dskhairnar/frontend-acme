
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingDown, 
  Package, 
  Calendar, 
  Target,
  Scale,
  Activity,
  Truck,
  Clock,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { weightEntryService } from '@/services/weightEntryService';
import { shipmentService } from '@/services/shipmentService';
import { useAuth } from '@/contexts/AuthContext';
import { ChartContainer } from '@/components/ui/chart';
import * as RechartsPrimitive from 'recharts';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [weightStats, shipmentList] = await Promise.all([
          weightEntryService.getWeightStats(),
          shipmentService.getShipments(),
        ]);
        setStats(weightStats);
        setShipments(shipmentList);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const nextShipment = shipments
    .filter((s) => s.status === 'pending' || s.status === 'shipped')
    .sort((a, b) => new Date(a.shippedDate || a.orderDate).getTime() - new Date(b.shippedDate || b.orderDate).getTime())[0];

  const chartData = (stats?.entries || [])
    .filter((entry: any) => {
      const dateVal = entry.date || entry.recordedAt;
      return dateVal && !isNaN(new Date(dateVal).getTime());
    })
    .map((entry: any) => {
      const dateVal = entry.date || entry.recordedAt;
      return {
        date: format(new Date(dateVal), 'MMM dd'),
        weight: entry.weight,
      };
    });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5" />Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.lastEntry?.weight ?? '--'} lbs</div>
            <div className="text-gray-500 text-sm">as of {stats?.lastEntry?.date ? format(new Date(stats.lastEntry.date), 'MMM dd, yyyy') : '--'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5" />Weight Lost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats ? (stats.firstEntry?.weight - stats.lastEntry?.weight) : '--'} lbs</div>
            <div className="text-gray-500 text-sm">since start</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Next Shipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{nextShipment?.trackingNumber || 'TBD'}</div>
            <div className="text-gray-500 text-sm">{nextShipment?.shippedDate ? `Ships ${format(new Date(nextShipment.shippedDate), 'MMM dd, yyyy')}` : 'No upcoming shipment'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Weight Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 1 ? (
            <ChartContainer config={{ weight: { color: '#ff7a00', label: 'Weight' } }}>
              <RechartsPrimitive.LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <RechartsPrimitive.XAxis dataKey="date" />
                <RechartsPrimitive.YAxis />
                <RechartsPrimitive.Tooltip />
                <RechartsPrimitive.Line type="monotone" dataKey="weight" stroke="#ff7a00" strokeWidth={2} dot={false} />
              </RechartsPrimitive.LineChart>
            </ChartContainer>
          ) : (
            <div className="text-gray-500">Not enough data to display chart.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
