import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, signOut, type AuthUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => undefined,
});

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    return Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn' || payload.event === 'signedOut') {
        refresh();
      }
    });
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, logout }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

