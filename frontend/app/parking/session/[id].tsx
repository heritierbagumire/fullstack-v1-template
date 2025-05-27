import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
    Car,
    User,
    Phone,
    MapPin,
    Clock,
    DollarSign,
    Printer,
    Share2
} from 'lucide-react-native';
import { useParkingStore } from '@/store/parking-store';
import { Button } from '@/components/ui/Button';
import { registerVehicleExit } from '@/app/services/api';
import { Colors } from '@/constants/Colors';

export default function SessionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const {
        parkingSessions,
        getSlotById,
        completeParkingSession
    } = useParkingStore();

    const session = parkingSessions.find(s => s.id === id);

    if (!session) {
        return (
            <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Parking session not found</Text>
                <Button
                    title="Go Back"
                    onPress={() => router.back()}
                    style={styles.backButton}
                />
            </View>
        );
    }

    const slot = getSlotById(session.slotId);

    const formatDateTime = (date: Date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDuration = () => {
        if (!session.exitTime) return 'In progress';

        const entry = new Date(session.entryTime);
        const exit = new Date(session.exitTime);
        const diffMs = exit.getTime() - entry.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${diffHrs}h ${diffMins}m`;
    };

    const handleProcessExit = async () => {
        if (session.status === 'completed') return;

        try {
            // In a real app, this would call the API
            const result = await registerVehicleExit(session.id);

            if (result.success) {
                // Update local state
                completeParkingSession(
                    session.id,
                    new Date(),
                    result.fee
                );

                Alert.alert(
                    'Success',
                    'Vehicle exit processed successfully',
                    [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
                );
            }
        } catch (error) {
            console.error('Error processing exit:', error);
            Alert.alert('Error', 'Failed to process vehicle exit. Please try again.');
        }
    };

    const handlePrint = () => {
        Alert.alert('Print', 'Printing functionality would be implemented here');
    };

    const handleShare = () => {
        Alert.alert('Share', 'Sharing functionality would be implemented here');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.statusContainer}>
                    <Text style={[
                        styles.statusBadge,
                        session.status === 'active' ? styles.activeStatus : styles.completedStatus
                    ]}>
                        {session.status === 'active' ? 'Active' : 'Completed'}
                    </Text>
                </View>

                <Text style={styles.vehiclePlate}>{session.vehiclePlate}</Text>
                <Text style={styles.vehicleModel}>{session.vehicleModel}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.infoRow}>
                    <User size={20} color={Colors.text.secondary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Driver</Text>
                        <Text style={styles.infoValue}>{session.driverName}</Text>
                    </View>
                </View>

                {session.driverContact && (
                    <View style={styles.infoRow}>
                        <Phone size={20} color={Colors.text.secondary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Contact</Text>
                            <Text style={styles.infoValue}>{session.driverContact}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <MapPin size={20} color={Colors.text.secondary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Parking Slot</Text>
                        <Text style={styles.infoValue}>
                            {slot ? `${slot.SlotName} (${slot.location})` : 'Unknown'}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.timeSection}>
                    <View style={styles.timeRow}>
                        <View style={styles.timeItem}>
                            <Text style={styles.timeLabel}>Entry Time</Text>
                            <Text style={styles.timeValue}>{formatDateTime(session.entryTime)}</Text>
                        </View>

                        {session.exitTime && (
                            <View style={styles.timeItem}>
                                <Text style={styles.timeLabel}>Exit Time</Text>
                                <Text style={styles.timeValue}>{formatDateTime(session.exitTime)}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.durationContainer}>
                        <Clock size={16} color={Colors.text.secondary} />
                        <Text style={styles.durationText}>Duration: {getDuration()}</Text>
                    </View>
                </View>

                {session.status === 'completed' && session.fee && (
                    <View style={styles.feeContainer}>
                        <DollarSign size={24} color={Colors.primary.main} />
                        <Text style={styles.feeLabel}>Total Fee</Text>
                        <Text style={styles.feeValue}>${session.fee.toFixed(2)}</Text>
                    </View>
                )}
            </View>

            <View style={styles.actionsContainer}>
                {session.status === 'active' ? (
                    <Button
                        title="Process Exit"
                        onPress={handleProcessExit}
                        style={styles.exitButton}
                    />
                ) : (
                    <View style={styles.completedActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handlePrint}
                        >
                            <Printer size={20} color={Colors.primary.main} />
                            <Text style={styles.actionText}>Print</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleShare}
                        >
                            <Share2 size={20} color={Colors.primary.main} />
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
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
    statusContainer: {
        marginBottom: 16,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        fontSize: 14,
        fontWeight: '600',
    },
    activeStatus: {
        backgroundColor: Colors.primary.main + '20',
        color: Colors.primary.main,
    },
    completedStatus: {
        backgroundColor: Colors.status.success + '20',
        color: Colors.status.success,
    },
    vehiclePlate: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    vehicleModel: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
    card: {
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoContent: {
        marginLeft: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    infoValue: {
        fontSize: 16,
        color: Colors.text.primary,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 16,
    },
    timeSection: {
        marginBottom: 16,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    timeItem: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 16,
        color: Colors.text.primary,
        fontWeight: '500',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.secondary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    durationText: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginLeft: 8,
    },
    feeContainer: {
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    feeLabel: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginTop: 8,
    },
    feeValue: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.primary.main,
    },
    actionsContainer: {
        marginTop: 8,
    },
    exitButton: {
        backgroundColor: Colors.status.success,
    },
    completedActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        alignItems: 'center',
        padding: 16,
    },
    actionText: {
        marginTop: 8,
        fontSize: 14,
        color: Colors.primary.main,
        fontWeight: '500',
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