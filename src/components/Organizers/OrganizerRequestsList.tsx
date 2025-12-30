"use client";

import { useCallback, useEffect, useState } from "react";
import { useOrganizerRequests } from "@/hooks/useOrganizerRequests";
import { OrganizerRequest } from "@/types/georef";

interface OrganizerRequestsListProps {
  status?: string;
  showAdminActions?: boolean;
}

export default function OrganizerRequestsList({ 
  status, 
  showAdminActions = false 
}: OrganizerRequestsListProps) {
  const { isLoading, error, getAllRequests, updateRequestStatus } = useOrganizerRequests();
  const [requests, setRequests] = useState<OrganizerRequest[]>([]);
  const [currentPage] = useState(1);

  const loadRequests = useCallback(async () => {
    try {
      const response = await getAllRequests({
        status,
        page: currentPage,
        limit: 10,
      });
      
      if (response?.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
    }
  }, [getAllRequests, status, currentPage]);

  useEffect(() => {
    loadRequests();
  }, [currentPage, status, loadRequests]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateRequestStatus(id, { status: newStatus });
      await loadRequests(); // Recargar la lista
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  if (isLoading) {
    return <div className="p-4">Cargando solicitudes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Solicitudes de Organizadores</h3>
      
      {requests.length === 0 ? (
        <p className="text-gray-500">No hay solicitudes disponibles</p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request._id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{request.name}</h4>
                  <p className="text-sm text-gray-600">{request.email}</p>
                  <p className="text-sm text-gray-600">{request.phone_number}</p>
                  <p className="text-sm text-gray-600">
                    {request.location.city}, {request.location.province}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    request.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
                
                {showAdminActions && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'approved')}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'rejected')}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
