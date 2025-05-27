import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Clock, DollarSign } from 'lucide-react-native';
import { useParkingStore } from '@/store/parking-store';
import { ParkingSessionItem } from '@/components/parking/ParkingSessionItem';
import { Button } from '@/components/ui/Button';
import { ParkingSession } from '@/types/parking';
import { registerVehicleExit } from '@/services/api';
import { Colors } from '@/constants/Colors';

export default function VehicleExitScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState<ParkingSession | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fee, setFee] = useState<number | null>(null);
    const [duration, setDuration] = useState<number | null>(null);

    const { getActiveSessions, completeParkingSession, getSlotById } = useParkingStore();

    const activeSessions = getActiveSessions();

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            Alert.alert('Error', 'Please enter a vehicle plate number');
            return;
        }

        setIsSearching(true);

        // Simulate API call
        setTimeout(() => {
            const query = searchQuery.toLowerCase();
            const session = activeSessions.find(s =>
                s.vehiclePlate.toLowerCase().includes(query)
            );

            setSelectedSession(session || null);
            setIsSearching(false);

            if (!session) {
                Alert.alert('Not Found', 'No active parking session found for this vehicle');
            }
        }, 1000);
    };

    const calculateFee = async () => {
        if (!selectedSession) return;

        setIsProcessing(true);

        try {
            // In a real app, this would call the API
            const result = await registerVehicleExit(selectedSession.id);

            if (result.success) {
                setFee(result.fee);
                setDuration(result.duration);
            }
        } catch (error) {
            console.error('Error calculating fee:', error);
            Alert.alert('Error', 'Failed to calculate parking fee. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCompleteExit = () => {
        if (!selectedSession || fee === null) return;

        // Update local state
        completeParkingSession(
            selectedSession.id,
            new Date(),
            fee
        );

        Alert.alert(
            'Success',
            'Vehicle exit processed successfully',
            [{ text: 'OK', onPress: () => router.back() }]
        );
    };

    const renderSearchSection = () => (
        <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Find Vehicle</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Enter vehicle plate number"
                    placeholderTextColor={Colors.text.light}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="characters"
                />

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                    disabled={isSearching}
                >
                    {isSearching ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Search size={20} color="#FFFFFF" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderVehicleDetails = () => {
        if (!selectedSession) return null;

        const slot = getSlotById(selectedSession.slotId);

        return (
            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Vehicle Details</Text>

                <ParkingSessionItem
                    session={selectedSession}
                />

                {fee === null ? (
                    <Button
                        title={isProcessing ? 'Calculating...' : 'Calculate Fee'}
                        onPress={calculateFee}
                        isLoading={isProcessing}
                        style={styles.calculateButton}
                    />
                ) : (
                    <View style={styles.feeSection}>
                        <View style={styles.feeCard}>
                            <View style={styles.feeItem}>
                                <Clock size={20} color={Colors.text.secondary} />
                                <View style={styles.feeTextContainer}>
                                    <Text style={styles.feeLabel}>Duration</Text>
                                    <Text style={styles.feeValue}>{duration} hours</Text>
                                </View>
                            </View>

                            <View style={styles.feeDivider} />

                            <View style={styles.feeItem}>
                                <DollarSign size={20} color={Colors.text.secondary} />
                                <View style={styles.feeTextContainer}>
                                    <Text style={styles.feeLabel}>Total Fee</Text>
                                    <Text style={styles.feeValue}>${fee.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>

                        <Button
                            title="Complete Exit"
                            onPress={handleCompleteExit}
                            style={styles.completeButton}
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.title}>Process Vehicle Exit</Text>

            {renderSearchSection()}
            {renderVehicleDetails()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 24,
    },
    searchSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text.primary,
        marginRight: 12,
    },
    searchButton: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: Colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsSection: {
        marginBottom: 24,
    },
    calculateButton: {
        marginTop: 16,
    },
    feeSection: {
        marginTop: 16,
    },
    feeCard: {
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    feeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    feeTextContainer: {
        marginLeft: 12,
    },
    feeLabel: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    feeValue: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    feeDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 8,
    },
    completeButton: {
        backgroundColor: Colors.status.success,
    },
});