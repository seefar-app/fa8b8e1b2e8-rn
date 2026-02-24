import { create } from 'zustand';
import { 
  Property, 
  Conversation, 
  Message, 
  Viewing, 
  SavedProperty,
  SearchFilters,
  PropertyType,
  ListingType,
} from '@/types';

// Mock Properties Data
const mockProperties: Property[] = [
  {
    id: 'prop-1',
    title: 'Luxurious Villa with Sea View',
    description: 'Stunning 4-bedroom villa with panoramic Mediterranean sea views. Features modern architecture, private pool, landscaped garden, and premium finishes throughout. Located in the prestigious El Biar neighborhood.',
    type: 'villa',
    listingType: 'sale',
    price: 85000000,
    bedrooms: 4,
    bathrooms: 3,
    area: 450,
    location: 'El Biar, Algiers',
    city: 'Algiers',
    wilaya: 'Algiers',
    coordinates: { lat: 36.7678, lng: 3.0241 },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    amenities: ['Pool', 'Garden', 'Parking', 'Security', 'Sea View', 'Central Heating'],
    status: 'active',
    sellerId: 'seller-1',
    sellerName: 'Karim Mansouri',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    sellerPhone: '+213 555 111 222',
    featured: true,
    views: 1250,
    saves: 89,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'prop-2',
    title: 'Modern Apartment in Hydra',
    description: 'Contemporary 3-bedroom apartment in the heart of Hydra. Recently renovated with high-end materials, spacious living areas, and a large terrace with city views.',
    type: 'apartment',
    listingType: 'sale',
    price: 35000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    location: 'Hydra, Algiers',
    city: 'Algiers',
    wilaya: 'Algiers',
    coordinates: { lat: 36.7432, lng: 3.0012 },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    amenities: ['Parking', 'Elevator', 'Terrace', 'Security', 'Central Heating'],
    status: 'active',
    sellerId: 'seller-2',
    sellerName: 'Sara Benali',
    sellerAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    sellerPhone: '+213 555 333 444',
    featured: true,
    views: 890,
    saves: 56,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'prop-3',
    title: 'Charming House in Oran',
    description: 'Beautiful traditional house with modern amenities. 3 bedrooms, courtyard, and rooftop terrace. Perfect for families seeking authenticity with comfort.',
    type: 'house',
    listingType: 'sale',
    price: 28000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 220,
    location: 'Sidi El Houari, Oran',
    city: 'Oran',
    wilaya: 'Oran',
    coordinates: { lat: 35.7000, lng: -0.6333 },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    amenities: ['Courtyard', 'Rooftop', 'Parking', 'Storage'],
    status: 'active',
    sellerId: 'seller-3',
    sellerName: 'Yacine Bouzid',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    sellerPhone: '+213 555 555 666',
    featured: false,
    views: 456,
    saves: 34,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'prop-4',
    title: 'Cozy Studio for Rent',
    description: 'Fully furnished studio apartment ideal for students or young professionals. Close to university and public transport. All utilities included.',
    type: 'apartment',
    listingType: 'rent',
    price: 45000,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    location: 'Ben Aknoun, Algiers',
    city: 'Algiers',
    wilaya: 'Algiers',
    coordinates: { lat: 36.7589, lng: 3.0078 },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    amenities: ['Furnished', 'Internet', 'Utilities Included'],
    status: 'active',
    sellerId: 'seller-4',
    sellerName: 'Nadia Cherif',
    sellerAvatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    sellerPhone: '+213 555 777 888',
    featured: false,
    views: 678,
    saves: 45,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'prop-5',
    title: 'Commercial Land in Constantine',
    description: 'Prime commercial land in strategic location. Ideal for retail or office development. All permits ready for immediate construction.',
    type: 'land',
    listingType: 'sale',
    price: 120000000,
    bedrooms: 0,
    bathrooms: 0,
    area: 2500,
    location: 'Ali Mendjeli, Constantine',
    city: 'Constantine',
    wilaya: 'Constantine',
    coordinates: { lat: 36.2650, lng: 6.5833 },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    ],
    amenities: ['Road Access', 'Utilities Ready', 'Permits Ready'],
    status: 'active',
    sellerId: 'seller-5',
    sellerName: 'Ahmed Djamel',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    sellerPhone: '+213 555 999 000',
    featured: true,
    views: 234,
    saves: 18,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'prop-6',
    title: 'Beachfront Villa in Tipaza',
    description: 'Exclusive beachfront property with direct access to private beach. 5 bedrooms, infinity pool, and stunning sunset views. Perfect vacation home or investment.',
    type: 'villa',
    listingType: 'sale',
    price: 150000000,
    bedrooms: 5,
    bathrooms: 4,
    area: 600,
    location: 'Chenoua, Tipaza',
    city: 'Tipaza',
    wilaya: 'Tipaza',
    coordinates: { lat: 36.5833, lng: 2.0167 },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    amenities: ['Beach Access', 'Pool', 'Garden', 'Parking', 'Security', 'BBQ Area'],
    status: 'active',
    sellerId: 'seller-1',
    sellerName: 'Karim Mansouri',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    sellerPhone: '+213 555 111 222',
    featured: true,
    views: 2100,
    saves: 156,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-21'),
  },
];

// Mock Conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'seller-1',
    participantName: 'Karim Mansouri',
    participantAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    propertyId: 'prop-1',
    propertyTitle: 'Luxurious Villa with Sea View',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    lastMessage: 'Yes, the property is still available. Would you like to schedule a viewing?',
    lastMessageTime: new Date('2024-01-21T14:30:00'),
    unreadCount: 2,
  },
  {
    id: 'conv-2',
    participantId: 'seller-2',
    participantName: 'Sara Benali',
    participantAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    propertyId: 'prop-2',
    propertyTitle: 'Modern Apartment in Hydra',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    lastMessage: 'Thank you for your interest! The price is negotiable.',
    lastMessageTime: new Date('2024-01-20T10:15:00'),
    unreadCount: 0,
  },
  {
    id: 'conv-3',
    participantId: 'agent-1',
    participantName: 'Mohamed Haddad',
    participantAvatar: 'https://randomuser.me/api/portraits/men/48.jpg',
    lastMessage: 'I have some new listings that might interest you.',
    lastMessageTime: new Date('2024-01-19T16:45:00'),
    unreadCount: 1,
  },
];

// Mock Messages for conv-1
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    senderName: 'Amina Khelifi',
    senderAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    recipientId: 'seller-1',
    recipientName: 'Karim Mansouri',
    recipientAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    propertyId: 'prop-1',
    propertyTitle: 'Luxurious Villa with Sea View',
    content: 'Hello! I am interested in the villa in El Biar. Is it still available?',
    timestamp: new Date('2024-01-21T14:00:00'),
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'seller-1',
    senderName: 'Karim Mansouri',
    senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    recipientId: 'user-1',
    recipientName: 'Amina Khelifi',
    recipientAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    propertyId: 'prop-1',
    propertyTitle: 'Luxurious Villa with Sea View',
    content: 'Yes, the property is still available. Would you like to schedule a viewing?',
    timestamp: new Date('2024-01-21T14:30:00'),
    read: false,
  },
];

// Mock Viewings
const mockViewings: Viewing[] = [
  {
    id: 'view-1',
    propertyId: 'prop-2',
    property: mockProperties[1],
    buyerId: 'user-1',
    buyerName: 'Amina Khelifi',
    buyerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    scheduledTime: new Date('2024-01-25T10:00:00'),
    status: 'confirmed',
    notes: 'Please bring ID for building entry',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'view-2',
    propertyId: 'prop-1',
    property: mockProperties[0],
    buyerId: 'user-1',
    buyerName: 'Amina Khelifi',
    buyerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    scheduledTime: new Date('2024-01-28T14:00:00'),
    status: 'pending',
    createdAt: new Date('2024-01-21'),
  },
];

// Mock Saved Properties
const mockSavedProperties: SavedProperty[] = [
  {
    id: 'saved-1',
    userId: 'user-1',
    propertyId: 'prop-1',
    property: mockProperties[0],
    collectionName: 'Favorites',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'saved-2',
    userId: 'user-1',
    propertyId: 'prop-6',
    property: mockProperties[5],
    collectionName: 'Beach Properties',
    createdAt: new Date('2024-01-19'),
  },
];

interface StoreState {
  // Properties
  properties: Property[];
  featuredProperties: Property[];
  selectedProperty: Property | null;
  
  // Conversations & Messages
  conversations: Conversation[];
  messages: Message[];
  selectedConversation: Conversation | null;
  
  // Viewings
  viewings: Viewing[];
  
  // Saved Properties
  savedProperties: SavedProperty[];
  
  // Search
  searchFilters: SearchFilters;
  searchResults: Property[];
  recentSearches: string[];
  
  // Loading States
  isLoading: boolean;
  
  // Actions
  setSelectedProperty: (property: Property | null) => void;
  fetchProperties: () => Promise<void>;
  searchProperties: (filters: SearchFilters) => Promise<void>;
  setSearchFilters: (filters: SearchFilters) => void;
  addRecentSearch: (query: string) => void;
  
  // Messages
  setSelectedConversation: (conversation: Conversation | null) => void;
  sendMessage: (recipientId: string, content: string, propertyId?: string) => void;
  markConversationRead: (conversationId: string) => void;
  
  // Viewings
  scheduleViewing: (propertyId: string, date: Date, notes?: string) => Promise<void>;
  cancelViewing: (viewingId: string) => void;
  
  // Saved
  saveProperty: (propertyId: string, collection?: string) => void;
  unsaveProperty: (savedId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
  
  // Property Management
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'saves'>) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial State
  properties: mockProperties,
  featuredProperties: mockProperties.filter(p => p.featured),
  selectedProperty: null,
  conversations: mockConversations,
  messages: mockMessages,
  selectedConversation: null,
  viewings: mockViewings,
  savedProperties: mockSavedProperties,
  searchFilters: {},
  searchResults: [],
  recentSearches: ['Algiers', 'Villa', 'Hydra'],
  isLoading: false,

  // Actions
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  
  fetchProperties: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ properties: mockProperties, isLoading: false });
  },
  
  searchProperties: async (filters) => {
    set({ isLoading: true, searchFilters: filters });
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let results = [...mockProperties];
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
      );
    }
    
    if (filters.type) {
      results = results.filter(p => p.type === filters.type);
    }
    
    if (filters.listingType) {
      results = results.filter(p => p.listingType === filters.listingType);
    }
    
    if (filters.minPrice) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.minBedrooms) {
      results = results.filter(p => p.bedrooms >= filters.minBedrooms!);
    }
    
    if (filters.wilaya) {
      results = results.filter(p => p.wilaya.toLowerCase() === filters.wilaya!.toLowerCase());
    }
    
    set({ searchResults: results, isLoading: false });
  },
  
  setSearchFilters: (filters) => set({ searchFilters: filters }),
  
  addRecentSearch: (query) => set((state) => ({
    recentSearches: [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 5),
  })),
  
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  
  sendMessage: (recipientId, content, propertyId) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user-1',
      senderName: 'Amina Khelifi',
      senderAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      recipientId,
      recipientName: '',
      recipientAvatar: '',
      propertyId,
      content,
      timestamp: new Date(),
      read: false,
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  
  markConversationRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map(c => 
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },
  
  scheduleViewing: async (propertyId, date, notes) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const property = get().properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const newViewing: Viewing = {
      id: `view-${Date.now()}`,
      propertyId,
      property,
      buyerId: 'user-1',
      buyerName: 'Amina Khelifi',
      buyerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      scheduledTime: date,
      status: 'pending',
      notes,
      createdAt: new Date(),
    };
    
    set((state) => ({
      viewings: [...state.viewings, newViewing],
      isLoading: false,
    }));
  },
  
  cancelViewing: (viewingId) => {
    set((state) => ({
      viewings: state.viewings.map(v => 
        v.id === viewingId ? { ...v, status: 'cancelled' as const } : v
      ),
    }));
  },
  
  saveProperty: (propertyId, collection = 'Favorites') => {
    const property = get().properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const saved: SavedProperty = {
      id: `saved-${Date.now()}`,
      userId: 'user-1',
      propertyId,
      property,
      collectionName: collection,
      createdAt: new Date(),
    };
    
    set((state) => ({
      savedProperties: [...state.savedProperties, saved],
    }));
  },
  
  unsaveProperty: (savedId) => {
    set((state) => ({
      savedProperties: state.savedProperties.filter(s => s.id !== savedId),
    }));
  },
  
  isPropertySaved: (propertyId) => {
    return get().savedProperties.some(s => s.propertyId === propertyId);
  },
  
  createProperty: async (propertyData) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newProperty: Property = {
      ...propertyData,
      id: `prop-${Date.now()}`,
      views: 0,
      saves: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      properties: [newProperty, ...state.properties],
      isLoading: false,
    }));
  },
}));