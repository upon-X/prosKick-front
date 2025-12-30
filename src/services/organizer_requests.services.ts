import { 
  OrganizerFormData, 
  OrganizerRequest, 
  OrganizerRequestResponse, 
  PaginatedOrganizerRequests 
} from "@/types/georef";

// Usar las API routes de Next.js en lugar del backend directamente
const API_BASE_URL = "/api";


export class OrganizerRequestsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/organizer-requests`;
  }

  /**
   * Crear una nueva solicitud de organizador
   */
  async createRequest(data: OrganizerFormData): Promise<OrganizerRequestResponse> {
    try {
      // Enviar datos directamente - la API route se encarga de la transformación
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al enviar la solicitud");
      }

      return result;
    } catch (error: unknown) {
      console.error("Error creando solicitud de organizador:", error);
      throw error;
    }
  }

  /**
   * Obtener todas las solicitudes (solo para administradores)
   */
  async getAllRequests(options: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ success: boolean; data: PaginatedOrganizerRequests }> {
    try {
      const queryParams = new URLSearchParams();
      if (options.status) queryParams.append("status", options.status);
      if (options.page) queryParams.append("page", options.page.toString());
      if (options.limit) queryParams.append("limit", options.limit.toString());

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Aquí agregarías el token de autenticación cuando esté implementado
          // "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al obtener las solicitudes");
      }

      return result;
    } catch (error: unknown) {
      console.error("Error obteniendo solicitudes de organizador:", error);
      throw error;
    }
  }

  /**
   * Obtener una solicitud específica por ID
   */
  async getRequestById(id: string): Promise<{ success: boolean; data: OrganizerRequest }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Aquí agregarías el token de autenticación cuando esté implementado
          // "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al obtener la solicitud");
      }

      return result;
    } catch (error: unknown) {
      console.error("Error obteniendo solicitud de organizador:", error);
      throw error;
    }
  }

  /**
   * Actualizar el estado de una solicitud (solo para administradores)
   */
  async updateRequestStatus(
    id: string,
    data: {
      status: string;
      rejection_reason?: string;
      notes?: string;
    }
  ): Promise<{ success: boolean; data: OrganizerRequest }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Aquí agregarías el token de autenticación cuando esté implementado
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al actualizar la solicitud");
      }

      return result;
    } catch (error: unknown) {
      console.error("Error actualizando estado de solicitud:", error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const organizerRequestsService = new OrganizerRequestsService();
