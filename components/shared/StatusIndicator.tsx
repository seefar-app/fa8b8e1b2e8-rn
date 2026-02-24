import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'pending';
  size?: number;
  animated?: boolean;
}

export function StatusIndicator({
  status,
  size = 10,
  animated = true,
}: StatusIndicatorProps) {
  const colors = useThemeColors();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  const getColor = () => {
    switch (status) {
      case 'online':
        return colors.success;
      case 'offline':
        return colors.textTertiary;
      case 'busy':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textTertiary;
    }
  };

  useEffect(() => {
    if (animated && (status === 'online' || status === 'pending')) {
      const pulse = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.5,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.4,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [animated, status, scale, opacity]);

  return (
    <View style={{ width: size * 2, height: size * 2, alignItems: 'center', justifyContent: 'center' }}>
      {animated && (status === 'online' || status === 'pending') && (
        <Animated.View
          style={[
            styles.pulse,
            {
              width: size * 2,
              height: size * 2,
              borderRadius: size,
              backgroundColor: getColor(),
              transform: [{ scale }],
              opacity,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: getColor(),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pulse: {
    position: 'absolute',
  },
  dot: {},
});