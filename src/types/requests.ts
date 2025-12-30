/**
 * Tipos genéricos para el sistema de solicitudes de usuario
 * Sistema modular que permite agregar nuevos tipos de solicitudes fácilmente
 */

// ============ ENUMS Y CONSTANTES ============

/**
 * Enum de tipos de solicitudes
 */
export enum RequestType {
  ORGANIZER = "organizer",
  // Futuros tipos:
  // FIELD = "field",
  // HELP = "help",
  // TOURNAMENT = "tournament",
}

/**
 * Estados posibles de una solicitud
 */
export type RequestStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "pending_fix";

// ============ INTERFACES BASE ============

/**
 * Información del revisor
 */
export interface ReviewedBy {
  id: string;
  name: string;
}

/**
 * Tipo base genérico para cualquier solicitud de usuario
 * Todas las solicitudes específicas deben extender esta interfaz
 */
export interface BaseUserRequest {
  _id: string;
  user_id: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  reviewed_by?: ReviewedBy;
  reviewed_at?: string;
  rejection_reason?: string;
  notes?: string;
}

// ============ TIPOS ESPECÍFICOS ============

/**
 * Solicitud de organizador de canchas
 * Extiende BaseUserRequest con datos específicos de organizador
 */
export interface OrganizerUserRequest extends BaseUserRequest {
  name: string;
  email: string;
  phone_number: string;
  location: {
    country: "AR";
    province: string;
    city: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  image?: string;
}

// Futuros tipos específicos:
// export interface FieldUserRequest extends BaseUserRequest { ... }
// export interface HelpUserRequest extends BaseUserRequest { ... }

/**
 * Union type de todos los tipos de solicitudes
 * Agregar nuevos tipos aquí cuando se implementen
 */
export type UserRequest = OrganizerUserRequest;
// | FieldUserRequest
// | HelpUserRequest;

// ============ RESPUESTAS DE API ============

/**
 * Resultado paginado genérico
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Respuesta de la API para solicitudes de usuario
 */
export interface UserRequestsResponse<T = UserRequest> {
  success: boolean;
  data: PaginatedResult<T>;
  message?: string;
}

/**
 * Respuesta de la API para una solicitud individual
 */
export interface SingleUserRequestResponse<T = UserRequest> {
  success: boolean;
  data: T;
  message?: string;
}

// ============ OPCIONES Y FILTROS ============

/**
 * Opciones para obtener solicitudes
 */
export interface GetRequestsOptions {
  type?: RequestType;
  status?: RequestStatus;
  page?: number;
  limit?: number;
}

// ============ ESTADÍSTICAS ============

/**
 * Estadísticas de solicitudes por estado
 */
export interface RequestsStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  pendingFix: number;
}

// ============ METADATA DE TIPOS ============

/**
 * Metadata para cada tipo de solicitud
 * Usado para renderizar iconos, títulos, etc.
 */
export interface RequestTypeMetadata {
  type: RequestType;
  label: string;
  icon: string;
  description: string;
}

/**
 * Metadata de todos los tipos de solicitudes
 */
export const REQUEST_TYPES_METADATA: Record<RequestType, RequestTypeMetadata> =
  {
    [RequestType.ORGANIZER]: {
      type: RequestType.ORGANIZER,
      label: "Solicitud de Organizador",
      icon: "🏟️",
      description: "Solicitud para ser organizador de canchas",
    },
    // Futuros tipos:
    // [RequestType.FIELD]: {
    //   type: RequestType.FIELD,
    //   label: "Solicitud de Cancha",
    //   icon: "⚽",
    //   description: "Solicitud para agregar una cancha",
    // },
  };
