import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format, isToday, isYesterday } from 'date-fns';
import { useThemeColors } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Conversation } from '@/types';

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { conversations, markConversationRead } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const formatTime = (date: Date) => {
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'dd/MM');
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[styles.conversationItem, { backgroundColor: colors.card }]}
      onPress={() => {
        markConversationRead(item.id);
        // Navigate to chat (simplified for now)
      }}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Avatar
          source={item.participantAvatar}
          name={item.participantName}
          size="md"
        />
        {item.unreadCount > 0 && (
          <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
        )}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text
            style={[
              styles.participantName,
              { color: colors.text },
              item.unreadCount > 0 && styles.unreadName,
            ]}
            numberOfLines={1}
          >
            {item.participantName}
          </Text>
          <Text style={[styles.time, { color: colors.textTertiary }]}>
            {formatTime(item.lastMessageTime)}
          </Text>
        </View>

        {item.propertyTitle && (
          <View style={styles.propertyInfo}>
            <Ionicons name="home-outline" size={12} color={colors.primary} />
            <Text
              style={[styles.propertyTitle, { color: colors.primary }]}
              numberOfLines={1}
            >
              {item.propertyTitle}
            </Text>
          </View>
        )}

        <View style={styles.lastMessageRow}>
          <Text
            style={[
              styles.lastMessage,
              { color: colors.textSecondary },
              item.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {item.propertyImage && (
        <Image
          source={{ uri: item.propertyImage }}
          style={styles.propertyImage}
          contentFit="cover"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <View style={[styles.searchContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search conversations..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No messages yet"
            description="Start a conversation by contacting a property owner"
            actionLabel="Browse Properties"
            onAction={() => router.push('/(tabs)/search')}
          />
        }
      />
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unreadName: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
  },
  propertyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  propertyImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginLeft: 12,
  },
});