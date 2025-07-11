
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  enrollmentDate: string;
}

export interface WeightEntry {
  id: string;
  userId: string;
  weight: number;
  date: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

export interface Shipment {
  id: string;
  userId: string;
  medication: Medication;
  status: 'pending' | 'shipped' | 'delivered' | 'delayed';
  orderDate: string;
  shippedDate?: string;
  expectedDeliveryDate: string;
  trackingNumber?: string;
  quantity: number;
  items: { name: string; quantity: number; price?: number }[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface DashboardStats {
  currentWeight: number;
  startingWeight: number;
  targetWeight?: number;
  weightLoss: number;
  weightLossPercentage: number;
  currentBMI: number;
  nextShipmentDate?: string;
  daysOnProgram: number;
  totalShipments: number;
}
