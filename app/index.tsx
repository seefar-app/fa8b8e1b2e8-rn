import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.push('/(auth)/login');
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200' }}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(236,72,153,0.3)', 'rgba(244,63,94,0.6)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      >
        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              paddingTop: insets.top + 60,
              opacity: fadeAnim,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoIcon}>
            <Ionicons name="home" size={48} color="#ffffff" />
          </View>
          <Text style={styles.logoText}>DarNA</Text>
          <Text style={styles.tagline}>Your Home in Algeria</Text>
        </Animated.View>

        {/* Content Section */}
        <Animated.View
          style={[
            styles.content,
            {
              paddingBottom: insets.bottom + 32,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>
            Find Your{'\n'}
            <Text style={styles.highlight}>Dream Home</Text>
          </Text>
          <Text style={styles.description}>
            Discover thousands of properties across Algeria. Buy, sell, or rent with confidence.
          </Text>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="search" size={20} color="#ec4899" />
              </View>
              <Text style={styles.featureText}>Smart Search</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="location" size={20} color="#ec4899" />
              </View>
              <Text style={styles.featureText}>Map View</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="chatbubbles" size={20} color="#ec4899" />
              </View>
              <Text style={styles.featureText}>Direct Chat</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              size="lg"
              fullWidth
              icon="arrow-forward"
              iconPosition="right"
            />
            <Button
              title="Create Account"
              onPress={handleSignUp}
              variant="outline"
              size="lg"
              fullWidth
              style={styles.secondaryButton}
            />
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 48,
    marginBottom: 16,
  },
  highlight: {
    color: '#f9a8d4',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    marginBottom: 24,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  buttons: {
    gap: 12,
  },
  secondaryButton: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  terms: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 20,
  },
});