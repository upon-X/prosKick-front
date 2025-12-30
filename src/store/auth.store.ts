import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User as FirebaseUser } from "firebase/auth";
import { IUser, IPlayerProfile } from "../types/auth";

const AUTH_STORE_NAME = "nviem-futbol-user";
// Tipos

interface AuthState {
  // Estado de autenticación
  user: IUser | null;
  player_profile: IPlayerProfile | null;
  firebase_user: FirebaseUser | null;
  loading: boolean;
  is_new_user: boolean;
  is_initialized: boolean;

  // Acciones
  set_user: (user: IUser | null) => void;
  set_player_profile: (profile: IPlayerProfile | null) => void;
  set_firebase_user: (user: FirebaseUser | null) => void;
  set_loading: (loading: boolean) => void;
  set_is_new_user: (is_new: boolean) => void;
  set_initialized: (initialized: boolean) => void;

  // Acciones de autenticación
  login: (
    user: IUser,
    profile: IPlayerProfile,
    firebase_user: FirebaseUser,
    is_new: boolean
  ) => void;
  logout: () => void;
  update_profile: (profile: IPlayerProfile) => void;

  // Acciones de Firebase
  login_with_google: () => Promise<void>;
  logout_firebase: () => Promise<void>;
  update_player_profile: (data: Partial<IPlayerProfile>) => Promise<void>;
  refresh_user_data: () => Promise<void>;
  
  // Acciones de actualización de usuario
  update_user_data: (user: IUser, profile: IPlayerProfile) => void;
  force_refresh: () => Promise<void>;
}

// Store principal de autenticación
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      player_profile: null,
      firebase_user: null,
      loading: false,
      is_new_user: false,
      is_initialized: false,

      // Setters básicos
      set_user: (user) => set({ user }),
      set_player_profile: (profile) => set({ player_profile: profile }),
      set_firebase_user: (firebase_user) => set({ firebase_user }),
      set_loading: (loading) => set({ loading }),
      set_is_new_user: (is_new_user) => set({ is_new_user }),
      set_initialized: (is_initialized) => set({ is_initialized }),

      // Acciones de autenticación
      login: (user, profile, firebase_user, is_new) => {
        set({
          user,
          player_profile: profile,
          firebase_user,
          is_new_user: is_new,
          loading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          player_profile: null,
          firebase_user: null,
          is_new_user: false,
          loading: false,
        });
      },

      update_profile: (profile) => {
        set({ player_profile: profile });
      },

      // Acciones de Firebase (implementadas en el contexto)
      login_with_google: async () => {
        // Esta función se implementará en el contexto
        throw new Error(
          "login_with_google debe ser implementado en el contexto"
        );
      },

      logout_firebase: async () => {
        // Esta función se implementará en el contexto
        throw new Error("logout_firebase debe ser implementado en el contexto");
      },

      update_player_profile: async () => {
        // Esta función se implementará en el contexto
        throw new Error(
          "update_player_profile debe ser implementado en el contexto"
        );
      },

      refresh_user_data: async () => {
        // Esta función se implementará en el contexto
        throw new Error(
          "refresh_user_data debe ser implementado en el contexto"
        );
      },

      // Acciones de actualización de usuario
      update_user_data: (user, profile) => {
        set({ user, player_profile: profile });
      },

      force_refresh: async () => {
        // Esta función se implementará en el contexto
        throw new Error("force_refresh debe ser implementado en el contexto");
      },
    }),
    {
      name: AUTH_STORE_NAME, // nombre único para localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir datos esenciales, no funciones ni objetos complejos
      partialize: (state) => ({
        user: state.user,
        player_profile: state.player_profile,
        is_new_user: state.is_new_user,
        is_initialized: state.is_initialized,
      }),
    }
  )
);

// Selectores útiles
export const useUser = () => useAuthStore((state) => state.user);
export const usePlayerProfile = () =>
  useAuthStore((state) => state.player_profile);
export const useFirebaseUser = () =>
  useAuthStore((state) => state.firebase_user);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useIsNewUser = () => useAuthStore((state) => state.is_new_user);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user);
export const useIsInitialized = () =>
  useAuthStore((state) => state.is_initialized);
