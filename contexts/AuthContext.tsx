"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function getSession() {

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
