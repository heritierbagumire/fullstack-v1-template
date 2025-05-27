import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { fetchUsers } from '@/app/services/api';
import { User } from '@/types/parking';
import { Colors } from '@/constants/Colors';

export default function DriversScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.vehicles.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const loadUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (err) {
            setError('Failed to load drivers. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const renderDriverItem = ({ item }: { item: User }) => (
        <TouchableOpacity style={styles.driverItem} activeOpacity={0.7}>
            <Image
                source={{ uri: item.avatar }}
                style={styles.avatar}
            />

            <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{item.name}</Text>
                <Text style={styles.driverEmail}>{item.email}</Text>
                <View style={styles.vehicleContainer}>
                    <Text style={styles.vehicleLabel}>Vehicle:</Text>
                    <Text style={styles.vehicleText}>{item.vehicles}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Registered Drivers</Text>

            <View style={styles.searchContainer}>
                <Search size={20} color={Colors.text.secondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, email or vehicle"
                    placeholderTextColor={Colors.text.light}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                        <X size={18} color={Colors.text.secondary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderEmptyList = () => {
        if (isLoading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={Colors.primary.main} />
                    <Text style={styles.loadingText}>Loading drivers...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadUsers}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (searchQuery && filteredUsers.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No drivers match your search</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No drivers registered yet</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredUsers}
                renderItem={renderDriverItem}
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
        paddingTop: 16,
        paddingBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: Colors.text.primary,
    },
    clearButton: {
        padding: 8,
    },
    driverItem: {
        flexDirection: 'row',
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    driverEmail: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 8,
    },
    vehicleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.secondary,
        marginRight: 4,
    },
    vehicleText: {
        fontSize: 14,
        color: Colors.text.primary,
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
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginTop: 16,
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