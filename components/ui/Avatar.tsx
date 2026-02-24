import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useThemeColors } from '@/hooks/useColorScheme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'busy';
}

export function Avatar({
  source,
  name,
  size = 'md',
  style,
  showStatus = false,
  status = 'online',
}: AvatarProps) {
  const colors = useThemeColors();

  const getSize = (): number => {
    switch (size) {
      case 'xs': return 32;
      case 'sm': return 40;
      case 'md': return 52;
      case 'lg': return 72;
      case 'xl': return 100;
      default: return 52;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'xs': return 12;
      case 'sm': return 14;
      case 'md': return 18;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 18;
    }
  };

  const getStatusSize = (): number => {
    switch (size) {
      case 'xs': return 8;
      case 'sm': return 10;
      case 'md': return 12;
      case 'lg': return 16;
      case 'xl': return 20;
      default: return 12;
    }
  };

  const getStatusColor = (): string => {
    switch (status) {
      case 'online': return colors.success;
      case 'offline': return colors.textTertiary;
      case 'busy': return colors.warning;
      default: return colors.success;
    }
  };

  const dimensions = getSize();
  const fontSize = getFontSize();
  const statusSize = getStatusSize();

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={[{ width: dimensions, height: dimensions }, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            { width: dimensions, height: dimensions, borderRadius: dimensions / 2 },
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimensions,
              height: dimensions,
              borderRadius: dimensions / 2,
              backgroundColor: colors.primaryLight,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              { fontSize, color: colors.primary },
            ]}
          >
            {name ? getInitials(name) : '?'}
          </Text>
        </View>
      )}
      {showStatus && (
        <View
          style={[
            styles.status,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: getStatusColor(),
              borderColor: colors.card,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#e5e7eb',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
  status: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});