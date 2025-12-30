"use client";

import React, { useEffect, useMemo } from "react";
import { useCanchas } from "@/hooks/useCanchas";
import { useCanchasByType } from "@/hooks/useCanchas";
import { useCanchasByLocation } from "@/hooks/useCanchas";
import { useCanchasSearch } from "@/hooks/useCanchas";
import { useCanchasStats } from "@/hooks/useCanchas";
import { ICancha, TipoCancha } from "@/types/canchas";
import { 
  getMarkerColor, 
  getMarkerIcon, 
  getMarkerSize, 
  generatePopupContent 
} from "./config";
import MapaCanchas from "./MapaCanchas";
import LateralCard from "./LateralCard";

interface MapaCanchasWithContextProps {
  // Props para filtros
  tipoFiltro?: TipoCancha;
  searchTerm?: string;
  locationFilter?: {
    lat: number;
    lng: number;
    radius: number;
  };
  
  // Props para el mapa
  onCanchaSelect?: (cancha: ICancha | null) => void;
  selectedCancha?: ICancha | null;
  
  // Props para mostrar estadísticas
  showStats?: boolean;
}

/**
 * Componente wrapper que integra el context de canchas con el mapa
 * Proporciona funcionalidades de filtrado y búsqueda
 */
export const MapaCanchasWithContext: React.FC<MapaCanchasWithContextProps> = ({
  tipoFiltro,
  searchTerm,
  locationFilter,
  onCanchaSelect,
  selectedCancha,
  showStats = false,
}) => {
  // Hook principal para obtener todas las canchas
  const { canchas: allCanchas, loading, error, fetchCanchas, clearError } = useCanchas();
  
  // Hook para estadísticas
  const { stats } = useCanchasStats();

  // Hooks para filtros específicos
  const { canchas: canchasByType } = useCanchasByType(tipoFiltro || "organizador");
  const { canchas: canchasBySearch } = useCanchasSearch(searchTerm || "");
  const { canchas: canchasByLocation } = useCanchasByLocation(
    locationFilter?.lat || -31.6333, 
    locationFilter?.lng || -60.7000, 
    locationFilter?.radius || 10
  );

  // Determinar qué canchas usar según los filtros
  const filteredCanchas = useMemo(() => {
    if (tipoFiltro) {
      return canchasByType;
    }
    
    if (searchTerm) {
      return canchasBySearch;
    }
    
    if (locationFilter) {
      return canchasByLocation;
    }
    
    return allCanchas;
  }, [tipoFiltro, searchTerm, locationFilter, canchasByType, canchasBySearch, canchasByLocation, allCanchas]);

  // Memoizar las canchas procesadas para el mapa
  const processedCanchas = useMemo(() => {
    return filteredCanchas.map(cancha => ({
      ...cancha,
      markerColor: getMarkerColor(cancha.tipo),
      markerIcon: getMarkerIcon(cancha.tipo),
      markerSize: getMarkerSize(cancha.tipo),
      popupContent: generatePopupContent(cancha),
    }));
  }, [filteredCanchas]);

  // Efecto para cargar canchas al montar el componente
  useEffect(() => {
    if (allCanchas.length === 0 && !loading) {
      fetchCanchas();
    }
  }, [allCanchas.length, loading, fetchCanchas]);


  // Mostrar loading
  if (loading && allCanchas.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando canchas...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchCanchas();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Estadísticas */}
      {showStats && (
        <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Estadísticas</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total: {stats.total}</div>
            <div>Organizadores: {stats.organizadores}</div>
            <div>Equipos Primera: {stats.equiposPrimera}</div>
            <div>Promedio: {stats.promedioReputacion.toFixed(1)}</div>
          </div>
        </div>
      )}

      {/* Mapa */}
      <MapaCanchas
        canchas={processedCanchas}
      />

      {/* Card lateral con información de la cancha seleccionada */}
      {selectedCancha && (
        <LateralCard
          isOpen={true}
          cancha={selectedCancha}
          onClose={() => onCanchaSelect?.(null)}
        />
      )}

      {/* Información de filtros activos */}
      <div className="absolute bottom-4 left-4 z-10 bg-white p-3 rounded-lg shadow-lg">
        <div className="text-sm text-gray-600">
          {tipoFiltro && <div>Tipo: {tipoFiltro}</div>}
          {searchTerm && <div>Búsqueda: &quot;{searchTerm}&quot;</div>}
          {locationFilter && (
            <div>
              Ubicación: {locationFilter.lat.toFixed(4)}, {locationFilter.lng.toFixed(4)}
              <br />
              Radio: {locationFilter.radius}km
            </div>
          )}
          <div className="font-medium">
            Mostrando {filteredCanchas.length} de {allCanchas.length} canchas
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaCanchasWithContext;
