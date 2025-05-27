import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, RefreshCw } from 'lucide-react-native';
import { useParkingStore } from '@/store/parking-store';
import { useAuthStore } from '@/store/auth-store';
import { ParkingSlotItem } from '@/components/parking/ParkingSlotItem';
import { ParkingSessionItem } from '@/components/parking/ParkingSessionItem';
import { ParkingSlot, ParkingSession } from '@/types/parking';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    parkingSlots,
    parkingSessions,
    getActiveSessions,
    isLoading,
    error,
    fetchData,
  } = useParkingStore();

  useEffect(() => {
    fetchData();
  }, []);

  const activeSessions = getActiveSessions();

  // Sort slots by availability
  const sortedSlots = [...parkingSlots].sort((a, b) => {
    const slotA = useParkingStore.getState().getSlotAvailability(a.id);
    const slotB = useParkingStore.getState().getSlotAvailability(b.id);

    if (slotA && !slotB) return -1;
    if (!slotA && slotB) return 1;
    return 0;
  });

  const handleAddVehicle = () => {
    router.push('/parking/entry');
  };

  const handleSlotPress = (slot: ParkingSlot) => {
    router.push(`/parking/slot/${slot.id}`);
  };

  const handleSessionPress = (session: ParkingSession) => {
    router.push(`/parking/session/${session.id}`);
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{user?.name || 'Parking Attendant'}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddVehicle}
          >
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchData}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary.main} />
            ) : (
              <RefreshCw size={20} color={Colors.text.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{parkingSlots.length}</Text>
          <Text style={styles.statLabel}>Total Slots</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {parkingSlots.filter(slot =>
              useParkingStore.getState().getSlotAvailability(slot.id)
            ).length}
          </Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeSessions.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Parking Slots</Text>
    </>
  );

  const renderActiveSessionsHeader = () => {
    if (activeSessions.length === 0) return null;

    return (
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        Active Sessions
      </Text>
    );
  };

  const renderActiveSessionsList = () => {
    if (activeSessions.length === 0) return null;

    return (
      <View style={styles.sessionsContainer}>
        {activeSessions.map(session => (
          <ParkingSessionItem
            key={session.id}
            session={session}
            onPress={handleSessionPress}
          />
        ))}
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No parking slots available</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={fetchData}
      >
        <Text style={styles.emptyButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedSlots}
        renderItem={({ item }) => (
          <ParkingSlotItem
            slot={item}
            onPress={handleSlotPress}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <>
            {renderActiveSessionsHeader()}
            {renderActiveSessionsList()}
          </>
        }
        ListEmptyComponent={isLoading ? null : renderEmptyList}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.main,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sessionsContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.status.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});