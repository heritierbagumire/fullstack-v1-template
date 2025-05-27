import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@/constants/categories';
import { CategoryIcon } from '@/components/transactions/CategoryIcon';
import { Colors } from '@/constants/Colors';

export default function CategoriesScreen() {
    const router = useRouter();

    const transportCategories = CATEGORIES.filter(category =>
        ['fuel', 'maintenance', 'tolls', 'parking', 'insurance', 'vehicle_purchase', 'transportation'].includes(category.id)
    );

    const otherCategories = CATEGORIES.filter(category =>
        !['fuel', 'maintenance', 'tolls', 'parking', 'insurance', 'vehicle_purchase', 'transportation'].includes(category.id)
    );

    const handleCategoryPress = (categoryId: string) => {
        // In a real app, this would navigate to a filtered transactions list
        console.log(`Category pressed: ${categoryId}`);
    };

    const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <CategoryIcon category={item.id as any} size={24} />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Transport Categories</Text>
            <View style={styles.categoriesGrid}>
                {transportCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryCard}
                        onPress={() => handleCategoryPress(category.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardIconContainer}>
                            <CategoryIcon category={category.id as any} size={28} />
                        </View>
                        <Text style={styles.cardCategoryName}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Other Categories</Text>
            <FlatList
                data={otherCategories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                numColumns={1}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.secondary,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 16,
        marginTop: 8,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    categoryCard: {
        width: '48%',
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
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
    cardIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardCategoryName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text.primary,
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 16,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
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
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
    },
});