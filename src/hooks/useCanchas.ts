import {  useEffect } from "react";
import { useCanchas as useCanchasContext } from "../context/canchas.context";
import { TipoCancha } from "../types/canchas";

/**
 * Hook principal para manejo de canchas
 * Proporciona funcionalidades básicas de obtención y filtrado
 */
export const useCanchas = () => {
  const { state, fetchCanchas, clearError, isCacheValid } = useCanchasContext();

  // Cargar canchas automáticamente al montar el componente
  useEffect(() => {
    if (!isCacheValid() || state.canchas.length === 0) {
      fetchCanchas();
    }
  }, [fetchCanchas, isCacheValid, state.canchas.length]);

  return {
    canchas: state.canchas,
    loading: state.loading,
    error: state.error,
    fetchCanchas,
    clearError,
    isCacheValid: isCacheValid(),
  };
};

/**
 * Hook para filtrar canchas por tipo
 */
export const useCanchasByType = (tipo: TipoCancha) => {
  const { canchas, loading, error, fetchCanchas, clearError } = useCanchas();

  const canchasFiltradas = canchas.filter(cancha => cancha.tipo === tipo);

  return {
    canchas: canchasFiltradas,
    loading,
    error,
    fetchCanchas,
    clearError,
  };
};

/**
 * Hook para buscar canchas por nombre
 */
export const useCanchasSearch = (searchTerm: string) => {
  const { canchas, loading, error, fetchCanchas, clearError } = useCanchas();

  const canchasFiltradas = canchas.filter(cancha =>
    cancha.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cancha.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cancha.organizador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cancha.equipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    canchas: canchasFiltradas,
    loading,
    error,
    fetchCanchas,
    clearError,
  };
};

/**
 * Hook para obtener canchas por ubicación (radio)
 */
export const useCanchasByLocation = (lat: number, lng: number, radiusKm: number = 10) => {
  const { canchas, loading, error, fetchCanchas, clearError } = useCanchas();

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const canchasCercanas = canchas.filter(cancha => {
    const distance = calculateDistance(lat, lng, cancha.lat, cancha.lng);
    return distance <= radiusKm;
  }).sort((a, b) => {
    const distanceA = calculateDistance(lat, lng, a.lat, a.lng);
    const distanceB = calculateDistance(lat, lng, b.lat, b.lng);
    return distanceA - distanceB;
  });

  return {
    canchas: canchasCercanas,
    loading,
    error,
    fetchCanchas,
    clearError,
  };
};

/**
 * Hook para obtener estadísticas de canchas
 */
export const useCanchasStats = () => {
  const { canchas, loading, error } = useCanchas();

  const stats = {
    total: canchas.length,
    organizadores: canchas.filter(c => c.tipo === "organizador").length,
    equiposPrimera: canchas.filter(c => c.tipo === "equipo_primera").length,
    promedioReputacion: canchas.length > 0 
      ? canchas.reduce((sum, c) => sum + c.reputacion, 0) / canchas.length 
      : 0,
    conImagen: canchas.filter(c => c.image).length,
    conTelefono: canchas.filter(c => c.phone).length,
  };

  return {
    stats,
    loading,
    error,
  };
};
