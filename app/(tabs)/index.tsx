import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { SearchBar } from '@/components/shared/SearchBar';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PropertyType } from '@/types';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const categories: { id: PropertyType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'apartment', label: 'Apartment', icon: 'business' },
  { id: 'house', label: 'House', icon: 'home' },
  { id: 'villa', label: 'Villa', icon: 'leaf' },
  { id: 'land', label: 'Land', icon: 'map' },
  { id: 'commercial', label: 'Commercial', icon: 'storefront' },
];

const quickActions = [
  { id: 'sell', label: 'Sell Property', icon: 'add-circle', color: '#10b981', route: '/listing/create' },
  { id: 'buy', label: 'Buy Property', icon: 'cart', color: '#3b82f6', route: '/(tabs)/search' },
  { id: 'rent', label: 'Rent Property', icon: 'key', color: '#f59e0b', route: '/(tabs)/search' },
  { id: 'agent', label: 'Find Agent', icon: 'people', color: '#8b5cf6', route: '/(tabs)/search' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const { properties, featuredProperties, fetchProperties, isLoading } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PropertyType | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    fetchProperties();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: PropertyType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(selectedCategory === category ? null : category);
    router.push({
      pathname: '/(tabs)/search',
      params: { type: category },
    });
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Header Background */}
      <Animated.View
        style={[
          styles.headerBackground,
          {
            backgroundColor: colors.card,
            opacity: headerOpacity,
            paddingTop: insets.top,
          },
        ]}
      />

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={Colors.gradients.primary}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>
                {user?.name || 'Guest'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Avatar
                source={user?.avatar}
                name={user?.name || 'Guest'}
                size="md"
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="Search by location, type..."
              onSubmit={(text) => router.push({
                pathname: '/(tabs)/search',
                params: { query: text },
              })}
              onFilterPress={() => router.push('/(tabs)/search')}
            />
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickAction, { backgroundColor: colors.card }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(action.route as any);
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Categories
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: selectedCategory === category.id
                      ? colors.primary
                      : colors.card,
                  },
                ]}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={selectedCategory === category.id ? '#ffffff' : colors.primary}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    {
                      color: selectedCategory === category.id
                        ? '#ffffff'
                        : colors.text,
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Properties */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Properties
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
            decelerationRate="fast"
            snapToInterval={width - 32}
          >
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                variant="featured"
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Nearby Properties */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 6 }]}>
                Near You
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.propertiesGrid}>
            {properties.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </View>
        </Animated.View>

        {/* CTA Banner */}
        <View style={[styles.section, styles.ctaSection]}>
          <LinearGradient
            colors={Colors.gradients.coral}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaBanner}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Want to sell your property?</Text>
              <Text style={styles.ctaDescription}>
                List your property and reach thousands of potential buyers
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => router.push('/listing/create')}
              >
                <Text style={styles.ctaButtonText}>List Now</Text>
                <Ionicons name="arrow-forward" size={18} color="#ec4899" />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400' }}
              style={styles.ctaImage}
              contentFit="cover"
            />
          </LinearGradient>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {},
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchContainer: {
    marginTop: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingRight: 24,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 100,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  featuredContainer: {
    paddingRight: 24,
  },
  propertiesGrid: {
    gap: 16,
  },
  ctaSection: {
    marginBottom: 24,
  },
  ctaBanner: {
    flexDirection: 'row',
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 160,
  },
  ctaContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    alignSelf: 'flex-start',
    gap: 6,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ec4899',
  },
  ctaImage: {
    width: 120,
    height: '100%',
  },
});