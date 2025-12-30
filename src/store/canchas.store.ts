import { create } from "zustand";
import { ICancha, TipoCancha } from "../types/canchas";

// Estado del store
interface CanchasStoreState {
  // Datos
  canchas: ICancha[];
  selectedCancha: ICancha | null;
  
  // Filtros
  tipoFiltro: TipoCancha | null;
  searchTerm: string;
  locationFilter: {
    lat: number;
    lng: number;
    radius: number;
  } | null;
  
  // UI State
  showStats: boolean;
  showFilters: boolean;
  
  // Cache
  lastFetch: number | null;
  cacheValid: boolean;
}

// Acciones del store
interface CanchasStoreActions {
  // Datos
  setCanchas: (canchas: ICancha[]) => void;
  setSelectedCancha: (cancha: ICancha | null) => void;
  
  // Filtros
  setTipoFiltro: (tipo: TipoCancha | null) => void;
  setSearchTerm: (term: string) => void;
  setLocationFilter: (filter: { lat: number; lng: number; radius: number } | null) => void;
  clearFilters: () => void;
  
  // UI State
  setShowStats: (show: boolean) => void;
  setShowFilters: (show: boolean) => void;
  
  // Cache
  setLastFetch: (timestamp: number) => void;
  setCacheValid: (valid: boolean) => void;
  
  // Utilidades
  getFilteredCanchas: () => ICancha[];
  getCanchasByType: (tipo: TipoCancha) => ICancha[];
  getCanchasBySearch: (term: string) => ICancha[];
  getCanchasByLocation: (lat: number, lng: number, radius: number) => ICancha[];
  getStats: () => {
    total: number;
    organizadores: number;
    equiposPrimera: number;
    promedioReputacion: number;
    conImagen: number;
    conTelefono: number;
  };
}

// Estado inicial
const initialState: CanchasStoreState = {
  canchas: [],
  selectedCancha: null,
  tipoFiltro: null,
  searchTerm: "",
  locationFilter: null,
  showStats: false,
  showFilters: true,
  lastFetch: null,
  cacheValid: false,
};

// Store principal
export const useCanchasStore = create<CanchasStoreState & CanchasStoreActions>((set, get) => ({
  ...initialState,

  // Acciones de datos
  setCanchas: (canchas) => set({ canchas }),
  setSelectedCancha: (cancha) => set({ selectedCancha: cancha }),

  // Acciones de filtros
  setTipoFiltro: (tipo) => set({ tipoFiltro: tipo }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setLocationFilter: (filter) => set({ locationFilter: filter }),
  clearFilters: () => set({
    tipoFiltro: null,
    searchTerm: "",
    locationFilter: null,
  }),

  // Acciones de UI
  setShowStats: (show) => set({ showStats: show }),
  setShowFilters: (show) => set({ showFilters: show }),

  // Acciones de cache
  setLastFetch: (timestamp) => set({ lastFetch: timestamp }),
  setCacheValid: (valid) => set({ cacheValid: valid }),

  // Utilidades
  getFilteredCanchas: () => {
    const { canchas, tipoFiltro, searchTerm, locationFilter } = get();
    let filtered = [...canchas];

    // Filtro por tipo
    if (tipoFiltro) {
      filtered = filtered.filter(cancha => cancha.tipo === tipoFiltro);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cancha =>
        cancha.name.toLowerCase().includes(term) ||
        cancha.address?.toLowerCase().includes(term) ||
        cancha.organizador?.toLowerCase().includes(term) ||
        cancha.equipo?.toLowerCase().includes(term)
      );
    }

    // Filtro por ubicación
    if (locationFilter) {
      const { lat, lng, radius } = locationFilter;
      filtered = filtered.filter(cancha => {
        const distance = calculateDistance(lat, lng, cancha.lat, cancha.lng);
        return distance <= radius;
      }).sort((a, b) => {
        const distanceA = calculateDistance(lat, lng, a.lat, a.lng);
        const distanceB = calculateDistance(lat, lng, b.lat, b.lng);
        return distanceA - distanceB;
      });
    }

    return filtered;
  },

  getCanchasByType: (tipo) => {
    const { canchas } = get();
    return canchas.filter(cancha => cancha.tipo === tipo);
  },

  getCanchasBySearch: (term) => {
    const { canchas } = get();
    const searchTerm = term.toLowerCase();
    return canchas.filter(cancha =>
      cancha.name.toLowerCase().includes(searchTerm) ||
      cancha.address?.toLowerCase().includes(searchTerm) ||
      cancha.organizador?.toLowerCase().includes(searchTerm) ||
      cancha.equipo?.toLowerCase().includes(searchTerm)
    );
  },

  getCanchasByLocation: (lat, lng, radius) => {
    const { canchas } = get();
    return canchas.filter(cancha => {
      const distance = calculateDistance(lat, lng, cancha.lat, cancha.lng);
      return distance <= radius;
    }).sort((a, b) => {
      const distanceA = calculateDistance(lat, lng, a.lat, a.lng);
      const distanceB = calculateDistance(lat, lng, b.lat, b.lng);
      return distanceA - distanceB;
    });
  },

  getStats: () => {
    const { canchas } = get();
    return {
      total: canchas.length,
      organizadores: canchas.filter(c => c.tipo === "organizador").length,
      equiposPrimera: canchas.filter(c => c.tipo === "equipo_primera").length,
      promedioReputacion: canchas.length > 0 
        ? canchas.reduce((sum, c) => sum + c.reputacion, 0) / canchas.length 
        : 0,
      conImagen: canchas.filter(c => c.image).length,
      conTelefono: canchas.filter(c => c.phone).length,
    };
  },
}));

// Función auxiliar para calcular distancia
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

// Selectores derivados
export const useCanchasSelectors = () => {
  const store = useCanchasStore();
  
  return {
    // Datos
    canchas: store.canchas,
    selectedCancha: store.selectedCancha,
    filteredCanchas: store.getFilteredCanchas(),
    
    // Filtros
    tipoFiltro: store.tipoFiltro,
    searchTerm: store.searchTerm,
    locationFilter: store.locationFilter,
    
    // UI State
    showStats: store.showStats,
    showFilters: store.showFilters,
    
    // Cache
    lastFetch: store.lastFetch,
    cacheValid: store.cacheValid,
    
    // Stats
    stats: store.getStats(),
  };
};

// Acciones del store
export const useCanchasActions = () => {
  const store = useCanchasStore();
  
  return {
    // Datos
    setCanchas: store.setCanchas,
    setSelectedCancha: store.setSelectedCancha,
    
    // Filtros
    setTipoFiltro: store.setTipoFiltro,
    setSearchTerm: store.setSearchTerm,
    setLocationFilter: store.setLocationFilter,
    clearFilters: store.clearFilters,
    
    // UI State
    setShowStats: store.setShowStats,
    setShowFilters: store.setShowFilters,
    
    // Cache
    setLastFetch: store.setLastFetch,
    setCacheValid: store.setCacheValid,
  };
};
