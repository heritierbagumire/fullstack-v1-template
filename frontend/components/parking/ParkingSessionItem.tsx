import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Clock, Car, User, MapPin } from 'lucide-react-native';
import { ParkingSession } from '@/types/parking';
import { useParkingStore } from '@/store/parking-store';
import { Colors } from '@/constants/Colors';

interface ParkingSessionItemProps {
    session: ParkingSession;
    onPress?: (session: ParkingSession) => void;
}

export const ParkingSessionItem: React.FC<ParkingSessionItemProps> = ({
    session,
    onPress,
}) => {
    const { getSlotById } = useParkingStore();
    const slot = getSlotById(session.slotId);

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
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

    const handlePress = () => {
        if (onPress) {
            onPress(session);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                session.status === 'active' ? styles.activeSession : styles.completedSession
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.vehicleInfo}>
                    <Car size={16} color={Colors.text.secondary} />
                    <Text style={styles.vehiclePlate}>{session.vehiclePlate}</Text>
                </View>

                {session.status === 'completed' && session.fee && (
                    <Text style={styles.fee}>${session.fee.toFixed(2)}</Text>
                )}

                {session.status === 'active' && (
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Active</Text>
                    </View>
                )}
            </View>

            <View style={styles.details}>
                <Text style={styles.vehicleModel}>{session.vehicleModel}</Text>

                <View style={styles.infoRow}>
                    <User size={14} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>{session.driverName}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MapPin size={14} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>{slot?.SlotName || 'Unknown Slot'}</Text>
                </View>

                <View style={styles.timeInfo}>
                    <View style={styles.timeColumn}>
                        <Text style={styles.timeLabel}>Entry</Text>
                        <Text style={styles.timeValue}>{formatTime(session.entryTime)}</Text>
                        <Text style={styles.dateValue}>{formatDate(session.entryTime)}</Text>
                    </View>

                    {session.exitTime && (
                        <>
                            <View style={styles.timeDivider} />
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeLabel}>Exit</Text>
                                <Text style={styles.timeValue}>{formatTime(session.exitTime)}</Text>
                                <Text style={styles.dateValue}>{formatDate(session.exitTime)}</Text>
                            </View>
                        </>
                    )}

                    <View style={styles.durationContainer}>
                        <Clock size={14} color={Colors.text.secondary} />
                        <Text style={styles.duration}>{getDuration()}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
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
    activeSession: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary.main,
    },
    completedSession: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.status.success,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    vehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehiclePlate: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginLeft: 8,
    },
    fee: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary.main,
    },
    statusBadge: {
        backgroundColor: Colors.primary.main + '20', // 20% opacity
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.primary.main,
    },
    details: {
        padding: 16,
    },
    vehicleModel: {
        fontSize: 14,
        color: Colors.text.primary,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoText: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginLeft: 8,
    },
    timeInfo: {
        flexDirection: 'row',
        marginTop: 12,
        position: 'relative',
    },
    timeColumn: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 12,
        color: Colors.text.light,
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    dateValue: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
    timeDivider: {
        width: 1,
        backgroundColor: Colors.border,
        marginHorizontal: 16,
    },
    durationContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    duration: {
        fontSize: 12,
        color: Colors.text.secondary,
        marginLeft: 4,
    },
});