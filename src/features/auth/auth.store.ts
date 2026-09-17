import { create } from "zustand";
import type { User } from "../../lib/api";

type AuthState = { token: string | null; user: User | null; setAuth: (token: string, user: User) => void; logout: () => void };
const tokenKey = "gls_token"; const userKey = "gls_user";
let savedUser: User | null = null;
try { savedUser = JSON.parse(localStorage.getItem(userKey) || "null"); } catch { savedUser = null; }
export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(tokenKey), user: savedUser,
  setAuth: (token, user) => { localStorage.setItem(tokenKey, token); localStorage.setItem(userKey, JSON.stringify(user)); set({ token, user }); },
  logout: () => { localStorage.removeItem(tokenKey); localStorage.removeItem(userKey); set({ token: null, user: null }); },
}));
