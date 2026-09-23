import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  clearSession,
  getCurrentUser,
  getSessionToken,
  type ApiUser,
} from "@/lib/api";

type AuthValue = {
  user: ApiUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setAuthenticatedUser: (user: ApiUser) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthValue>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  setAuthenticatedUser: () => {},
  clearAuth: () => {},
});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCurrentUser() {
    const token = getSessionToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCurrentUser();
  }, []);

  async function refreshUser() {
    const token = getSessionToken();

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      clearSession();
      setUser(null);
    }
  }

  function setAuthenticatedUser(authenticatedUser: ApiUser) {
    setUser(authenticatedUser);
  }

  function clearAuth() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        setAuthenticatedUser,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
