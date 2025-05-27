import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ParkingSession, ParkingSlot, User } from '@/app/';
import { MOCK_PARKING_SESSIONS } from '@/mocks/parkingSession';
import { fetchParkingSlots, fetchUsers } from '@/app/services/api';

interface ParkingState {
  parkingSlots: ParkingSlot[];
  parkingSessions: ParkingSession[];
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  // Fetch data
  fetchData: () => Promise<void>;
  
  // Parking sessions
  addParkingSession: (session: Omit<ParkingSession, 'id'>) => void;
  updateParkingSession: (id: string, session: Partial<ParkingSession>) => void;
  completeParkingSession: (id: string, exitTime: Date, fee: number) => void;
  
  // Getters
  getActiveSessions: () => ParkingSession[];
  getCompletedSessions: () => ParkingSession[];
  getSessionsBySlot: (slotId: string) => ParkingSession[];
  getSlotAvailability: (slotId: string) => boolean;
  getSlotById: (slotId: string) => ParkingSlot | undefined;
}

export const useParkingStore = create<ParkingState>()(
  persist(
    (set, get) => ({
      parkingSlots: [],
      parkingSessions: MOCK_PARKING_SESSIONS,
      users: [],
      isLoading: false,
      error: null,
      
      fetchData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const [slots, users] = await Promise.all([
            fetchParkingSlots(),
            fetchUsers(),
          ]);
          
          set({ 
            parkingSlots: slots, 
            users, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          set({ 
            error: 'Failed to fetch data. Please try again.', 
            isLoading: false 
          });
        }
      },
      
      addParkingSession: (session) => {
        const newSession: ParkingSession = {
          ...session,
          id: Date.now().toString(),
        };
        
        set(state => ({
          parkingSessions: [newSession, ...state.parkingSessions],
        }));
      },
      
      updateParkingSession: (id, updatedSession) => {
        set(state => ({
          parkingSessions: state.parkingSessions.map(session => 
            session.id === id 
              ? { ...session, ...updatedSession } 
              : session
          ),
        }));
      },
      
      completeParkingSession: (id, exitTime, fee) => {
        set(state => ({
          parkingSessions: state.parkingSessions.map(session => 
            session.id === id 
              ? { 
                  ...session, 
                  exitTime, 
                  fee, 
                  status: 'completed' 
                } 
              : session
          ),
        }));
      },
      
      getActiveSessions: () => {
        return get().parkingSessions.filter(session => session.status === 'active');
      },
      
      getCompletedSessions: () => {
        return get().parkingSessions.filter(session => session.status === 'completed');
      },
      
      getSessionsBySlot: (slotId) => {
        return get().parkingSessions.filter(session => session.slotId === slotId);
      },
      
      getSlotAvailability: (slotId) => {
        const activeSessions = get().getActiveSessions();
        return !activeSessions.some(session => session.slotId === slotId);
      },
      
      getSlotById: (slotId) => {
        return get().parkingSlots.find(slot => slot.id === slotId);
      },
    }),
    {
      name: 'parking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);