import { User, ParkingSlot } from '@/types/parking';

const API_BASE_URL = 'https://683367e1464b499636ff593a.mockapi.io/api/v1';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchParkingSlots = async (): Promise<ParkingSlot[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/plates`);
    if (!response.ok) {
      throw new Error('Failed to fetch parking slots');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching parking slots:', error);
    throw error;
  }
};

// In a real app, these would be actual API calls
// For now, we'll simulate them
export const registerVehicleEntry = async (data: {
  vehiclePlate: string;
  vehicleModel: string;
  driverName: string;
  driverContact?: string;
  slotId: string;
}): Promise<{ success: boolean; sessionId: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, sessionId: Date.now().toString() };
};

export const registerVehicleExit = async (sessionId: string): Promise<{
  success: boolean;
  fee: number;
  duration: number;
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  const fee = Math.floor(Math.random() * 50) + 10;
  const duration = Math.floor(Math.random() * 8) + 1;
  return { success: true, fee, duration };
};