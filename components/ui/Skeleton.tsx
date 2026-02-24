import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const colors = useThemeColors();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: typeof width === 'number' ? width : width,
          height,
          borderRadius,
          backgroundColor: colors.backgroundTertiary,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <Skeleton height={180} borderRadius={16} />
      <View style={skeletonStyles.content}>
        <Skeleton width="70%" height={20} />
        <Skeleton width="50%" height={16} style={{ marginTop: 8 }} />
        <View style={skeletonStyles.row}>
          <Skeleton width={80} height={14} />
          <Skeleton width={80} height={14} />
          <Skeleton width={80} height={14} />
        </View>
        <Skeleton width="40%" height={24} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

export function MessageSkeleton() {
  return (
    <View style={skeletonStyles.message}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={skeletonStyles.messageContent}>
        <Skeleton width="60%" height={16} />
        <Skeleton width="90%" height={14} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
  },
});