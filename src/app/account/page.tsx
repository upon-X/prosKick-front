"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth.context";
import { LoginButton } from "@/components/auth/LoginButton";
import { ProfileDisplay } from "@/components/profile/profile_display";
import { ProfileForm } from "@/components/profile/profile_form";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { RequestsTab } from "@/components/requests/RequestsTab";
import { usePendingCount } from "@/context/user-requests.context";
import { RequestType } from "@/types/requests";

export default function AccountPage() {
  const { user, loading, is_initialized } = useAuth();
  const [show_profile_form, set_show_profile_form] = useState(false);
  const [terms_and_conditions_accepted, set_terms_and_conditions_accepted] =
    useState(false);
  const [active_tab, set_active_tab] = useState<"profile" | "requests">(
    "profile"
  );

  // Obtener contador de solicitudes pendientes
  const pending_requests_count = usePendingCount(RequestType.ORGANIZER);

  // Mostrar loading mientras se inicializa la autenticación
  if (loading || !is_initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!is_initialized ? "Inicializando..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar página de login
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Login Section */}
        <main className="max-w-md py-[calc(20dvh)] mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600">
                Accedé a tu cuenta para acceder a funcionalidades exclusivas.
              </p>
            </div>
            <p className="text-gray-600">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={terms_and_conditions_accepted}
                onChange={() =>
                  set_terms_and_conditions_accepted(
                    !terms_and_conditions_accepted
                  )
                }
              />
              <span className="cursor-pointer">
                Acepto{" "}
                <Link href="/terms-and-conditions" className="text-blue-600">
                  terminos y condiciones
                </Link>
              </span>
            </p>
            <div className="space-y-6">
              <LoginButton
                className="w-full text-lg py-4"
                disabled={!terms_and_conditions_accepted}
              >
                Iniciar sesión con Google
              </LoginButton>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  ¿No tenés cuenta? El inicio de sesión con Google crea tu
                  cuenta automáticamente
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Usuario autenticado - mostrar perfil y opciones
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Navigation */}
          <nav className="mb-8">
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => {
                  set_active_tab("profile");
                  set_show_profile_form(false);
                }}
                className={`pb-4 font-medium transition-colors relative ${
                  active_tab === "profile"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Mi Perfil
              </button>
              <button
                onClick={() => {
                  set_active_tab("requests");
                  set_show_profile_form(false);
                }}
                className={`pb-4 font-medium transition-colors relative ${
                  active_tab === "requests"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Mis Solicitudes
                {pending_requests_count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-yellow-500 rounded-full">
                    {pending_requests_count}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {/* Contenido según tab activo */}
          {active_tab === "profile" ? (
            <>
              {/* Profile Section */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
                <div className="flex space-x-4">
                  <LogoutButton>Cerrar sesión</LogoutButton>
                  <button
                    onClick={() => set_show_profile_form(!show_profile_form)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {show_profile_form ? "Ver perfil" : "Editar perfil"}
                  </button>
                </div>
              </div>

              {show_profile_form ? (
                <ProfileForm
                  on_save={() => set_show_profile_form(false)}
                  on_cancel={() => set_show_profile_form(false)}
                />
              ) : (
                <ProfileDisplay />
              )}
            </>
          ) : (
            <RequestsTab />
          )}

          {/* Quick Actions - Solo se muestra en el tab de perfil */}
          {active_tab === "profile" && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/map"
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">📍</span>
                    <h4 className="font-medium text-gray-900">Ver Canchas</h4>
                    <p className="text-sm text-gray-600">
                      Explorá canchas cercanas
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => set_active_tab("requests")}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer text-left w-full"
                >
                  <div className="text-center relative">
                    <span className="text-3xl mb-2 block">📋</span>
                    {pending_requests_count > 0 && (
                      <span className="absolute top-0 right-1/4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-yellow-500 rounded-full">
                        {pending_requests_count}
                      </span>
                    )}
                    <h4 className="font-medium text-gray-900">
                      Mis Solicitudes
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ver estado de tus solicitudes
                    </p>
                  </div>
                </button>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">⚽</span>
                    <h4 className="font-medium text-gray-900">Mis Partidos</h4>
                    <p className="text-sm text-gray-600">Próximamente</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
