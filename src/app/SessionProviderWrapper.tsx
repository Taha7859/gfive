"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>; // ✅ Added
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

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
      const res = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
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

  // ✅ Ye function login ke baad manually call hoga
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
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
