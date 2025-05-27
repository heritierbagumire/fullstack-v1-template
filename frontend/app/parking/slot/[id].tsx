import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MapPin, DollarSign, Clock, Car } from 'lucide-react-native';
import { useParkingStore } from '@/store/parking-store';
import { ParkingSessionItem } from '@/components/parking/ParkingSessionItem';
import { Button } from '@/components/ui/Button';
import { ParkingSession } from '@/types/parking';
import Colors from '@/constants/colors';

export default function SlotDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const {
        getSlotById,
        getSessionsBySlot,
        getSlotAvailability
    } = useParkingStore();

    const slot = getSlotById(id);

    if (!slot) {
        return (
            <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Parking slot not found</Text>
                <Button
                    title="Go Back"
                    onPress={() => router.back()}
                    style={styles.backButton}
                />
            </View>
        );
    }

    const isAvailable = getSlotAvailability(slot.id);
    const sessions = getSessionsBySlot(slot.id);

    // Sort sessions by entry time (newest first)
    const sortedSessions = [...sessions].sort((a, b) => {
        return new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime();
    });

    const activeSession = sortedSessions.find(session => session.status === 'active');

    const handleRegisterEntry = () => {
        router.push({
            pathname: '/parking/entry',
            params: { slotId: slot.id }
        });
    };

    const handleSessionPress = (session: ParkingSession) => {
        router.push(`/parking/session/${session.id}`);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <MapPin size={32} color={Colors.text.primary} />
                </View>
                <Text style={styles.slotName}>{slot.SlotName}</Text>
                <Text style={styles.location}>{slot.location}</Text>

                <View style={[
                    styles.statusBadge,
                    isAvailable ? styles.availableBadge : styles.occupiedBadge
                ]}>
                    <Text style={[
                        styles.statusText,
                        isAvailable ? styles.availableText : styles.occupiedText
                    ]}>
                        {isAvailable ? 'Available' : 'Occupied'}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                    <DollarSign size={20} color={Colors.text.secondary} />
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Price</Text>
                        <Text style={styles.detailValue}>${slot.price}/hour</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <Clock size={20} color={Colors.text.secondary} />
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Last Updated</Text>
                        <Text style={styles.detailValue}>
                            {new Date(slot.updatedAt).toLocaleString()}
                        </Text>
                    </View>
                </View>
            </View>

            {isAvailable ? (
                <Button
                    title="Register New Entry"
                    onPress={handleRegisterEntry}
                    style={styles.actionButton}
                />
            ) : activeSession ? (
                <View style={styles.activeSessionContainer}>
                    <Text style={styles.sectionTitle}>Current Vehicle</Text>
                    <ParkingSessionItem
                        session={activeSession}
                        onPress={handleSessionPress}
                    />
                    <Button
                        title="Process Exit"
                        onPress={() => router.push(`/parking/session/${activeSession.id}`)}
                        style={[styles.actionButton, styles.exitButton]}
                    />
                </View>
            ) : null}

            {sortedSessions.length > 0 && (
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Parking History</Text>

                    {sortedSessions
                        .filter(session => session !== activeSession)
                        .map(session => (
                            <ParkingSessionItem
                                key={session.id}
                                session={session}
                                onPress={handleSessionPress}
                            />
                        ))
                    }
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.secondary,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.background.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    slotName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    location: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginBottom: 16,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    availableBadge: {
        backgroundColor: Colors.status.success + '20',
    },
    occupiedBadge: {
        backgroundColor: Colors.status.error + '20',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    availableText: {
        color: Colors.status.success,
    },
    occupiedText: {
        color: Colors.status.error,
    },
    detailsCard: {
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailContent: {
        marginLeft: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    detailValue: {
        fontSize: 16,
        color: Colors.text.primary,
        fontWeight: '500',
    },
    actionButton: {
        marginBottom: 24,
    },
    exitButton: {
        backgroundColor: Colors.status.success,
    },
    activeSessionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    historySection: {
        marginBottom: 16,
    },
    notFoundContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    notFoundText: {
        fontSize: 18,
        color: Colors.text.secondary,
        marginBottom: 16,
    },
    backButton: {
        width: 200,
    },
});