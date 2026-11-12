import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/db';
const { getSession, onAuthStateChange } = auth;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((s) => {
        setSession(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const { data: listener } = onAuthStateChange((s) => {
      setSession(s);
      setLoading(false);
    });

    return () => {
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, isAdmin: !!session }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
