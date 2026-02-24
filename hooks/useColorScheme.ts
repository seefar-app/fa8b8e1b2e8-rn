import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors, ColorScheme } from '@/constants/Colors';

export function useColorScheme(): ColorScheme {
  const colorScheme = useRNColorScheme();
  return colorScheme ?? 'light';
}

export function useThemeColors() {
  const scheme = useColorScheme();
  return Colors[scheme];
}