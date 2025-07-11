import { Medication } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class MedicationService {
  getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('acme-token');
    if (!token) throw new Error('No authentication token found. Please log in again.');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getMedications(): Promise<Medication[]> {
    const response = await fetch(`${API_BASE_URL}/medications`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch medications');
    const result = await response.json();
    return (result.data || []).map((med: any) => ({ ...med, id: med._id }));
  }

  async getMedication(id: string): Promise<Medication> {
    const response = await fetch(`${API_BASE_URL}/medications/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch medication');
    const result = await response.json();
    const med = result.data;
    return { ...med, id: med._id };
  }

  async createMedication(data: Partial<Medication>): Promise<Medication> {
    const response = await fetch(`${API_BASE_URL}/medications`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create medication');
    const result = await response.json();
    const med = result.data;
    return { ...med, id: med._id };
  }

  async updateMedication(id: string, data: Partial<Medication>): Promise<Medication> {
    const response = await fetch(`${API_BASE_URL}/medications/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update medication');
    const result = await response.json();
    const med = result.data;
    return { ...med, id: med._id };
  }

  async deleteMedication(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/medications/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete medication');
  }
}

export const medicationService = new MedicationService();
export default medicationService; 