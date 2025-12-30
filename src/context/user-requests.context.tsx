"use client";

/**
 * Context para gestión global de solicitudes de usuario
 * Siguiendo principios SOLID: mantiene estado global y provee funciones de actualización
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { RequestType } from "@/types/requests";

/**
 * Estado del context
 */
interface UserRequestsContextState {
  // Contador de solicitudes pendientes por tipo
  pendingCounts: Partial<Record<RequestType, number>>;
  // Timestamp de última actualización
  lastUpdate: Date | null;
  // Si se están cargando datos
  loading: boolean;
}

/**
 * Acciones del context
 */
interface UserRequestsContextActions {
  // Actualizar contador de pendientes para un tipo
  updatePendingCount: (type: RequestType, count: number) => void;
  // Forzar refresh de datos
  refresh: () => void;
  // Limpiar todos los contadores
  clearCounts: () => void;
}

/**
 * Tipo completo del context
 */
type UserRequestsContextValue = UserRequestsContextState &
  UserRequestsContextActions;

/**
 * Context
 */
const UserRequestsContext = createContext<UserRequestsContextValue | undefined>(
  undefined
);

/**
 * Props del provider
 */
interface UserRequestsProviderProps {
  children: ReactNode;
}

/**
 * Provider del context
 */
export function UserRequestsProvider({
  children,
}: UserRequestsProviderProps): React.JSX.Element {
  // Estado
  const [state, setState] = useState<UserRequestsContextState>({
    pendingCounts: {},
    lastUpdate: null,
    loading: false,
  });

  /**
   * Actualizar contador de solicitudes pendientes para un tipo
   */
  const updatePendingCount = useCallback((type: RequestType, count: number) => {
    setState((prev) => ({
      ...prev,
      pendingCounts: {
        ...prev.pendingCounts,
        [type]: count,
      },
      lastUpdate: new Date(),
    }));
  }, []);

  /**
   * Forzar refresh de datos
   * Los componentes que escuchen este cambio deben refetchear
   */
  const refresh = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lastUpdate: new Date(),
    }));
  }, []);

  /**
   * Limpiar todos los contadores
   */
  const clearCounts = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingCounts: {},
      lastUpdate: null,
    }));
  }, []);

  // Valor del context
  const value: UserRequestsContextValue = {
    ...state,
    updatePendingCount,
    refresh,
    clearCounts,
  };

  return (
    <UserRequestsContext.Provider value={value}>
      {children}
    </UserRequestsContext.Provider>
  );
}

/**
 * Hook para usar el context
 * Lanza error si se usa fuera del provider
 */
export function useUserRequestsContext(): UserRequestsContextValue {
  const context = useContext(UserRequestsContext);

  if (context === undefined) {
    throw new Error(
      "useUserRequestsContext debe usarse dentro de UserRequestsProvider"
    );
  }

  return context;
}

/**
 * Hook para obtener el contador de pendientes de un tipo
 */
export function usePendingCount(type: RequestType): number {
  const { pendingCounts } = useUserRequestsContext();
  return pendingCounts[type] || 0;
}
