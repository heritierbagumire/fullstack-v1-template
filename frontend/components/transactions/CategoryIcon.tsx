import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Fuel,
    Wrench,
    Map,
    Car,
    Shield,
    Truck,
    Coffee,
    ShoppingBag,
    Train,
    Film,
    FileText,
    DollarSign,
    MoreHorizontal
} from 'lucide-react-native';
import { CategoryType } from '@/types/transaction';
import { Colors } from '@/constants/Colors'; 

interface CategoryIconProps {
    category: CategoryType;
    size?: number;
    color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
    category,
    size = 24,
    color = Colors.text.primary,
}) => {
    const getIcon = () => {
        switch (category) {
            case 'fuel':
                return <Fuel size={size} color={color} />;
            case 'maintenance':
                return <Wrench size={size} color={color} />;
            case 'tolls':
                return <Map size={size} color={color} />;
            case 'parking':
                return <Car size={size} color={color} />;
            case 'insurance':
                return <Shield size={size} color={color} />;
            case 'vehicle_purchase':
                return <Truck size={size} color={color} />;
            case 'food':
                return <Coffee size={size} color={color} />;
            case 'shopping':
                return <ShoppingBag size={size} color={color} />;
            case 'transportation':
                return <Train size={size} color={color} />;
            case 'entertainment':
                return <Film size={size} color={color} />;
            case 'bills':
                return <FileText size={size} color={color} />;
            case 'income':
                return <DollarSign size={size} color={color} />;
            case 'other':
            default:
                return <MoreHorizontal size={size} color={color} />;
        }
    };

    return (
        <View style={[
            styles.container,
            { width: size * 1.5, height: size * 1.5 }
        ]}>
            {getIcon()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        backgroundColor: Colors.background.secondary,
    },
});