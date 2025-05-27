import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { CATEGORIES } from '@/constants/categories';
import { CategoryType } from '@/types/transaction';
import { CategoryIcon } from './CategoryIcon';
import { Colors } from '@/constants/Colors';

interface CategorySelectorProps {
    selectedCategory: CategoryType;
    onSelectCategory: (category: CategoryType) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Category</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryItem,
                            selectedCategory === category.id && styles.selectedCategory,
                        ]}
                        onPress={() => onSelectCategory(category.id as CategoryType)}
                        activeOpacity={0.7}
                    >
                        <CategoryIcon
                            category={category.id as CategoryType}
                            size={20}
                            color={selectedCategory === category.id ? Colors.background.card : Colors.text.primary}
                        />
                        <Text
                            style={[
                                styles.categoryName,
                                selectedCategory === category.id && styles.selectedCategoryText,
                            ]}
                            numberOfLines={1}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
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
    categoriesContainer: {
        paddingHorizontal: 4,
        paddingBottom: 8,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.background.card,
    },
    selectedCategory: {
        backgroundColor: Colors.primary.main,
        borderColor: Colors.primary.main,
    },
    categoryName: {
        fontSize: 14,
        marginLeft: 6,
        color: Colors.text.primary,
    },
    selectedCategoryText: {
        color: Colors.background.card,
        fontWeight: '500',
    },
});