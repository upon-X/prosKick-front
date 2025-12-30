"use client";

import React from "react";
import { useAuth } from "../../context/auth.context";
import { CanchasProvider } from "../../context/canchas.context";
import MapaCanchas from "../../components/map/MapaCanchas";
import { useCanchas } from "../../hooks/useCanchas";

// Componente interno que usa el context de canchas
function MapContent() {
  const {
    canchas,
    loading: canchasLoading,
    error: canchasError,
  } = useCanchas();

  // Mostrar loading mientras se cargan las canchas
  if (canchasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando canchas...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay algún problema
  if (canchasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Error al cargar las canchas</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-gray-50 overflow-hidden"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
      }}
    >
      {/* Mapa a pantalla completa */}
      <main
        className="h-screen w-screen overflow-hidden map-container"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overflow: "hidden",
        }}
      >
        <MapaCanchas
          canchas={canchas}
          mapTilerKey={process.env.NEXT_PUBLIC_MAPTILER_KEY}
        />
      </main>
    </div>
  );
}

export default function MapPage() {
  const { loading, is_initialized } = useAuth();

  // Mostrar loading mientras se inicializa la autenticación
  if (loading || !is_initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <CanchasProvider>
      <MapContent />
    </CanchasProvider>
  );
}
