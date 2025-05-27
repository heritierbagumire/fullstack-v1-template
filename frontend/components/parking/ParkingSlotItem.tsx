import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MapPin, DollarSign } from 'lucide-react-native';
import { ParkingSlot } from '@/types/parking';
import { useParkingStore } from '@/store/parking-store';
import { Colors } from '@/constants/Colors';

interface ParkingSlotItemProps {
    slot: ParkingSlot;
    onPress?: (slot: ParkingSlot) => void;
}

export const ParkingSlotItem: React.FC<ParkingSlotItemProps> = ({
    slot,
    onPress,
}) => {
    const { getSlotAvailability } = useParkingStore();
    const isAvailable = getSlotAvailability(slot.id);

    const handlePress = () => {
        if (onPress) {
            onPress(slot);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isAvailable ? styles.availableSlot : styles.occupiedSlot
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <MapPin size={20} color={Colors.text.primary} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.slotName}>{slot.SlotName}</Text>
                    <Text style={styles.location}>{slot.location}</Text>
                </View>
            </View>

            <View style={styles.rightSection}>
                <View style={styles.priceContainer}>
                    <DollarSign size={16} color={Colors.primary.main} />
                    <Text style={styles.price}>{slot.price}/hr</Text>
                </View>
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        marginBottom: 12,
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
    availableSlot: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.status.success,
    },
    occupiedSlot: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.status.error,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
    },
    slotName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.primary.main,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    availableBadge: {
        backgroundColor: Colors.status.success + '20', // 20% opacity
    },
    occupiedBadge: {
        backgroundColor: Colors.status.error + '20', // 20% opacity
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    availableText: {
        color: Colors.status.success,
    },
    occupiedText: {
        color: Colors.status.error,
    },
});