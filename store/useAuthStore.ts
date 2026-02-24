import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedRole: UserRole | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const mockUser: User = {
  id: 'user-1',
  name: 'Amina Khelifi',
  email: 'amina@example.com',
  phone: '+213 555 123 456',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  role: 'buyer',
  verified: true,
  createdAt: new Date(),
  location: 'Algiers, Algeria',
  bio: 'Looking for my dream home in Algiers',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  selectedRole: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setRole: (role) => set({ selectedRole: role }),
  
  login: async (email, password) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },
  
  signup: async (name, email, password) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newUser: User = {
      ...mockUser,
      id: 'user-new',
      name,
      email,
    };
    set({ user: newUser, isAuthenticated: true, isLoading: false });
  },
  
  logout: () => set({ user: null, isAuthenticated: false, selectedRole: null }),
  
  updateProfile: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null,
  })),
}));