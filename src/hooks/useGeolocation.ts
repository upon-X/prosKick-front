import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const CABA_COORDINATES = {
  latitude: -34.6037,
  longitude: -58.3816,
};

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  // Desestructurar las opciones para evitar problemas de dependencias
  const { enableHighAccuracy, timeout, maximumAge } = options;

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
      loading: false,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = "Error desconocido al obtener la ubicación";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Permiso de ubicación denegado. Usando CABA como centro.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Ubicación no disponible. Usando CABA como centro.";
        break;
      case error.TIMEOUT:
        errorMessage = "Tiempo de espera agotado. Usando CABA como centro.";
        break;
    }

    setState({
      latitude: CABA_COORDINATES.latitude,
      longitude: CABA_COORDINATES.longitude,
      error: errorMessage,
      loading: false,
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocalización no soportada por este navegador",
        loading: false,
        latitude: CABA_COORDINATES.latitude,
        longitude: CABA_COORDINATES.longitude,
      }));
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: enableHighAccuracy ?? true,
      timeout: timeout ?? 10000,
      maximumAge: maximumAge ?? 300000, // 5 minutos
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  return {
    ...state,
    isCABA:
      state.latitude === CABA_COORDINATES.latitude &&
      state.longitude === CABA_COORDINATES.longitude,
  };
};
