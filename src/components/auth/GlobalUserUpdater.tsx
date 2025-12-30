"use client";

import { useAuth } from "@/context/auth.context";
import { useEffect, useRef } from "react";

interface GlobalUserUpdaterProps {
  /** Si debe mostrar logs de debug (default: false) */
  debug?: boolean;
}

/**
 * Componente que actualiza los datos del usuario al montar la app
 * Solo actualiza una vez al cargar la página, no hay intervalos ni actualizaciones automáticas
 */
export default function GlobalUserUpdater({
  debug = false,
}: GlobalUserUpdaterProps) {
  const { user, firebase_user, is_initialized, force_refresh } = useAuth();
  const hasUpdated = useRef(false);

  // Actualizar datos del usuario solo una vez al montar la app si está completamente inicializado
  useEffect(() => {
    // Solo ejecutar si:
    // 1. El sistema está inicializado
    // 2. Hay un usuario en el store
    // 3. Hay un usuario de Firebase
    // 4. No se ha actualizado antes
    if (is_initialized && user && firebase_user && !hasUpdated.current) {
      hasUpdated.current = true;

      if (debug) {
        console.log("Usuario autenticado, actualizando datos al cargar la app");
      }

      // Actualizar datos del usuario una sola vez al montar
      force_refresh().catch((error) => {
        if (debug) {
          console.error(
            "Error actualizando datos del usuario al cargar:",
            error
          );
        }
      });
    }
  }, [user, firebase_user, is_initialized, force_refresh, debug]);

  // Este componente no renderiza nada visible
  return null;
}
