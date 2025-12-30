"use client";

/**
 * Componente para mostrar una solicitud individual
 * Componente genérico reutilizable que se adapta al tipo de solicitud
 */

import React, { useState } from "react";
import type {
  UserRequest,
  OrganizerUserRequest,
  RequestType,
} from "@/types/requests";
import {
  getStatusText,
  getStatusBadgeClasses,
  getStatusIcon,
  formatDate,
  formatRelativeDate,
  getStatusDescription,
} from "@/utils/request-status";

/**
 * Props del componente
 */
interface RequestCardProps<T extends UserRequest = UserRequest> {
  request: T;
  type: RequestType;
  onExpand?: (requestId: string) => void;
}

/**
 * Componente genérico para mostrar una solicitud
 */
export function RequestCard<T extends UserRequest = UserRequest>({
  request,
  type,
  onExpand,
}: RequestCardProps<T>): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (): void => {
    setExpanded(!expanded);
    if (!expanded && onExpand) {
      onExpand(request._id);
    }
  };

  /**
   * Renderizar contenido específico según el tipo
   */
  const renderSpecificContent = (): React.JSX.Element | null => {
    switch (type) {
      case "organizer":
        return renderOrganizerContent(request as OrganizerUserRequest);
      // Futuros tipos:
      // case "field":
      //   return renderFieldContent(request as FieldUserRequest);
      default:
        return null;
    }
  };

  /**
   * Renderizar contenido de solicitud de organizador
   */
  const renderOrganizerContent = (
    req: OrganizerUserRequest
  ): React.JSX.Element => {
    return (
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-700">
            Nombre del Predio:
          </span>
          <p className="text-base text-gray-900">{req.name}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-700">Ubicación:</span>
          <p className="text-sm text-gray-600">
            {req.location.city}, {req.location.province}
          </p>
          {req.location.address && (
            <p className="text-sm text-gray-500">{req.location.address}</p>
          )}
        </div>
        {req.phone_number && (
          <div>
            <span className="text-sm font-medium text-gray-700">Teléfono:</span>
            <p className="text-sm text-gray-600">{req.phone_number}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={getStatusBadgeClasses(request.status)}>
                <span className="mr-1">{getStatusIcon(request.status)}</span>
                {getStatusText(request.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Creada {formatRelativeDate(request.created_at)}
            </p>
          </div>
        </div>

        {/* Contenido específico del tipo */}
        <div className="mb-4">{renderSpecificContent()}</div>

        {/* Descripción del estado */}
        <div className="bg-gray-50 rounded p-3 mb-3">
          <p className="text-sm text-gray-700">
            {getStatusDescription(request.status)}
          </p>
        </div>

        {/* Botón para expandir/contraer detalles */}
        <button
          onClick={toggleExpand}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          {expanded ? "Ver menos" : "Ver más detalles"}
          <span className="text-xs">{expanded ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Detalles expandibles */}
      {expanded && (
        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 space-y-4">
          {/* Información de fechas */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Información de la Solicitud
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium text-gray-600">
                  Fecha de creación:
                </span>{" "}
                {formatDate(request.created_at)}
              </p>
              <p>
                <span className="font-medium text-gray-600">
                  Última actualización:
                </span>{" "}
                {formatDate(request.updated_at)}
              </p>
              {request.reviewed_at && (
                <p>
                  <span className="font-medium text-gray-600">
                    Fecha de revisión:
                  </span>{" "}
                  {formatDate(request.reviewed_at)}
                </p>
              )}
            </div>
          </div>

          {/* Información del revisor */}
          {request.reviewed_by && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Revisado por
              </h4>
              <p className="text-sm text-gray-600">
                {request.reviewed_by.name}
              </p>
            </div>
          )}

          {/* Razón de rechazo */}
          {request.rejection_reason && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Razón del Rechazo
              </h4>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800">
                  {request.rejection_reason}
                </p>
              </div>
            </div>
          )}

          {/* Notas adicionales */}
          {request.notes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Notas Adicionales
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">{request.notes}</p>
              </div>
            </div>
          )}

          {/* ID de la solicitud */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              ID de Solicitud
            </h4>
            <p className="text-xs text-gray-500 font-mono break-all">
              {request._id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
