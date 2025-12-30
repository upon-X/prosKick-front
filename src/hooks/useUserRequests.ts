/**
 * Hook genérico para manejar solicitudes de usuario
 * Siguiendo principios SOLID: SRP - maneja estado y lógica de solicitudes
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { userRequestsService } from "@/services/user-requests.service";
import { RequestType } from "@/types/requests";
import type {
  UserRequest,
  GetRequestsOptions,
  PaginatedResult,
} from "@/types/requests";

/**
 * Estado del hook
 */
interface UseUserRequestsState<T extends UserRequest> {
  requests: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: Error | null;
  stats: {
    total: number;
    pending: number;
  };
}

/**
 * Acciones disponibles del hook
 */
interface UseUserRequestsActions {
  fetchRequests: () => Promise<void>;
  refetch: () => Promise<void>;
  clearError: () => void;
  setPage: (page: number) => void;
}

/**
 * Resultado del hook
 */
type UseUserRequestsResult<T extends UserRequest> = UseUserRequestsState<T> &
  UseUserRequestsActions;

/**
 * Hook genérico para obtener y manejar solicitudes de usuario
 *
 * @param options - Opciones de filtrado y paginación
 * @param autoFetch - Si debe hacer fetch automático al montar (default: true)
 */
export function useUserRequests<T extends UserRequest = UserRequest>(
  options: GetRequestsOptions = {},
  autoFetch: boolean = true
): UseUserRequestsResult<T> {
  // Estado
  const [state, setState] = useState<UseUserRequestsState<T>>({
    requests: [],
    total: 0,
    page: options.page || 1,
    limit: options.limit || 10,
    totalPages: 0,
    loading: false,
    error: null,
    stats: {
      total: 0,
      pending: 0,
    },
  });

  // Ref para mantener valores actuales del state
  const stateRef = useRef(state);
  stateRef.current = state;

  /**
   * Obtener solicitudes del servidor
   */
  const fetchRequests = useCallback(async () => {
    try {
      setState((prev) => {
        // Usar el state actual para evitar dependencias
        return { ...prev, loading: true, error: null };
      });

      // Usar ref para acceder al state actual sin agregar dependencias
      const currentPage = stateRef.current.page;
      const currentLimit = stateRef.current.limit;

      const response = await userRequestsService.getUserRequests<T>({
        ...options,
        page: currentPage,
        limit: currentLimit,
      });

      if (response.success) {
        setState((prev) => ({
          ...prev,
          requests: response.data.data,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          loading: false,
        }));
      } else {
        throw new Error(response.message || "Error al obtener solicitudes");
      }
    } catch (error: unknown) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorObj,
      }));
    }
    // Solo opciones como dependencia, no state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.type, options.status]);

  /**
   * Obtener estadísticas
   */
  const fetchStats = useCallback(async () => {
    try {
      const stats = await userRequestsService.getUserRequestsStats(
        options.type
      );
      setState((prev) => ({
        ...prev,
        stats,
      }));
    } catch (error: unknown) {
      console.error("Error obteniendo estadísticas:", error);
    }
  }, [options.type]);

  /**
   * Refetch - volver a cargar datos
   */
  const refetch = useCallback(async () => {
    await Promise.all([fetchRequests(), fetchStats()]);
  }, [fetchRequests, fetchStats]);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Cambiar página
   */
  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  /**
   * Efecto para fetch automático al montar o cambiar opciones de filtro
   */
  useEffect(() => {
    if (autoFetch) {
      fetchRequests();
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, options.type, options.status]);

  /**
   * Efecto para refetch cuando cambia la página
   */
  useEffect(() => {
    if (autoFetch && state.page !== (options.page || 1)) {
      fetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.page]);

  return {
    ...state,
    fetchRequests,
    refetch,
    clearError,
    setPage,
  };
}

/**
 * Hook específico para solicitudes de organizador
 * Método de conveniencia con tipo específico
 */
export function useOrganizerRequests(
  options: Omit<GetRequestsOptions, "type"> = {},
  autoFetch: boolean = true
) {
  return useUserRequests(
    {
      ...options,
      type: RequestType.ORGANIZER,
    },
    autoFetch
  );
}
