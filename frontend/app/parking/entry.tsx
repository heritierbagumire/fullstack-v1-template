import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Car, User, Phone } from 'lucide-react-native';
import { useParkingStore } from '@/store/parking-store';
import { SlotSelector } from '@/components/parking/SlotSelector';
import { Button } from '@/components/ui/Button';
import { registerVehicleEntry } from '@/app/services/api';
import { Colors } from '@/constants/Colors';

export default function VehicleEntryScreen() {
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [driverName, setDriverName] = useState('');
    const [driverContact, setDriverContact] = useState('');
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { parkingSlots, fetchData, addParkingSession } = useParkingStore();

    useEffect(() => {
        if (parkingSlots.length > 0 && !selectedSlotId) {
            // Find first available slot
            const availableSlot = parkingSlots.find(slot =>
                useParkingStore.getState().getSlotAvailability(slot.id)
            );

            if (availableSlot) {
                setSelectedSlotId(availableSlot.id);
            }
        }
    }, [parkingSlots]);

    const validateForm = () => {
        if (!vehiclePlate.trim()) {
            Alert.alert('Error', 'Please enter vehicle plate number');
            return false;
        }

        if (!vehicleModel.trim()) {
            Alert.alert('Error', 'Please enter vehicle model');
            return false;
        }

        if (!driverName.trim()) {
            Alert.alert('Error', 'Please enter driver name');
            return false;
        }

        if (!selectedSlotId) {
            Alert.alert('Error', 'Please select a parking slot');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // In a real app, this would call the API
            const result = await registerVehicleEntry({
                vehiclePlate,
                vehicleModel,
                driverName,
                driverContact,
                slotId: selectedSlotId,
            });

            if (result.success) {
                // Add to local state
                addParkingSession({
                    vehiclePlate,
                    vehicleModel,
                    driverName,
                    driverContact,
                    slotId: selectedSlotId,
                    entryTime: new Date(),
                    status: 'active',
                });

                Alert.alert(
                    'Success',
                    'Vehicle entry registered successfully',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            }
        } catch (error) {
            console.error('Error registering vehicle entry:', error);
            Alert.alert('Error', 'Failed to register vehicle entry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Register Vehicle Entry</Text>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Vehicle Information</Text>

                    <View style={styles.inputContainer}>
                        <Car size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Plate Number"
                            placeholderTextColor={Colors.text.light}
                            value={vehiclePlate}
                            onChangeText={setVehiclePlate}
                            autoCapitalize="characters"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Car size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Model"
                            placeholderTextColor={Colors.text.light}
                            value={vehicleModel}
                            onChangeText={setVehicleModel}
                        />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Driver Information</Text>

                    <View style={styles.inputContainer}>
                        <User size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Driver Name"
                            placeholderTextColor={Colors.text.light}
                            value={driverName}
                            onChangeText={setDriverName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Phone size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Driver Contact (Optional)"
                            placeholderTextColor={Colors.text.light}
                            value={driverContact}
                            onChangeText={setDriverContact}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <SlotSelector
                    selectedSlotId={selectedSlotId}
                    onSelectSlot={setSelectedSlotId}
                />

                <Button
                    title={isSubmitting ? 'Registering...' : 'Register Entry'}
                    onPress={handleSubmit}
                    isLoading={isSubmitting}
                    style={styles.submitButton}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 24,
    },
    formSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: Colors.text.primary,
    },
    submitButton: {
        marginTop: 16,
    },
});