import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Calendar,
  MapPin,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { shipmentService } from '@/services/shipmentService';
import { Shipment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const Shipments = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [form, setForm] = useState<Partial<Shipment>>({
    items: [{ name: '', quantity: 1 }],
    status: 'pending',
  });

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shipmentService.getShipments();
      setShipments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return;
    try {
      await shipmentService.deleteShipment(id);
      fetchShipments();
    } catch (err: any) {
      setError(err.message || 'Failed to delete shipment');
    }
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setForm({ ...shipment });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingShipment(null);
    setForm({ items: [{ name: '', quantity: 1 }], status: 'pending' });
    setShowForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx?: number) => {
    const { name, value } = e.target;
    if (typeof idx === 'number' && form.items) {
      const items = [...form.items];
      items[idx] = { ...items[idx], [name]: name === 'quantity' ? Number(value) : value };
      setForm({ ...form, items });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddItem = () => {
    setForm({ ...form, items: [...(form.items || []), { name: '', quantity: 1 }] });
  };

  const handleRemoveItem = (idx: number) => {
    if (!form.items) return;
    const updated = form.items.filter((_, i) => i !== idx);
    setForm({ ...form, items: updated });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError('User not authenticated. Please log in again.');
      return;
    }
    const payload = { ...form, userId: user.id };
    try {
      if (editingShipment?.id) {
        await shipmentService.updateShipment(editingShipment.id, payload);
      } else {
        await shipmentService.createShipment(payload);
      }
      setShowForm(false);
      setEditingShipment(null);
      setForm({ items: [{ name: '', quantity: 1 }], status: 'pending' });
      fetchShipments();
    } catch (err: any) {
      setError(err.message || 'Failed to save shipment');
    }
  };

  const filteredShipments = statusFilter === 'all'
    ? shipments
    : shipments.filter((s) => s.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'delayed':
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'delayed':
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Shipments</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Shipment
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded-lg shadow w-full max-w-md mx-auto space-y-4"
          >
            <h3 className="text-lg font-bold">
              {editingShipment ? 'Edit Shipment' : 'Create Shipment'}
            </h3>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleFormChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {(form.items || []).map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  name="name"
                  value={item.name}
                  onChange={(e) => handleFormChange(e, idx)}
                  placeholder="Item Name"
                  className="border p-2 rounded flex-1"
                  required
                />
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleFormChange(e, idx)}
                  min={1}
                  className="border p-2 rounded w-24"
                  required
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveItem(idx)}
                  disabled={form.items?.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button type="button" variant="secondary" onClick={handleAddItem}>
              Add Item
            </Button>
            <div className="flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingShipment ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </div>
      )}

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40 mb-4">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        {filteredShipments.map((shipment, idx) => (
          <Card key={shipment.id || idx} className="p-4 border">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                  {getStatusIcon(shipment.status)}
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    {shipment.items?.map((i) => i.name).join(', ') || 'No items'}
                  </div>
                  <Badge className={`${getStatusColor(shipment.status)} mt-1`}>
                    {shipment.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(shipment)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(shipment.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {shipment.shippedDate ? format(parseISO(shipment.shippedDate), 'PP') : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{shipment.trackingNumber || 'No Tracking'}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shipments;
