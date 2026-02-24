import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { SearchBar } from '@/components/shared/SearchBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PropertyType, ListingType, SearchFilters } from '@/types';

const { width, height } = Dimensions.get('window');

const propertyTypes: { id: PropertyType; label: string }[] = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'villa', label: 'Villa' },
  { id: 'land', label: 'Land' },
  { id: 'commercial', label: 'Commercial' },
];

const priceRanges = [
  { id: '1', label: 'Under 10M', min: 0, max: 10000000 },
  { id: '2', label: '10M - 30M', min: 10000000, max: 30000000 },
  { id: '3', label: '30M - 50M', min: 30000000, max: 50000000 },
  { id: '4', label: '50M - 100M', min: 50000000, max: 100000000 },
  { id: '5', label: '100M+', min: 100000000, max: undefined },
];

const bedroomOptions = [1, 2, 3, 4, 5];

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const {
    properties,
    searchResults,
    searchProperties,
    searchFilters,
    setSearchFilters,
    recentSearches,
    addRecentSearch,
    isLoading,
  } = useStore();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState((params.query as string) || '');
  const [filters, setFilters] = useState<SearchFilters>({
    type: (params.type as PropertyType) || undefined,
    listingType: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minBedrooms: undefined,
  });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (params.query || params.type) {
      handleSearch();
    }
  }, [params]);

  const handleSearch = useCallback(() => {
    const searchParams: SearchFilters = {
      ...filters,
      query: query || undefined,
    };
    searchProperties(searchParams);
    if (query) addRecentSearch(query);
  }, [query, filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const handleApplyFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowFilters(false);
    handleSearch();
  };

  const handleClearFilters = () => {
    setFilters({});
    setQuery('');
  };

  const displayedProperties = searchResults.length > 0 ? searchResults : properties;
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.card }]}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSearch}
          onFilterPress={() => setShowFilters(true)}
          placeholder="Search location, property name..."
        />

        {/* View Mode Toggle */}
        <View style={styles.viewModeContainer}>
          <View style={[styles.viewModeToggle, { backgroundColor: colors.backgroundSecondary }]}>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'list' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons
                name="list"
                size={18}
                color={viewMode === 'list' ? '#ffffff' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.viewModeText,
                  { color: viewMode === 'list' ? '#ffffff' : colors.textSecondary },
                ]}
              >
                List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'map' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons
                name="map"
                size={18}
                color={viewMode === 'map' ? '#ffffff' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.viewModeText,
                  { color: viewMode === 'map' ? '#ffffff' : colors.textSecondary },
                ]}
              >
                Map
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
            {displayedProperties.length} properties
          </Text>
        </View>

        {/* Quick Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFilters}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: filters.listingType === 'sale'
                  ? colors.primary
                  : colors.backgroundSecondary,
              },
            ]}
            onPress={() => handleFilterChange('listingType', 'sale')}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: filters.listingType === 'sale' ? '#ffffff' : colors.text },
              ]}
            >
              For Sale
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: filters.listingType === 'rent'
                  ? colors.primary
                  : colors.backgroundSecondary,
              },
            ]}
            onPress={() => handleFilterChange('listingType', 'rent')}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: filters.listingType === 'rent' ? '#ffffff' : colors.text },
              ]}
            >
              For Rent
            </Text>
          </TouchableOpacity>
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filters.type === type.id
                    ? colors.primary
                    : colors.backgroundSecondary,
                },
              ]}
              onPress={() => handleFilterChange('type', type.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: filters.type === type.id ? '#ffffff' : colors.text },
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <FlatList
          data={displayedProperties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PropertyCard property={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No properties found</Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                Try adjusting your filters or search terms
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: userLocation?.latitude || 36.7538,
              longitude: userLocation?.longitude || 3.0588,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            {displayedProperties.map((property) => (
              <Marker
                key={property.id}
                coordinate={{
                  latitude: property.coordinates.lat,
                  longitude: property.coordinates.lng,
                }}
                onPress={() => router.push(`/property/${property.id}`)}
              >
                <View style={[styles.markerContainer, { backgroundColor: colors.primary }]}>
                  <Text style={styles.markerText}>
                    {property.price >= 1000000
                      ? `${(property.price / 1000000).toFixed(1)}M`
                      : `${(property.price / 1000).toFixed(0)}K`}
                  </Text>
                </View>
              </Marker>
            ))}
          </MapView>
        </View>
      )}

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Property Type */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Property Type</Text>
              <View style={styles.filterOptions}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: filters.type === type.id
                          ? colors.primary
                          : colors.backgroundSecondary,
                      },
                    ]}
                    onPress={() => handleFilterChange('type', type.id)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        { color: filters.type === type.id ? '#ffffff' : colors.text },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Listing Type */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Listing Type</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    {
                      backgroundColor: filters.listingType === 'sale'
                        ? colors.primary
                        : colors.backgroundSecondary,
                    },
                  ]}
                  onPress={() => handleFilterChange('listingType', 'sale')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      { color: filters.listingType === 'sale' ? '#ffffff' : colors.text },
                    ]}
                  >
                    For Sale
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    {
                      backgroundColor: filters.listingType === 'rent'
                        ? colors.primary
                        : colors.backgroundSecondary,
                    },
                  ]}
                  onPress={() => handleFilterChange('listingType', 'rent')}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      { color: filters.listingType === 'rent' ? '#ffffff' : colors.text },
                    ]}
                  >
                    For Rent
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Price Range</Text>
              <View style={styles.filterOptions}>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.id}
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor:
                          filters.minPrice === range.min
                            ? colors.primary
                            : colors.backgroundSecondary,
                      },
                    ]}
                    onPress={() => {
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: prev.minPrice === range.min ? undefined : range.min,
                        maxPrice: prev.minPrice === range.min ? undefined : range.max,
                      }));
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color: filters.minPrice === range.min ? '#ffffff' : colors.text,
                        },
                      ]}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bedrooms */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>Bedrooms</Text>
              <View style={styles.filterOptions}>
                {bedroomOptions.map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.bedroomOption,
                      {
                        backgroundColor: filters.minBedrooms === num
                          ? colors.primary
                          : colors.backgroundSecondary,
                      },
                    ]}
                    onPress={() => handleFilterChange('minBedrooms', num)}
                  >
                    <Text
                      style={[
                        styles.bedroomText,
                        { color: filters.minBedrooms === num ? '#ffffff' : colors.text },
                      ]}
                    >
                      {num}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { backgroundColor: colors.card }]}>
            <Button
              title="Clear All"
              onPress={handleClearFilters}
              variant="ghost"
              style={{ flex: 1 }}
            />
            <Button
              title={`Show ${displayedProperties.length} Results`}
              onPress={handleApplyFilters}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  viewModeToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 14,
  },
  quickFilters: {
    gap: 8,
    paddingRight: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bedroomOption: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bedroomText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
});