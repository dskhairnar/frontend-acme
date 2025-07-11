import { Shipment } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class ShipmentService {
  getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('acme-token');
    if (!token) throw new Error('No authentication token found. Please log in again.');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getShipments(): Promise<Shipment[]> {
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch shipments');
    const result = await response.json();
    return (result.data || []).map((shipment: any) => ({
      ...shipment,
      id: shipment._id,
    }));
  }

  async createShipment(data: Partial<Shipment>): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create shipment');
    const result = await response.json();
    const shipment = result.data;
    return { ...shipment, id: shipment._id };
  }

  async updateShipment(id: string, data: Partial<Shipment>): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update shipment');
    const result = await response.json();
    const shipment = result.data;
    return { ...shipment, id: shipment._id };
  }

  async deleteShipment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/shipments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete shipment');
  }
}

export const shipmentService = new ShipmentService();
export default shipmentService; 