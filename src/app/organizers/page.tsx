"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import BeOrganizerForm, {
  BeOrganizerFormRef,
} from "@/components/Organizers/BeOrganizerForm";
import DirectLogin from "@/components/auth/LoginModal";
import { useAuth } from "@/context/auth.context";
import { OrganizerFormData } from "@/types/georef";
import { useOrganizerRequests } from "@/hooks/useOrganizerRequests";
import { toast } from "sonner";

export default function OrganizersPage() {
  const { isLoading, createRequest, clearError } = useOrganizerRequests();
  const { user } = useAuth();
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<OrganizerFormData | null>(null);
  const [isWaitingForUser, setIsWaitingForUser] = useState(false);
  const formRef = useRef<BeOrganizerFormRef>(null);

  const submitRequest = useCallback(
    async (data: OrganizerFormData) => {
      try {
        console.log("Enviando solicitud de organizador:", data);

        const dataWithUserId = {
          ...data,
        };
        // Agregar user_id y email del usuario logueado al data antes de enviar
        if (user?.id && user?.email) {
          dataWithUserId.user_id = user.id;
          dataWithUserId.email = user.email;
        }
        const response = await createRequest(dataWithUserId);

        if (response?.success) {
          toast.success(
            "¡Solicitud enviada correctamente! Te contactaremos pronto."
          );
          // Limpiar datos pendientes si existen
          setPendingFormData(null);
          // Resetear el formulario
          formRef.current?.resetForm();
        } else {
          throw new Error(response?.message || "Error al enviar la solicitud");
        }
      } catch (err: unknown) {
        throw err;
      }
    },
    [user, createRequest]
  );

  const handleSubmitError = useCallback((err: unknown) => {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido";
    toast.error(errorMessage);
  }, []);

  // Efecto para enviar automáticamente la solicitud cuando el usuario esté disponible después del login
  useEffect(() => {
    const sendPendingRequest = async () => {
      if (pendingFormData && user?.id && user?.email && isWaitingForUser) {
        try {
          await submitRequest(pendingFormData);
          setPendingFormData(null);
          setIsWaitingForUser(false);
        } catch (err) {
          handleSubmitError(err);
          setIsWaitingForUser(false);
        }
      }
    };

    sendPendingRequest();
  }, [
    user,
    pendingFormData,
    isWaitingForUser,
    submitRequest,
    handleSubmitError,
  ]);

  const handleSubmit = async (data: OrganizerFormData) => {
    try {
      clearError();

      // Si el usuario NO está autenticado, guardar datos y ejecutar login automáticamente
      if (!user) {
        setPendingFormData(data);
        setIsWaitingForUser(true);
        setIsLoginActive(true);
        return;
      }

      // Si el usuario está autenticado, enviar la solicitud directamente
      await submitRequest(data);
    } catch (err: unknown) {
      handleSubmitError(err);
    }
  };

  const handleLoginSuccess = async () => {
    // Desactivar el login
    setIsLoginActive(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto md:px-4">
        <BeOrganizerForm
          ref={formRef}
          onSubmit={handleSubmit}
          loading={isLoading}
        />

        {/* Login directo - se activa automáticamente si no está autenticado */}
        <DirectLogin
          isActive={isLoginActive}
          onSuccess={handleLoginSuccess}
          text="Iniciando sesión para enviar tu solicitud..."
        />
      </div>
    </div>
  );
}
