import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Linking,
  Share,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.5;

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { user } = useAuthStore();
  const {
    properties,
    saveProperty,
    unsaveProperty,
    isPropertySaved,
    scheduleViewing,
  } = useStore();

  const property = properties.find((p) => p.id === id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!property) {
      Alert.alert('Error', 'Property not found', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  }, [property]);

  if (!property) {
    return null;
  }

  const isSaved = isPropertySaved(property.id);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT],
    outputRange: [0, -IMAGE_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isSaved) {
      const saved = useStore.getState().savedProperties.find(
        (s) => s.propertyId === property.id
      );
      if (saved) unsaveProperty(saved.id);
    } else {
      saveProperty(property.id);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this property: ${property.title}\n${property.location}\nPrice: ${formatPrice(property.price, property.listingType)}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${property.sellerPhone}`);
  };

  const handleMessage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/(tabs)/messages',
      params: { userId: property.sellerId, propertyId: property.id },
    });
  };

  const handleScheduleViewing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/viewing/schedule',
      params: { propertyId: property.id },
    });
  };

  const formatPrice = (price: number, listingType: string) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M DZD`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K DZD`;
    }
    return `${price.toLocaleString()} DZD`;
  };

  const getPropertyTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'apartment':
        return 'business';
      case 'house':
        return 'home';
      case 'villa':
        return 'leaf';
      case 'land':
        return 'map';
      case 'commercial':
        return 'storefront';
      default:
        return 'home';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            opacity: headerOpacity,
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Animated.Text
            style={[
              styles.headerTitle,
              { color: colors.text, opacity: headerOpacity },
            ]}
            numberOfLines={1}
          >
            {property.title}
          </Animated.Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.card }]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.card }]}
              onPress={handleSave}
            >
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={22}
                color={isSaved ? colors.primary : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Floating Back Button */}
      <View
        style={[
          styles.floatingHeader,
          { paddingTop: insets.top + 8, paddingHorizontal: 24 },
        ]}
      >
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.floatingActions}>
          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={handleSave}
          >
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={22}
              color={isSaved ? '#ec4899' : '#ffffff'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <Animated.View
          style={[
            styles.imageGallery,
            { transform: [{ translateY: imageTranslateY }] },
          ]}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setActiveImageIndex(index);
            }}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
                contentFit="cover"
                transition={200}
              />
            ))}
          </ScrollView>
          <View style={styles.imageIndicator}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === activeImageIndex
                        ? '#ffffff'
                        : 'rgba(255,255,255,0.4)',
                    width: index === activeImageIndex ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {/* Price & Title */}
          <View style={styles.section}>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: colors.primary }]}>
                {formatPrice(property.price, property.listingType)}
                {property.listingType === 'rent' && (
                  <Text style={styles.perMonth}>/mo</Text>
                )}
              </Text>
              <Badge
                label={property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                variant={property.listingType === 'rent' ? 'info' : 'primary'}
              />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              {property.title}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                {property.location}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <Card style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <Ionicons
                    name={getPropertyTypeIcon(property.type)}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Type
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </Text>
              </View>

              {property.bedrooms > 0 && (
                <View style={styles.statItem}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: `${colors.primary}20` },
                    ]}
                  >
                    <Ionicons name="bed" size={24} color={colors.primary} />
                  </View>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Bedrooms
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {property.bedrooms}
                  </Text>
                </View>
              )}

              {property.bathrooms > 0 && (
                <View style={styles.statItem}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: `${colors.primary}20` },
                    ]}
                  >
                    <Ionicons name="water" size={24} color={colors.primary} />
                  </View>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Bathrooms
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {property.bathrooms}
                  </Text>
                </View>
              )}

              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <Ionicons name="resize" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Area
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {property.area}m²
                </Text>
              </View>
            </View>
          </Card>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={showFullDescription ? undefined : 4}
            >
              {property.description}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text style={[styles.readMore, { color: colors.primary }]}>
                {showFullDescription ? 'Show Less' : 'Read More'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Amenities
              </Text>
              <View style={styles.amenitiesGrid}>
                {property.amenities.map((amenity, index) => (
                  <View
                    key={index}
                    style={[
                      styles.amenityItem,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={[styles.amenityText, { color: colors.text }]}>
                      {amenity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Map */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Location
            </Text>
            <Card style={styles.mapCard} padding="none">
              <MapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                  latitude: property.coordinates.lat,
                  longitude: property.coordinates.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: property.coordinates.lat,
                    longitude: property.coordinates.lng,
                  }}
                >
                  <View style={styles.markerContainer}>
                    <LinearGradient
                      colors={Colors.gradients.primary}
                      style={styles.marker}
                    >
                      <Ionicons name="home" size={20} color="#ffffff" />
                    </LinearGradient>
                  </View>
                </Marker>
              </MapView>
              <TouchableOpacity
                style={styles.mapOverlay}
                onPress={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`;
                  Linking.openURL(url);
                }}
              >
                <View style={styles.mapOverlayContent}>
                  <Ionicons name="navigate" size={20} color={colors.primary} />
                  <Text style={[styles.mapOverlayText, { color: colors.text }]}>
                    Open in Maps
                  </Text>
                </View>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Seller Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Listed By
            </Text>
            <Card style={styles.sellerCard}>
              <View style={styles.sellerInfo}>
                <Avatar
                  source={property.sellerAvatar}
                  name={property.sellerName}
                  size="lg"
                />
                <View style={styles.sellerDetails}>
                  <Text style={[styles.sellerName, { color: colors.text }]}>
                    {property.sellerName}
                  </Text>
                  <View style={styles.sellerMeta}>
                    <Ionicons
                      name="shield-checkmark"
                      size={16}
                      color={colors.primary}
                    />
                    <Text
                      style={[styles.sellerMetaText, { color: colors.textSecondary }]}
                    >
                      Verified Seller
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.sellerActions}>
                <Button
                  title="Call"
                  onPress={handleCall}
                  variant="outline"
                  icon="call"
                  style={styles.sellerButton}
                />
                <Button
                  title="Message"
                  onPress={handleMessage}
                  variant="primary"
                  icon="chatbubble"
                  style={styles.sellerButton}
                />
              </View>
            </Card>
          </View>

          {/* Bottom Padding */}
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={[styles.bottomBarLabel, { color: colors.textSecondary }]}>
              Price
            </Text>
            <Text style={[styles.bottomBarPrice, { color: colors.primary }]}>
              {formatPrice(property.price, property.listingType)}
            </Text>
          </View>
          <Button
            title="Schedule Viewing"
            onPress={handleScheduleViewing}
            variant="primary"
            icon="calendar"
            style={styles.scheduleButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  imageGallery: {
    height: IMAGE_HEIGHT,
  },
  galleryImage: {
    width,
    height: IMAGE_HEIGHT,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  content: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
  },
  perMonth: {
    fontSize: 18,
    fontWeight: '400',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 16,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mapCard: {
    overflow: 'hidden',
    height: 200,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapOverlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapOverlayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sellerCard: {
    gap: 16,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerDetails: {
    flex: 1,
    gap: 4,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  sellerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerMetaText: {
    fontSize: 14,
  },
  sellerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  sellerButton: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  bottomBarPrice: {
    fontSize: 20,
    fontWeight: '800',
  },
  scheduleButton: {
    paddingHorizontal: 24,
  },
});