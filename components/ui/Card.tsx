import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  onPress,
  style,
  elevated = true,
  padding = 'md',
}: CardProps) {
  const colors = useThemeColors();

  const getPadding = (): number => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 24;
      default: return 16;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: getPadding(),
    ...(elevated && {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    }),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}