"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  User as FirebaseUser,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, google_provider } from "../config/firebase";
import { useAuthStore } from "../store/auth.store";
import { IUser, IPlayerProfile } from "../types/auth";
import {
  login_with_google_service,
  get_user_data_service,
  update_profile_service,
} from "@/services/auth.services";

interface AuthContextType {
  user: IUser | null;
  player_profile: IPlayerProfile | null;
  firebase_user: FirebaseUser | null;
  loading: boolean;
  is_new_user: boolean;
  is_initialized: boolean;
  login_with_google: () => Promise<void>;
  logout: () => Promise<void>;
  update_profile: (data: Partial<IPlayerProfile>) => Promise<void>;
  refresh_user_data: () => Promise<void>;
  force_refresh: () => Promise<void>;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

// Provider del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Obtener estado y acciones del store
  const {
    user,
    player_profile,
    firebase_user,
    loading,
    is_new_user,
    is_initialized,
    set_firebase_user,
    set_loading,
    set_initialized,
    login: store_login,
    logout: store_logout,
    update_profile: store_update_profile,
    update_user_data,
  } = useAuthStore();

  // Función para hacer login con Google
  const login_with_google = async (): Promise<void> => {
    try {
      console.log("Iniciando proceso de login con Google");
      set_loading(true);

      const result = await signInWithPopup(auth, google_provider);
      const firebase_user = result.user;

      // Obtener el ID token
      const id_token = await firebase_user.getIdToken();

      // Usar el service para autenticación
      const data = await login_with_google_service(id_token);

      // Validar que tengamos los datos necesarios
      if (!data.user || !data.player_profile) {
        throw new Error("Datos de usuario incompletos");
      }

      // Actualizar el store
      store_login(
        data.user,
        data.player_profile,
        firebase_user,
        data.is_new_user || false
      );

      console.log("Login con Google completado exitosamente", {
        user_id: data.user.id,
        is_new_user: data.is_new_user,
      });
    } catch (error) {
      console.error("Error en login con Google:", error);
      throw error;
    } finally {
      set_loading(false);
    }
  };

  // Función para hacer logout
  const logout = async (): Promise<void> => {
    try {
      console.log("Iniciando proceso de logout");
      set_loading(true);

      // Cerrar sesión en Firebase
      await signOut(auth);
      // Limpiar estado en el store
      store_logout();

      console.log("Logout completado exitosamente");
    } catch (error) {
      console.error("Error en logout:", error);
      // Aún así limpiamos el estado local
      store_logout();
      throw error;
    } finally {
      set_loading(false);
    }
  };

  // Función para actualizar perfil
  const update_profile = async (
    data: Partial<IPlayerProfile>
  ): Promise<void> => {
    try {
      console.log("Iniciando actualización de perfil", {
        update_fields: Object.keys(data),
      });
      set_loading(true);

      if (!firebase_user) {
        throw new Error("Usuario no autenticado");
      }

      const token = await firebase_user.getIdToken();
      const updated_profile = await update_profile_service(token, data);

      store_update_profile(updated_profile);

      console.log("Perfil actualizado exitosamente", {
        profile_id: updated_profile.id,
      });
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      throw error;
    } finally {
      set_loading(false);
    }
  };

  // Función para refrescar datos del usuario
  const refresh_user_data = useCallback(async (): Promise<void> => {
    if (!firebase_user) {
      console.debug("No hay usuario de Firebase, saltando refresh");
      return;
    }

    try {
      console.log("Refrescando datos del usuario");
      set_loading(true);

      const token = await firebase_user.getIdToken();
      const data = await get_user_data_service(token);

      // Usar la nueva función del store para actualizar ambos datos
      update_user_data(data.user, data.player_profile);

      console.log("Datos del usuario refrescados exitosamente", {
        user_id: data.user.id,
      });
    } catch (error) {
      console.error("Error refrescando datos del usuario:", error);
      throw error;
    } finally {
      set_loading(false);
    }
  }, [firebase_user, update_user_data, set_loading]);

  // Función para forzar actualización (útil para el updater)
  const force_refresh = useCallback(async (): Promise<void> => {
    if (!firebase_user) {
      throw new Error("Usuario no autenticado");
    }

    try {
      console.log("Forzando actualización de datos del usuario");
      set_loading(true);

      const token = await firebase_user.getIdToken();
      const data = await get_user_data_service(token);

      update_user_data(data.user, data.player_profile);

      console.log("Datos del usuario actualizados forzadamente", {
        user_id: data.user.id,
      });
    } catch (error) {
      console.error("Error en actualización forzada:", error);
      throw error;
    } finally {
      set_loading(false);
    }
  }, [firebase_user, update_user_data, set_loading]);

  // Inicialización y persistencia de sesión
  useEffect(() => {
    const initialize_auth = async () => {
      if (is_initialized) return;

      try {
        console.log("Inicializando sistema de autenticación");
        set_loading(true);

        // Escuchar cambios en el estado de autenticación de Firebase
        const unsubscribe = onAuthStateChanged(auth, async (firebase_user) => {
          if (firebase_user) {
            console.log("Usuario de Firebase detectado", {
              uid: firebase_user.uid,
              email: firebase_user.email,
            });
            set_firebase_user(firebase_user);

            // Si tenemos datos persistidos pero no hay usuario de Firebase, limpiar
            if (user && !firebase_user) {
              console.warn(
                "Inconsistencia detectada: datos persistidos sin usuario de Firebase, limpiando"
              );
              store_logout();
              return;
            }

            // Si hay usuario de Firebase pero no tenemos datos del backend, refrescar
            if (firebase_user && !user) {
              console.log(
                "Usuario de Firebase sin datos del backend, refrescando"
              );
              await refresh_user_data();
            }
          } else {
            // Si no hay usuario de Firebase, limpiar todo
            console.log("No hay usuario de Firebase, limpiando estado");
            store_logout();
          }
        });

        set_initialized(true);
        set_loading(false);
        console.log("Sistema de autenticación inicializado correctamente");

        return () => {
          console.debug("Desuscribiendo listener de autenticación");
          unsubscribe();
        };
      } catch (error) {
        console.error("Error inicializando autenticación:", error);
        set_loading(false);
        set_initialized(true);
      }
    };

    initialize_auth();
  }, [
    is_initialized,
    user,
    firebase_user,
    refresh_user_data,
    set_firebase_user,
    set_initialized,
    set_loading,
    store_logout,
  ]);

  const value: AuthContextType = {
    user,
    player_profile,
    firebase_user,
    loading,
    is_new_user,
    is_initialized,
    login_with_google,
    logout,
    update_profile,
    refresh_user_data,
    force_refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
