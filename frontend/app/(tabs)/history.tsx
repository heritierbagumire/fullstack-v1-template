import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Filter } from 'lucide-react-native';
import { useParkingStore } from '@/store/parking-store';
import { ParkingSessionItem } from '@/components/parking/ParkingSessionItem';
import { ParkingSession } from '@/types/parking';
import { Colors } from '@/constants/Colors';

export default function HistoryScreen() {
    const router = useRouter();
    const { getCompletedSessions } = useParkingStore();

    const completedSessions = getCompletedSessions();

    // Sort by exit time (newest first)
    const sortedSessions = [...completedSessions].sort((a, b) => {
        const dateA = a.exitTime ? new Date(a.exitTime).getTime() : 0;
        const dateB = b.exitTime ? new Date(b.exitTime).getTime() : 0;
        return dateB - dateA;
    });

    const handleSessionPress = (session: ParkingSession) => {
        router.push({
            pathname: '/parking/session/[id]',
            params: { id: session.id }
        });
    };

    const calculateTotalRevenue = () => {
        return completedSessions.reduce((total, session) => {
            return total + (session.fee || 0);
        }, 0);
    };

    const renderHeader = () => (
        <>
            <View style={styles.header}>
                <Text style={styles.title}>Parking History</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Filter size={20} color={Colors.text.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsCard}>
                <View style={styles.statsHeader}>
                    <Text style={styles.statsTitle}>Summary</Text>
                    <View style={styles.dateContainer}>
                        <Calendar size={16} color={Colors.text.secondary} />
                        <Text style={styles.dateText}>Today</Text>
                    </View>
                </View>

                <View style={styles.statsContent}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{completedSessions.length}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>${calculateTotalRevenue().toFixed(2)}</Text>
                        <Text style={styles.statLabel}>Revenue</Text>
                    </View>
                </View>
            </View>
        </>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No completed parking sessions</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedSessions}
                renderItem={({ item }) => (
                    <ParkingSessionItem
                        session={item}
                        onPress={handleSessionPress}
                    />
                )}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyList}
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
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background.card,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsCard: {
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 16,
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dateText: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginLeft: 4,
    },
    statsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
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
    statDivider: {
        width: 1,
        backgroundColor: Colors.border,
        marginHorizontal: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
});