"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  role: string;
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SessionProviderWrapper');
  }
  return context;
};

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Backend se user fetch karna (token verify)
  const fetchUser = async () => {
    try {
      console.log('🔄 Fetching user from API...');
      const res = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!res.ok) {
        console.log('❌ User fetch failed:', res.status);
        setUser(null);
        return;
      }

      const data = await res.json();
      console.log('✅ User fetched successfully:', data.user?.email);
      setUser(data.user);
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ IMPROVED Tab Synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      console.log('🔄 Storage event:', event.key, event.newValue);
      
      // Logout event check karein
      if (event.key === 'logout') {
        console.log('🚪 Logout event received from another tab');
        setUser(null);
      }
      
      // Login event check karein
      if (event.key === 'login') {
        console.log('🔑 Login event received from another tab');
        // Thoda delay dekar fetch karein taaki cookie properly set ho jaye
        setTimeout(() => {
          fetchUser();
        }, 100);
      }
    };

    // Storage events listen karein
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ✅ Ye function login ke baad manually call hoga
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  // ✅ Enhanced Logout function with Tab Sync
  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await fetch("/api/users/logout", {
        method: "GET",
        credentials: "include",
      });
      
      // Frontend state clear karein
      setUser(null);
      
      // ✅ LocalStorage mein event trigger karein
      localStorage.setItem('logout', Date.now().toString());
      console.log('✅ Logged out and notified other tabs');
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  const value = {
    user,
    loading,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-200">
          Loading session...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}