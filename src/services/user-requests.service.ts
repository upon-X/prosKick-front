/**
 * Servicio genérico para manejar solicitudes de usuario
 * Siguiendo principios SOLID: SRP - cada método tiene una sola responsabilidad
 */

import { RequestType } from "@/types/requests";
import type {
  UserRequest,
  OrganizerUserRequest,
  UserRequestsResponse,
  GetRequestsOptions,
} from "@/types/requests";

/**
 * URL base de la API
 */
const API_BASE_URL = "/api";

/**
 * Servicio para manejar las solicitudes de usuario
 * Implementa operaciones CRUD sobre solicitudes genéricas
 */
export class UserRequestsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/user-requests`;
  }

  /**
   * Obtener las solicitudes del usuario autenticado
   */
  async getUserRequests<T extends UserRequest = UserRequest>(
    options: GetRequestsOptions = {}
  ): Promise<UserRequestsResponse<T>> {
    try {
      const queryParams = new URLSearchParams();

      if (options.type) queryParams.append("type", options.type);
      if (options.status) queryParams.append("status", options.status);
      if (options.page) queryParams.append("page", options.page.toString());
      if (options.limit) queryParams.append("limit", options.limit.toString());

      const url = `${this.baseUrl}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Incluir cookies para autenticación
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al obtener las solicitudes");
      }

      return result;
    } catch (error: unknown) {
      console.error("Error obteniendo solicitudes de usuario:", error);
      throw error;
    }
  }

  /**
   * Obtener solicitudes de organizador del usuario autenticado
   * Método de conveniencia con tipo específico
   */
  async getOrganizerRequests(
    options: Omit<GetRequestsOptions, "type"> = {}
  ): Promise<UserRequestsResponse<OrganizerUserRequest>> {
    return this.getUserRequests<OrganizerUserRequest>({
      ...options,
      type: RequestType.ORGANIZER,
    });
  }

  /**
   * Obtener estadísticas de las solicitudes del usuario
   * Útil para mostrar badges con contadores
   */
  async getUserRequestsStats(
    type?: RequestType
  ): Promise<{ total: number; pending: number }> {
    try {
      // Obtener todas las solicitudes (sin paginación) para calcular estadísticas
      const response = await this.getUserRequests({
        type,
        limit: 1000, // Límite alto para obtener todas
      });

      const pending = response.data.data.filter(
        (req) => req.status === "pending_review" || req.status === "pending_fix"
      ).length;

      return {
        total: response.data.total,
        pending,
      };
    } catch (error: unknown) {
      console.error("Error obteniendo estadísticas de solicitudes:", error);
      return { total: 0, pending: 0 };
    }
  }

  // Futuros métodos para otros tipos de solicitudes:
  // async getFieldRequests() { ... }
  // async getHelpRequests() { ... }
}

/**
 * Instancia singleton del servicio
 * DIP: Los consumidores dependen de la abstracción (la interfaz del servicio)
 */
export const userRequestsService = new UserRequestsService();
