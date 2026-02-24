import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { Colors } from '@/constants/Colors';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'buyer',
    title: 'Buyer',
    description: 'Looking to buy or rent a property',
    icon: 'search',
    color: '#3b82f6',
  },
  {
    id: 'seller',
    title: 'Seller',
    description: 'List and sell your properties',
    icon: 'home',
    color: '#10b981',
  },
  {
    id: 'agent',
    title: 'Agent',
    description: 'Professional real estate agent',
    icon: 'briefcase',
    color: '#f59e0b',
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { setRole, updateProfile, user } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSelectRole = (role: UserRole) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      updateProfile({ role: selectedRole });
      router.replace('/(tabs)');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          How will you use DarNA?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select your role to personalize your experience
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.options,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {roleOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleSelectRole(option.id)}
            activeOpacity={0.8}
            style={[
              styles.optionCard,
              {
                backgroundColor: colors.card,
                borderColor: selectedRole === option.id
                  ? colors.primary
                  : colors.border,
                borderWidth: selectedRole === option.id ? 2 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.optionIcon,
                { backgroundColor: `${option.color}20` },
              ]}
            >
              <Ionicons name={option.icon} size={28} color={option.color} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {option.title}
              </Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                {option.description}
              </Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                {
                  borderColor: selectedRole === option.id
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              {selectedRole === option.id && (
                <View
                  style={[styles.radioInner, { backgroundColor: colors.primary }]}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          fullWidth
          size="lg"
          icon="arrow-forward"
          iconPosition="right"
        />
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  options: {
    flex: 1,
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footer: {
    paddingTop: 24,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
  },
});