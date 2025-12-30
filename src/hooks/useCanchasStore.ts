import { useEffect } from "react";
import { useCanchasSelectors, useCanchasActions } from "../store/canchas.store";
import { useCanchas as useCanchasContext } from "../context/canchas.context";
import { ICancha } from "../types/canchas";

/**
 * Hook que integra el store de Zustand con el context de canchas
 * Proporciona sincronización automática entre ambos
 */
export const useCanchasStore = () => {
  const context = useCanchasContext();
  const selectors = useCanchasSelectors();
  const actions = useCanchasActions();

  // Sincronizar datos del context al store
  useEffect(() => {
    if (context.state.canchas.length > 0) {
      actions.setCanchas(context.state.canchas);
    }
  }, [context.state.canchas, actions]);

  // Sincronizar estado de carga
  useEffect(() => {
    if (context.state.loading) {
      actions.setCacheValid(false);
    } else if (context.state.canchas.length > 0) {
      actions.setCacheValid(true);
      actions.setLastFetch(Date.now());
    }
  }, [context.state.loading, context.state.canchas.length, actions]);

  return {
    // Datos del store
    ...selectors,

    // Acciones del store
    ...actions,

    // Estado del context
    loading: context.state.loading,
    error: context.state.error,

    // Acciones del context
    fetchCanchas: context.fetchCanchas,
    clearError: context.clearError,
  };
};

/**
 * Hook para usar solo el store sin context
 * Útil cuando no necesitas la funcionalidad de cache del context
 */
export const useCanchasStoreOnly = () => {
  const selectors = useCanchasSelectors();
  const actions = useCanchasActions();

  return {
    ...selectors,
    ...actions,
  };
};

/**
 * Hook para sincronizar canchas desde una fuente externa
 * Útil para cargar datos desde APIs externas
 */
export const useCanchasSync = (externalCanchas: ICancha[]) => {
  const actions = useCanchasActions();

  useEffect(() => {
    if (externalCanchas.length > 0) {
      actions.setCanchas(externalCanchas);
      actions.setLastFetch(Date.now());
      actions.setCacheValid(true);
    }
  }, [externalCanchas, actions]);
};

/**
 * Hook para manejo de filtros avanzados
 */
export const useCanchasFilters = () => {
  const selectors = useCanchasSelectors();
  const actions = useCanchasActions();

  return {
    // Estado de filtros
    tipoFiltro: selectors.tipoFiltro,
    searchTerm: selectors.searchTerm,
    locationFilter: selectors.locationFilter,

    // Acciones de filtros
    setTipoFiltro: actions.setTipoFiltro,
    setSearchTerm: actions.setSearchTerm,
    setLocationFilter: actions.setLocationFilter,
    clearFilters: actions.clearFilters,

    // Resultados filtrados
    filteredCanchas: selectors.filteredCanchas,

    // Utilidades
    hasActiveFilters: !!(
      selectors.tipoFiltro ||
      selectors.searchTerm ||
      selectors.locationFilter
    ),
    filterCount: [
      selectors.tipoFiltro,
      selectors.searchTerm,
      selectors.locationFilter,
    ].filter(Boolean).length,
  };
};

/**
 * Hook para manejo de selección de canchas
 */
export const useCanchasSelection = () => {
  const selectors = useCanchasSelectors();
  const actions = useCanchasActions();

  return {
    selectedCancha: selectors.selectedCancha,
    setSelectedCancha: actions.setSelectedCancha,
    clearSelection: () => actions.setSelectedCancha(null),
    hasSelection: !!selectors.selectedCancha,
  };
};

/**
 * Hook para estadísticas de canchas
 */
export const useCanchasStats = () => {
  const { stats } = useCanchasSelectors();

  return {
    stats,
    // Estadísticas derivadas
    completionRate:
      stats.total > 0
        ? (stats.conImagen + stats.conTelefono) / (stats.total * 2)
        : 0,
    averageReputacion: stats.promedioReputacion,
    typeDistribution: {
      organizadores: stats.organizadores,
      equiposPrimera: stats.equiposPrimera,
      organizadoresPercentage:
        stats.total > 0 ? (stats.organizadores / stats.total) * 100 : 0,
      equiposPrimeraPercentage:
        stats.total > 0 ? (stats.equiposPrimera / stats.total) * 100 : 0,
    },
  };
};
