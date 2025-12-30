"use client";

import { useCallback, useRef } from "react";
import { useAuth } from "@/context/auth.context";

interface UseUserUpdaterReturn {
  /** Función para actualizar manualmente los datos del usuario */
  refreshUser: () => Promise<void>;
  /** Si está actualizando en este momento */
  isRefreshing: boolean;
  /** Función para habilitar/deshabilitar la actualización automática */
  setAutoRefresh: (enabled: boolean) => void;
  /** Si la actualización automática está habilitada */
  autoRefreshEnabled: boolean;
}

/**
 * Hook para manejar la actualización automática y manual de los datos del usuario
 * 
 * @param options - Configuración del updater
 * @returns Objeto con funciones y estado para manejar la actualización
 */
export const useUserUpdater = (): UseUserUpdaterReturn => {
  // COMENTADO: Opciones no se usan por defecto, pero se mantienen para compatibilidad
  // const {
  //   autoRefreshInterval = 30000, // 30 segundos por defecto - COMENTADO: No se usa
  //   autoRefreshOnMount = false, // COMENTADO: Cambiado a false por defecto
  //   refreshOnFocus = false, // COMENTADO: Cambiado a false por defecto
  //   refreshOnActivity = false, // COMENTADO: Cambiado a false por defecto
  // } = options;

  const { force_refresh, loading } = useAuth();
  // COMENTADO: Referencias no se usan por defecto
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoRefreshRef = useRef(true);
  // const lastActivityRef = useRef<number>(Date.now());

  // Función para actualizar manualmente
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      await force_refresh();
    } catch (error) {
      console.error("Error actualizando datos del usuario:", error);
      // No relanzamos el error para evitar crashes en la UI
    }
  }, [force_refresh]);

  // Función para habilitar/deshabilitar auto-refresh - COMENTADO: No se usa por defecto
  const setAutoRefresh = useCallback((enabled: boolean) => {
    autoRefreshRef.current = enabled;
    
    // COMENTADO: Intervalos automáticos deshabilitados por defecto
    // if (enabled && !intervalRef.current) {
    //   // Iniciar el intervalo si no está corriendo
    //   intervalRef.current = setInterval(() => {
    //     if (autoRefreshRef.current) {
    //       refreshUser();
    //     }
    //   }, autoRefreshInterval);
    // } else if (!enabled && intervalRef.current) {
    //   // Limpiar el intervalo si está deshabilitado
    //   clearInterval(intervalRef.current);
    //   intervalRef.current = null;
    // }
  }, []); // COMENTADO: Dependencias removidas ya que no se usan

  // COMENTADO: Detectar actividad del usuario - No se usa por defecto
  // useEffect(() => {
  //   if (!refreshOnActivity) return;

  //   const handleActivity = () => {
  //     lastActivityRef.current = Date.now();
  //   };

  //   // Eventos que indican actividad del usuario
  //   const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
  //   events.forEach(event => {
  //     document.addEventListener(event, handleActivity, true);
  //   });

  //   return () => {
  //     events.forEach(event => {
  //       document.removeEventListener(event, handleActivity, true);
  //     });
  //   };
  // }, [refreshOnActivity]);

  // COMENTADO: Actualizar cuando la ventana vuelve a tener foco - No se usa por defecto
  // useEffect(() => {
  //   if (!refreshOnFocus) return;

  //   const handleFocus = () => {
  //     // Solo actualizar si han pasado al menos 5 segundos desde la última actualización
  //     const timeSinceLastActivity = Date.now() - lastActivityRef.current;
  //     if (timeSinceLastActivity > 5000) {
  //       refreshUser();
  //     }
  //   };

  //   window.addEventListener('focus', handleFocus);
  //   return () => window.removeEventListener('focus', handleFocus);
  // }, [refreshUser, refreshOnFocus]);

  // COMENTADO: Configurar auto-refresh al montar - No se usa por defecto
  // useEffect(() => {
  //   if (autoRefreshOnMount) {
  //     setAutoRefresh(true);
  //   }

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   };
  // }, [autoRefreshOnMount, setAutoRefresh]);

  return {
    refreshUser,
    isRefreshing: loading,
    setAutoRefresh,
    autoRefreshEnabled: autoRefreshRef.current,
  };
};
