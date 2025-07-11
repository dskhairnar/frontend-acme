import { WeightEntry } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface WeightStats {
  totalEntries: number;
  averageWeight: number;
  weightChange: number;
  weightChangePercentage: number;
  firstEntry: WeightEntry;
  lastEntry: WeightEntry;
  entries: WeightEntry[];
}

class WeightEntryService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('acme-token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401) {
        localStorage.removeItem('acme-token');
        localStorage.removeItem('acme-user');
        throw new Error('Authentication expired. Please log in again.');
      }
      
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Get all weight entries
  async getWeightEntries(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<WeightEntry[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/weight-entries?${searchParams.toString()}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    const result: ApiResponse<WeightEntry[]> = await this.handleResponse(response);
    return result.data || [];
  }

  // Create a new weight entry
  async createWeightEntry(data: Omit<WeightEntry, 'id' | 'userId'>): Promise<WeightEntry> {
    const response = await fetch(`${API_BASE_URL}/weight-entries`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<WeightEntry> = await this.handleResponse(response);
    return result.data!;
  }

  // Get a specific weight entry
  async getWeightEntry(id: string): Promise<WeightEntry> {
    const response = await fetch(`${API_BASE_URL}/weight-entries/${id}`, {
      headers: this.getAuthHeaders(),
    });

    const result: ApiResponse<WeightEntry> = await this.handleResponse(response);
    return result.data!;
  }

  // Update a weight entry
  async updateWeightEntry(id: string, data: Partial<Omit<WeightEntry, 'id' | 'userId'>>): Promise<WeightEntry> {
    const response = await fetch(`${API_BASE_URL}/weight-entries/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<WeightEntry> = await this.handleResponse(response);
    return result.data!;
  }

  // Delete a weight entry
  async deleteWeightEntry(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/weight-entries/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    await this.handleResponse(response);
  }

  // Get weight statistics
  async getWeightStats(params?: {
    period?: 'week' | 'month' | 'quarter' | 'year';
    startDate?: string;
    endDate?: string;
  }): Promise<WeightStats> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/weight-entries/stats/summary?${searchParams.toString()}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    const result: ApiResponse<WeightStats> = await this.handleResponse(response);
    return result.data!;
  }
}

export const weightEntryService = new WeightEntryService();
export default weightEntryService; 