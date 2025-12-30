"use client";

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from "react";
import { ICancha } from "../types/canchas";
import { get_canchas_service } from "../services/canchas.services";

// Estado del context
interface CanchasState {
  canchas: ICancha[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

// Acciones del reducer
type CanchasAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: ICancha[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

// Estado inicial
const initialState: CanchasState = {
  canchas: [],
  loading: false,
  error: null,
  lastFetch: null,
};

// Reducer
const canchasReducer = (state: CanchasState, action: CanchasAction): CanchasState => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        canchas: action.payload,
        lastFetch: Date.now(),
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Context
interface CanchasContextType {
  state: CanchasState;
  fetchCanchas: () => Promise<void>;
  clearError: () => void;
  isCacheValid: () => boolean;
}

const CanchasContext = createContext<CanchasContextType | undefined>(undefined);

// Provider
interface CanchasProviderProps {
  children: ReactNode;
}

export const CanchasProvider: React.FC<CanchasProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(canchasReducer, initialState);

  // Verificar si el cache es válido (5 minutos)
  const isCacheValid = useCallback((): boolean => {
    if (!state.lastFetch) return false;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos
    return Date.now() - state.lastFetch < CACHE_DURATION;
  }, [state.lastFetch]);

  // Función para obtener canchas
  const fetchCanchas = useCallback(async (): Promise<void> => {
    // Si el cache es válido, no hacer nueva request
    if (isCacheValid() && state.canchas.length > 0) {
      return;
    }

    dispatch({ type: "FETCH_START" });

    try {
      const canchas = await get_canchas_service();
      dispatch({ type: "FETCH_SUCCESS", payload: canchas });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      dispatch({ type: "FETCH_ERROR", payload: errorMessage });
    }
  }, [isCacheValid, state.canchas.length]);

  // Función para limpiar errores
  const clearError = useCallback((): void => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value: CanchasContextType = {
    state,
    fetchCanchas,
    clearError,
    isCacheValid,
  };

  return <CanchasContext.Provider value={value}>{children}</CanchasContext.Provider>;
};

// Hook personalizado
export const useCanchas = (): CanchasContextType => {
  const context = useContext(CanchasContext);
  if (context === undefined) {
    throw new Error("useCanchas debe ser usado dentro de un CanchasProvider");
  }
  return context;
};
