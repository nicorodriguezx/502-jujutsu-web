// ---------------------------------------------------------------------------
// Auth context: holds login state, provides login/logout functions.
// ---------------------------------------------------------------------------
import { createContext, useContext, useState } from "react";
import api, { setSession, getStoredUser, clearSession, getToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const isLoggedIn = !!user && !!getToken();

  async function login(email, password) {
    const data = await api.post("/api/auth/login", { email, password });
    setSession(data.token, data.user);
    setUser(data.user);
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
