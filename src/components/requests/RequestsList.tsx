"use client";

/**
 * Componente para mostrar lista de solicitudes
 * Maneja loading, empty states, filtros y paginación
 */

import React from "react";
import { RequestCard } from "./RequestCard";
import type { UserRequest, RequestStatus, RequestType } from "@/types/requests";

/**
 * Props del componente
 */
interface RequestsListProps<T extends UserRequest = UserRequest> {
  requests: T[];
  type: RequestType;
  loading: boolean;
  error: Error | null;
  // Filtros
  statusFilter?: RequestStatus;
  onStatusFilterChange?: (status: RequestStatus | undefined) => void;
  // Paginación
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  // Refresh
  onRefresh?: () => void;
}

/**
 * Componente para la lista de solicitudes
 */
export function RequestsList<T extends UserRequest = UserRequest>({
  requests,
  type,
  loading,
  error,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  onRefresh,
}: RequestsListProps<T>): React.JSX.Element {
  /**
   * Renderizar estado de loading
   */
  const renderLoading = (): React.JSX.Element => {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Renderizar estado vacío
   */
  const renderEmpty = (): React.JSX.Element => {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 sm:p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No tenés solicitudes
        </h3>
        <p className="text-gray-600 mb-4">
          Cuando hagas una solicitud, la verás acá con su estado de seguimiento.
        </p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Actualizar
          </button>
        )}
      </div>
    );
  };

  /**
   * Renderizar estado de error
   */
  const renderError = (): React.JSX.Element => {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error al cargar solicitudes
        </h3>
        <p className="text-red-700 mb-4">{error?.message}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  };

  /**
   * Renderizar filtros de estado
   */
  const renderFilters = (): React.JSX.Element => {
    const statuses: Array<{ value: RequestStatus | undefined; label: string }> =
      [
        { value: undefined, label: "Todas" },
        { value: "pending_review", label: "Pendientes" },
        { value: "approved", label: "Aprobadas" },
        { value: "rejected", label: "Rechazadas" },
        { value: "pending_fix", label: "Requieren Corrección" },
      ];

    return (
      <div className="mb-6 flex flex-wrap gap-2">
        {statuses.map(({ value, label }) => (
          <button
            key={value || "all"}
            onClick={() => onStatusFilterChange?.(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };

  /**
   * Renderizar paginación
   */
  const renderPagination = (): React.JSX.Element | null => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    );
  };

  // Estados de UI
  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  if (requests.length === 0) {
    return renderEmpty();
  }

  // Lista normal
  return (
    <div>
      {/* Filtros */}
      {onStatusFilterChange && renderFilters()}

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {requests.map((request) => (
          <RequestCard key={request._id} request={request} type={type} />
        ))}
      </div>

      {/* Paginación */}
      {renderPagination()}
    </div>
  );
}
