import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { MapPin } from 'lucide-react-native';
import { ParkingSlot } from '@/types/parking';
import { useParkingStore } from '@/store/parking-store';
import { Colors } from '@/constants/Colors';

interface SlotSelectorProps {
    selectedSlotId: string;
    onSelectSlot: (slotId: string) => void;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
    selectedSlotId,
    onSelectSlot,
}) => {
    const { parkingSlots, getSlotAvailability } = useParkingStore();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Parking Slot</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.slotsContainer}
            >
                {parkingSlots.map((slot) => {
                    const isAvailable = getSlotAvailability(slot.id);
                    const isSelected = selectedSlotId === slot.id;

                    return (
                        <TouchableOpacity
                            key={slot.id}
                            style={[
                                styles.slotItem,
                                isSelected && styles.selectedSlot,
                                !isAvailable && styles.unavailableSlot,
                            ]}
                            onPress={() => isAvailable && onSelectSlot(slot.id)}
                            activeOpacity={isAvailable ? 0.7 : 1}
                            disabled={!isAvailable}
                        >
                            <View style={[
                                styles.iconContainer,
                                isSelected && styles.selectedIconContainer,
                                !isAvailable && styles.unavailableIconContainer,
                            ]}>
                                <MapPin
                                    size={16}
                                    color={
                                        isSelected
                                            ? Colors.background.card
                                            : !isAvailable
                                                ? Colors.text.light
                                                : Colors.text.primary
                                    }
                                />
                            </View>
                            <Text
                                style={[
                                    styles.slotName,
                                    isSelected && styles.selectedText,
                                    !isAvailable && styles.unavailableText,
                                ]}
                                numberOfLines={1}
                            >
                                {slot.SlotName}
                            </Text>
                            <Text
                                style={[
                                    styles.slotPrice,
                                    isSelected && styles.selectedText,
                                    !isAvailable && styles.unavailableText,
                                ]}
                            >
                                ${slot.price}/hr
                            </Text>
                            {!isAvailable && (
                                <View style={styles.unavailableBadge}>
                                    <Text style={styles.unavailableBadgeText}>Occupied</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
        marginBottom: 12,
        marginLeft: 4,
    },
    slotsContainer: {
        paddingHorizontal: 4,
        paddingBottom: 8,
    },
    slotItem: {
        width: 140,
        padding: 12,
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background.card,
    },
    selectedSlot: {
        backgroundColor: Colors.primary.main,
        borderColor: Colors.primary.main,
    },
    unavailableSlot: {
        opacity: 0.6,
        borderColor: Colors.border,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    selectedIconContainer: {
        backgroundColor: Colors.primary.light,
    },
    unavailableIconContainer: {
        backgroundColor: Colors.background.secondary,
    },
    slotName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    slotPrice: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
    selectedText: {
        color: Colors.background.card,
    },
    unavailableText: {
        color: Colors.text.light,
    },
    unavailableBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Colors.status.error + '20',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    unavailableBadgeText: {
        fontSize: 10,
        color: Colors.status.error,
        fontWeight: '500',
    },
});