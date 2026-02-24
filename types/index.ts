export type UserRole = 'buyer' | 'seller' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  location?: string;
  bio?: string;
}

export type PropertyType = 'apartment' | 'house' | 'land' | 'villa' | 'commercial';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'archived';
export type ListingType = 'sale' | 'rent';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  city: string;
  wilaya: string;
  coordinates: Coordinates;
  images: string[];
  amenities: string[];
  status: PropertyStatus;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerPhone: string;
  agentId?: string;
  featured: boolean;
  views: number;
  saves: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ViewingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Viewing {
  id: string;
  propertyId: string;
  property: Property;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  scheduledTime: Date;
  status: ViewingStatus;
  notes?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  propertyId?: string;
  propertyTitle?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export interface Review {
  id: string;
  agentId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  collectionName: string;
  createdAt: Date;
}

export interface Agent {
  id: string;
  userId: string;
  user: User;
  license: string;
  experience: number;
  totalListings: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
}

export interface SearchFilters {
  query?: string;
  type?: PropertyType;
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minArea?: number;
  maxArea?: number;
  wilaya?: string;
  city?: string;
  amenities?: string[];
}

export interface PriceBreakdown {
  basePrice: number;
  commission: number;
  taxes: number;
  total: number;
}