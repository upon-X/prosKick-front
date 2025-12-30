import { useState } from "react";
import { organizerRequestsService } from "@/services/organizer_requests.services";
import { OrganizerFormData, OrganizerRequestResponse } from "@/types/georef";

export const useOrganizerRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (data: OrganizerFormData): Promise<OrganizerRequestResponse | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await organizerRequestsService.createRequest(data);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al enviar la solicitud";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllRequests = async (options?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await organizerRequestsService.getAllRequests(options);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener las solicitudes";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getRequestById = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await organizerRequestsService.getRequestById(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener la solicitud";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (
    id: string,
    data: {
      status: string;
      rejection_reason?: string;
      notes?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await organizerRequestsService.updateRequestStatus(id, data);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar la solicitud";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequestStatus,
    clearError: () => setError(null),
  };
};
