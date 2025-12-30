/**
 * Utilidades para formatear y manejar estados de solicitudes
 * Siguiendo principios SOLID: funciones puras sin dependencias externas
 */

import type { RequestStatus, RequestType } from "@/types/requests";

// ============ MAPEO DE ESTADOS A TEXTOS ============

/**
 * Mapeo de estados a textos en español
 */
const STATUS_TEXT_MAP: Record<RequestStatus, string> = {
  pending_review: "Pendiente de Revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  pending_fix: "Requiere Corrección",
};

/**
 * Obtener el texto en español para un estado
 */
export const getStatusText = (status: RequestStatus): string => {
  return STATUS_TEXT_MAP[status] || status;
};

// ============ MAPEO DE ESTADOS A COLORES ============

/**
 * Colores Tailwind para cada estado
 */
export interface StatusColors {
  bg: string;
  text: string;
  border: string;
}

const STATUS_COLOR_MAP: Record<RequestStatus, StatusColors> = {
  pending_review: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  approved: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
  },
  pending_fix: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-300",
  },
};

/**
 * Obtener los colores Tailwind para un estado
 */
export const getStatusColors = (status: RequestStatus): StatusColors => {
  return STATUS_COLOR_MAP[status] || STATUS_COLOR_MAP.pending_review;
};

// ============ ICONOS POR ESTADO ============

const STATUS_ICON_MAP: Record<RequestStatus, string> = {
  pending_review: "⏳",
  approved: "✅",
  rejected: "❌",
  pending_fix: "⚠️",
};

/**
 * Obtener el icono para un estado
 */
export const getStatusIcon = (status: RequestStatus): string => {
  return STATUS_ICON_MAP[status] || "❓";
};

// ============ ICONOS POR TIPO DE SOLICITUD ============

const REQUEST_TYPE_ICON_MAP: Record<RequestType, string> = {
  organizer: "🏟️",
  // Futuros:
  // field: "⚽",
  // help: "🆘",
};

/**
 * Obtener el icono para un tipo de solicitud
 */
export const getRequestTypeIcon = (type: RequestType): string => {
  return REQUEST_TYPE_ICON_MAP[type] || "📋";
};

// ============ FORMATEO DE FECHAS ============

/**
 * Formatear fecha a formato legible en español
 * Ejemplo: "15 de marzo de 2024 - 14:30"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("es-AR", options);
};

/**
 * Formatear fecha en formato corto
 * Ejemplo: "15/03/2024"
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR");
};

/**
 * Formatear fecha relativa (hace cuánto tiempo)
 * Ejemplo: "hace 2 días", "hace 3 horas"
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `hace ${diffYears} ${diffYears === 1 ? "año" : "años"}`;
  }
  if (diffMonths > 0) {
    return `hace ${diffMonths} ${diffMonths === 1 ? "mes" : "meses"}`;
  }
  if (diffDays > 0) {
    return `hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
  }
  if (diffHours > 0) {
    return `hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  }
  if (diffMinutes > 0) {
    return `hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
  }
  return "hace un momento";
};

// ============ VALIDACIONES ============

/**
 * Validar si un estado es válido
 */
export const isValidStatus = (status: string): status is RequestStatus => {
  return Object.keys(STATUS_TEXT_MAP).includes(status);
};

/**
 * Validar si una solicitud está pendiente
 */
export const isPending = (status: RequestStatus): boolean => {
  return status === "pending_review" || status === "pending_fix";
};

/**
 * Validar si una solicitud fue completada (aprobada o rechazada)
 */
export const isCompleted = (status: RequestStatus): boolean => {
  return status === "approved" || status === "rejected";
};

// ============ HELPERS DE UI ============

/**
 * Obtener clase completa de badge para un estado
 */
export const getStatusBadgeClasses = (status: RequestStatus): string => {
  const colors = getStatusColors(status);
  return `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border} border`;
};

/**
 * Obtener descripción detallada para cada estado
 */
export const getStatusDescription = (status: RequestStatus): string => {
  const descriptions: Record<RequestStatus, string> = {
    pending_review:
      "Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos cuando tengamos novedades.",
    approved:
      "¡Felicitaciones! Tu solicitud fue aprobada. Podés comenzar a usar las funcionalidades correspondientes.",
    rejected:
      "Lamentablemente tu solicitud fue rechazada. Revisá la razón del rechazo para más información.",
    pending_fix:
      "Tu solicitud requiere correcciones. Por favor, revisá las observaciones y volvé a enviarla.",
  };

  return descriptions[status] || "";
};
