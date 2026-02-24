import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/Colors';

interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  badge?: string;
  route?: string;
  action?: () => void;
  color?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { user, logout } = useAuthStore();
  const { savedProperties, viewings } = useStore();

  const pendingViewings = viewings.filter((v) => v.status === 'pending' || v.status === 'confirmed').length;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  const statsItems = [
    { id: 'saved', label: 'Saved', value: savedProperties.length, icon: 'heart' },
    { id: 'viewings', label: 'Viewings', value: pendingViewings, icon: 'calendar' },
    { id: 'listings', label: 'Listings', value: 0, icon: 'home' },
  ];

  const menuItems: MenuItem[] = [
    {
      id: 'saved',
      icon: 'heart-outline',
      label: 'Saved Properties',
      description: `${savedProperties.length} saved`,
      route: '/(tabs)/search',
    },
    {
      id: 'viewings',
      icon: 'calendar-outline',
      label: 'My Viewings',
      description: 'Schedule and manage viewings',
      badge: pendingViewings > 0 ? `${pendingViewings}` : undefined,
    },
    {
      id: 'listings',
      icon: 'home-outline',
      label: 'My Listings',
      description: 'Manage your property listings',
      route: '/listing/create',
    },
    {
      id: 'payments',
      icon: 'card-outline',
      label: 'Payment Methods',
      description: 'Manage your payment options',
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      label: 'Notifications',
      description: 'Manage notification preferences',
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      label: 'Help & Support',
      description: 'Get help and contact support',
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      label: 'Settings',
      description: 'App settings and preferences',
    },
    {
      id: 'logout',
      icon: 'log-out-outline',
      label: 'Sign Out',
      action: handleLogout,
      color: colors.error,
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.action) {
      item.action();
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={Colors.gradients.primary}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={22} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Avatar
            source={user?.avatar}
            name={user?.name || 'Guest'}
            size="xl"
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
          
          <View style={styles.roleContainer}>
            <Badge
              label={user?.role || 'Buyer'}
              variant="primary"
            />
            {user?.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {statsItems.map((stat) => (
            <View key={stat.id} style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name={stat.icon as any} size={18} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              { backgroundColor: colors.card },
              index === menuItems.length - 1 && styles.lastMenuItem,
            ]}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: item.color ? `${item.color}15` : colors.backgroundTertiary },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={item.color || colors.primary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuLabel,
                  { color: item.color || colors.text },
                ]}
              >
                {item.label}
              </Text>
              {item.description && (
                <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              )}
            </View>
            {item.badge ? (
              <View style={[styles.menuBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.menuBadgeText}>{item.badge}</Text>
              </View>
            ) : (
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* App Version */}
      <Text style={[styles.version, { color: colors.textTertiary }]}>
        DarNA v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  editButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  verifiedText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  menuContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lastMenuItem: {
    marginTop: 12,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  menuBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  menuBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 12,
  },
});