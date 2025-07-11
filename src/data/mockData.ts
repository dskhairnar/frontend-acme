
import { WeightEntry, Shipment, DashboardStats, Medication } from '@/types';

export const mockWeightEntries: WeightEntry[] = [
  { id: '1', userId: '1', weight: 185, date: '2024-01-15', notes: 'Starting weight' },
  { id: '2', userId: '1', weight: 183, date: '2024-01-29' },
  { id: '3', userId: '1', weight: 181, date: '2024-02-12' },
  { id: '4', userId: '1', weight: 179, date: '2024-02-26' },
  { id: '5', userId: '1', weight: 177, date: '2024-03-11' },
  { id: '6', userId: '1', weight: 175, date: '2024-03-25' },
  { id: '7', userId: '1', weight: 173, date: '2024-04-08' },
  { id: '8', userId: '1', weight: 171, date: '2024-04-22' },
  { id: '9', userId: '1', weight: 169, date: '2024-05-06' },
  { id: '10', userId: '1', weight: 167, date: '2024-05-20' },
  { id: '11', userId: '1', weight: 165, date: '2024-06-03' },
  { id: '12', userId: '1', weight: 163, date: '2024-06-17' },
  { id: '13', userId: '1', weight: 162, date: '2024-07-01' },
];

export const mockMedication: Medication = {
  id: '1',
  name: 'Semaglutide',
  dosage: '1.0 mg',
  frequency: 'Weekly',
  startDate: '2024-01-15'
};

export const mockShipments: Shipment[] = [
  {
    id: '1',
    userId: '1',
    medication: mockMedication,
    status: 'delivered',
    orderDate: '2024-01-10',
    shippedDate: '2024-01-12',
    expectedDeliveryDate: '2024-01-15',
    trackingNumber: 'ACM001234567',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    }
  },
  {
    id: '2',
    userId: '1',
    medication: mockMedication,
    status: 'delivered',
    orderDate: '2024-02-05',
    shippedDate: '2024-02-07',
    expectedDeliveryDate: '2024-02-10',
    trackingNumber: 'ACM001234568',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    }
  },
  {
    id: '3',
    userId: '1',
    medication: mockMedication,
    status: 'delivered',
    orderDate: '2024-03-01',
    shippedDate: '2024-03-03',
    expectedDeliveryDate: '2024-03-06',
    trackingNumber: 'ACM001234569',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    }
  },
  {
    id: '4',
    userId: '1',
    medication: mockMedication,
    status: 'shipped',
    orderDate: '2024-07-05',
    shippedDate: '2024-07-07',
    expectedDeliveryDate: '2024-07-10',
    trackingNumber: 'ACM001234570',
    quantity: 4,
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    }
  }
];

export const mockDashboardStats: DashboardStats = {
  currentWeight: 162,
  startingWeight: 185,
  targetWeight: 150,
  weightLoss: 23,
  weightLossPercentage: 12.4,
  currentBMI: 24.8,
  nextShipmentDate: '2024-07-10',
  daysOnProgram: 177,
  totalShipments: 4
};
