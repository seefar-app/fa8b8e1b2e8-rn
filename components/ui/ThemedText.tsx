import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

type TextVariant = 'default' | 'secondary' | 'tertiary' | 'primary';
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  size?: TextSize;
  weight?: TextWeight;
}

export function ThemedText({
  style,
  variant = 'default',
  size = 'base',
  weight = 'normal',
  ...props
}: ThemedTextProps) {
  const colors = useThemeColors();

  const getColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.textSecondary;
      case 'tertiary':
        return colors.textTertiary;
      case 'primary':
        return colors.primary;
      default:
        return colors.text;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'xs': return 12;
      case 'sm': return 14;
      case 'base': return 16;
      case 'lg': return 18;
      case 'xl': return 20;
      case '2xl': return 24;
      case '3xl': return 30;
      default: return 16;
    }
  };

  const getFontWeight = (): '400' | '500' | '600' | '700' => {
    switch (weight) {
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return '700';
      default: return '400';
    }
  };

  return (
    <Text
      style={[
        { color: getColor(), fontSize: getFontSize(), fontWeight: getFontWeight() },
        style,
      ]}
      {...props}
    />
  );
}