import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useColorScheme';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showFilter?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  value = '',
  onChangeText,
  onSubmit,
  onFilterPress,
  placeholder = 'Search properties...',
  showFilter = true,
  autoFocus = false,
}: SearchBarProps) {
  const colors = useThemeColors();
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);

  const handleChange = (newText: string) => {
    setText(newText);
    onChangeText?.(newText);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSubmit?.(text);
    }
  };

  const handleClear = () => {
    setText('');
    onChangeText?.('');
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: focused ? colors.primary : colors.border,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={focused ? colors.primary : colors.textTertiary}
        />
        <TextInput
          value={text}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.text }]}
          returnKeyType="search"
          autoFocus={autoFocus}
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      {showFilter && (
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onFilterPress?.();
          }}
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="options" size={22} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});