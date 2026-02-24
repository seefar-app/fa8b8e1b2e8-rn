import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const colors = useThemeColors();

  const getSize = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, iconSize: 18 };
      case 'lg':
        return { paddingVertical: 18, paddingHorizontal: 28, fontSize: 18, iconSize: 24 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16, iconSize: 20 };
    }
  };

  const sizeConfig = getSize();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: sizeConfig.paddingVertical,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      borderRadius: 100,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    };

    if (disabled || loading) {
      return { ...baseStyle, opacity: 0.5 };
    }

    switch (variant) {
      case 'secondary':
        return { ...baseStyle, backgroundColor: colors.backgroundTertiary };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return { ...baseStyle, backgroundColor: 'transparent' };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: sizeConfig.fontSize,
      fontWeight: '600',
    };

    switch (variant) {
      case 'secondary':
        return { ...baseStyle, color: colors.text };
      case 'outline':
      case 'ghost':
        return { ...baseStyle, color: colors.primary };
      default:
        return { ...baseStyle, color: '#ffffff' };
    }
  };

  const iconColor =
    variant === 'primary' ? '#ffffff' : colors.primary;

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#ffffff' : colors.primary}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={sizeConfig.iconSize} color={iconColor} />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={sizeConfig.iconSize} color={iconColor} />
          )}
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[getButtonStyle(), style]}
      >
        <LinearGradient
          colors={Colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[getButtonStyle(), style]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}