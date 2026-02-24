import { View, ViewProps } from 'react-native';
import { useThemeColors } from '@/hooks/useColorScheme';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'tertiary' | 'card';
}

export function ThemedView({ style, variant = 'default', ...props }: ThemedViewProps) {
  const colors = useThemeColors();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.backgroundSecondary;
      case 'tertiary':
        return colors.backgroundTertiary;
      case 'card':
        return colors.card;
      default:
        return colors.background;
    }
  };

  return <View style={[{ backgroundColor: getBackgroundColor() }, style]} {...props} />;
}