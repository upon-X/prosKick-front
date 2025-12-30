"use client";

/**
 * Tab completo de solicitudes de usuario
 * Incluye selector de tipo, lista y estadísticas
 */

import React, { useState, useEffect } from "react";
import { RequestsList } from "./RequestsList";
import { useUserRequests } from "@/hooks/useUserRequests";
import { useUserRequestsContext } from "@/context/user-requests.context";
import { RequestType, REQUEST_TYPES_METADATA } from "@/types/requests";
import type { RequestStatus, OrganizerUserRequest } from "@/types/requests";

/**
 * Props del componente
 */
interface RequestsTabProps {
  defaultType?: RequestType;
}

/**
 * Componente principal del tab de solicitudes
 */
export function RequestsTab({
  defaultType = RequestType.ORGANIZER,
}: RequestsTabProps): React.JSX.Element {
  const [selectedType, setSelectedType] = useState<RequestType>(defaultType);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>(
    undefined
  );

  // Context para estadísticas globales
  const { updatePendingCount } = useUserRequestsContext();

  // Hook para obtener solicitudes
  const {
    requests,
    total,
    page,
    totalPages,
    loading,
    error,
    stats,
    refetch,
    setPage,
  } = useUserRequests<OrganizerUserRequest>(
    {
      type: selectedType,
      status: statusFilter,
      limit: 10,
    },
    true
  );

  /**
   * Actualizar contador de pendientes en el context
   */
  useEffect(() => {
    if (stats.pending !== undefined) {
      updatePendingCount(selectedType, stats.pending);
    }
  }, [stats.pending, selectedType, updatePendingCount]);

  /**
   * Renderizar selector de tipo de solicitud
   * Por ahora solo hay un tipo, pero está preparado para más
   */
  const renderTypeSelector = (): React.JSX.Element | null => {
    const types = Object.values(RequestType);

    // Si hay solo un tipo, no mostrar selector
    if (types.length === 1) {
      return null;
    }

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Solicitud
        </label>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => {
            const metadata = REQUEST_TYPES_METADATA[type];
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setStatusFilter(undefined); // Reset filter al cambiar tipo
                  setPage(1); // Reset page
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>{metadata.icon}</span>
                <span>{metadata.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Renderizar estadísticas
   */
  const renderStats = (): React.JSX.Element => {
    return (
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total de Solicitudes</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-yellow-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-green-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.total - stats.pending}
          </div>
          <div className="text-sm text-gray-600">Completadas</div>
        </div>
      </div>
    );
  };

  /**
   * Renderizar header con título y botón de refresh
   */
  const renderHeader = (): React.JSX.Element => {
    const metadata = REQUEST_TYPES_METADATA[selectedType];

    return (
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>{metadata.icon}</span>
            <span>Mis Solicitudes</span>
          </h2>
          <p className="text-gray-600 mt-1">{metadata.description}</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      {renderHeader()}

      {/* Selector de tipo */}
      {renderTypeSelector()}

      {/* Estadísticas */}
      {!loading && !error && renderStats()}

      {/* Lista de solicitudes */}
      <RequestsList
        requests={requests}
        type={selectedType}
        loading={loading}
        error={error}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRefresh={refetch}
      />
    </div>
  );
}
