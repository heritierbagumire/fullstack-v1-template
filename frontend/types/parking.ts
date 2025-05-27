export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
  vehicles: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSlot {
  id: string;
  SlotName: string;
  location: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSession {
  id: string;
  vehiclePlate: string;
  vehicleModel: string;
  driverName: string;
  driverContact?: string;
  slotId: string;
  entryTime: Date;
  exitTime?: Date;
  status: 'active' | 'completed';
  fee?: number;
}

export type ParkingStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';