import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  style,
}: BadgeProps) {
  const colors = useThemeColors();

  const getColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'success':
        return { bg: colors.successLight, text: colors.success };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'error':
        return { bg: colors.errorLight, text: colors.error };
      case 'info':
        return { bg: colors.infoLight, text: colors.info };
      case 'primary':
        return { bg: colors.primaryLight, text: colors.primary };
      default:
        return { bg: colors.backgroundTertiary, text: colors.textSecondary };
    }
  };

  const variantColors = getColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantColors.bg,
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 4 : 6,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: variantColors.text,
            fontSize: isSmall ? 10 : 12,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});