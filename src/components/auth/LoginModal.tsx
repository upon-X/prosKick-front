"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth.context";

interface DirectLoginProps {
  isActive: boolean;
  onSuccess: () => void;
  text?: string;
}

/**
 * Componente que ejecuta el login automáticamente sin modal intermedio
 */
export default function DirectLogin({
  isActive,
  onSuccess,
  text = "Iniciando sesión...",
}: DirectLoginProps) {
  const { login_with_google } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isActive && !isLoggingIn && !isLoading) {
      handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      setIsLoading(true);
      setError(null);

      await login_with_google();

      // Login exitoso
      onSuccess();
    } catch (err: unknown) {
      console.error("Error en login:", err);
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoggingIn(false);
      setIsLoading(false);
    }
  };

  // Si hay un error, mostrar un mensaje discreto
  if (error && isActive) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Error al iniciar sesión
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // Mostrar loading discreto durante el login
  if (isLoading && isActive) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700 font-medium">{text}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
