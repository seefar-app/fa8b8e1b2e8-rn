import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Property } from '@/types';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { Badge } from '../ui/Badge';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'horizontal' | 'featured';
}

const { width } = Dimensions.get('window');

export function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const { saveProperty, unsaveProperty, savedProperties, isPropertySaved } = useStore();
  
  const isSaved = isPropertySaved(property.id);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/property/${property.id}`);
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isSaved) {
      const saved = savedProperties.find(s => s.propertyId === property.id);
      if (saved) unsaveProperty(saved.id);
    } else {
      saveProperty(property.id);
    }
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

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={[styles.horizontalCard, { backgroundColor: colors.card }]}
      >
        <Image
          source={{ uri: property.images[0] }}
          style={styles.horizontalImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.horizontalContent}>
          <View style={styles.horizontalHeader}>
            <Badge
              label={property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              variant={property.listingType === 'rent' ? 'info' : 'primary'}
              size="sm"
            />
            <TouchableOpacity onPress={handleSave}>
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={20}
                color={isSaved ? colors.primary : colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.horizontalTitle, { color: colors.text }]} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
              {property.location}
            </Text>
          </View>
          <View style={styles.horizontalFooter}>
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatPrice(property.price, property.listingType)}
              {property.listingType === 'rent' && <Text style={styles.perMonth}>/mo</Text>}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.95}
        style={[styles.featuredCard, { width: width - 48 }]}
      >
        <Image
          source={{ uri: property.images[0] }}
          style={styles.featuredImage}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredBadges}>
            <Badge label="Featured" variant="warning" size="sm" />
            <Badge
              label={property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              variant={property.listingType === 'rent' ? 'info' : 'primary'}
              size="sm"
            />
          </View>
          <TouchableOpacity 
            style={styles.featuredSaveButton}
            onPress={handleSave}
          >
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={22}
              color={isSaved ? '#ec4899' : '#ffffff'}
            />
          </TouchableOpacity>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle} numberOfLines={1}>
              {property.title}
            </Text>
            <View style={styles.featuredLocation}>
              <Ionicons name="location" size={14} color="#ffffff" />
              <Text style={styles.featuredLocationText}>{property.location}</Text>
            </View>
            <View style={styles.featuredFooter}>
              <Text style={styles.featuredPrice}>
                {formatPrice(property.price, property.listingType)}
                {property.listingType === 'rent' && (
                  <Text style={styles.featuredPerMonth}>/mo</Text>
                )}
              </Text>
              <View style={styles.featuredStats}>
                <View style={styles.statItem}>
                  <Ionicons name="bed-outline" size={14} color="#ffffff" />
                  <Text style={styles.statText}>{property.bedrooms}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="water-outline" size={14} color="#ffffff" />
                  <Text style={styles.statText}>{property.bathrooms}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="resize-outline" size={14} color="#ffffff" />
                  <Text style={styles.statText}>{property.area}m²</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Default card
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.badges}>
          <Badge
            label={property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            variant={property.listingType === 'rent' ? 'info' : 'primary'}
            size="sm"
          />
          <Badge label={property.type} variant="default" size="sm" />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={22}
            color={isSaved ? '#ec4899' : '#ffffff'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
            {property.location}
          </Text>
        </View>
        <View style={styles.stats}>
          {property.bedrooms > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="bed-outline" size={16} color={colors.textTertiary} />
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                {property.bedrooms} Beds
              </Text>
            </View>
          )}
          {property.bathrooms > 0 && (
            <View style={styles.statItem}>
              <Ionicons name="water-outline" size={16} color={colors.textTertiary} />
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                {property.bathrooms} Baths
              </Text>
            </View>
          )}
          <View style={styles.statItem}>
            <Ionicons name="resize-outline" size={16} color={colors.textTertiary} />
            <Text style={[styles.statValue, { color: colors.textSecondary }]}>
              {property.area}m²
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatPrice(property.price, property.listingType)}
            {property.listingType === 'rent' && <Text style={styles.perMonth}>/mo</Text>}
          </Text>
          <View style={styles.views}>
            <Ionicons name="eye-outline" size={14} color={colors.textTertiary} />
            <Text style={[styles.viewsText, { color: colors.textTertiary }]}>
              {property.views}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Default Card
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
  },
  perMonth: {
    fontSize: 14,
    fontWeight: '400',
  },
  views: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
  },

  // Horizontal Card
  horizontalCard: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  horizontalImage: {
    width: 120,
    height: 120,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  horizontalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  horizontalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Featured Card
  featuredCard: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredBadges: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  featuredSaveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 100,
    padding: 10,
  },
  featuredContent: {
    gap: 6,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredLocationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  featuredPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  featuredPerMonth: {
    fontSize: 14,
    fontWeight: '400',
  },
  featuredStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 4,
  },
});