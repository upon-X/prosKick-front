"use client";

import React from "react";
import { useAuth } from "@/context/auth.context";
import { AvatarImage } from "../common/AvatarImage";

export const ProfileDisplay: React.FC = () => {
  const { user, player_profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !player_profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No hay datos de perfil disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <AvatarImage
          avatar_url={user.avatar_url || ""}
          name={user.name || ""}
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {player_profile.name}
          </h2>
          <p className="text-gray-600">@{player_profile.handle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información básica
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">
                {user.email || "No disponible"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
              <dd className="text-sm text-gray-900">
                {player_profile.location.city},{" "}
                {player_profile.location.province}
              </dd>
            </div>
            {player_profile.foot && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Pie hábil</dt>
                <dd className="text-sm text-gray-900">
                  {player_profile.foot === "right"
                    ? "Derecho"
                    : player_profile.foot === "left"
                    ? "Izquierdo"
                    : "Ambos"}
                </dd>
              </div>
            )}
            {player_profile.position && player_profile.position.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Posición</dt>
                <dd className="text-sm text-gray-900">
                  {player_profile.position.join(", ")}
                </dd>
              </div>
            )}
            {player_profile.height_cm && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Altura</dt>
                <dd className="text-sm text-gray-900">
                  {player_profile.height_cm} cm
                </dd>
              </div>
            )}
            {player_profile.weight_kg && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Peso</dt>
                <dd className="text-sm text-gray-900">
                  {player_profile.weight_kg} kg
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Estadísticas */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Estadísticas
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">ELO</dt>
              <dd className="text-sm text-gray-900 font-mono">
                {player_profile.elo}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Reputación</dt>
              <dd className="text-sm text-gray-900">
                {player_profile.rep_score}/100
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Partidos jugados
              </dt>
              <dd className="text-sm text-gray-900">
                {player_profile.stats.games.total}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="text-center">
                <dt className="text-xs font-medium text-green-600">
                  Victorias
                </dt>
                <dd className="text-sm font-bold text-green-600">
                  {player_profile.stats.games.wins}
                </dd>
              </div>
              <div className="text-center">
                <dt className="text-xs font-medium text-red-600">Derrotas</dt>
                <dd className="text-sm font-bold text-red-600">
                  {player_profile.stats.games.loses}
                </dd>
              </div>
              <div className="text-center">
                <dt className="text-xs font-medium text-yellow-600">Empates</dt>
                <dd className="text-sm font-bold text-yellow-600">
                  {player_profile.stats.games.draws}
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Goles</dt>
              <dd className="text-sm text-gray-900">
                {player_profile.stats.goals}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Asistencias</dt>
              <dd className="text-sm text-gray-900">
                {player_profile.stats.assists}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">MVPs</dt>
              <dd className="text-sm text-gray-900">
                {player_profile.stats.mvps}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Tarjetas amarillas
              </dt>
              <dd className="text-sm text-gray-900">
                {player_profile.stats.cards_y}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Tarjetas rojas
              </dt>
              <dd className="text-sm text-gray-900">
                {player_profile.stats.cards_r}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Información de cuenta */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Información de cuenta
        </h3>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Plan</dt>
            <dd className="text-sm text-gray-900">
              {user.subscription?.plan === "free"
                ? "Gratuito"
                : user.subscription?.plan === "pro"
                ? "Pro"
                : user.subscription?.plan === "organizer_pro"
                ? "Organizer Pro"
                : "Gratuito"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Equipos permitidos
            </dt>
            <dd className="text-sm text-gray-900">
              {user.subscription?.seats_teams || 1}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Sedes permitidas
            </dt>
            <dd className="text-sm text-gray-900">
              {user.subscription?.venues_limit === "unlimited"
                ? "Ilimitadas"
                : user.subscription?.venues_limit || 10}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Miembro desde</dt>
            <dd className="text-sm text-gray-900">
              {new Date(user.created_at).toLocaleDateString("es-AR")}
            </dd>
          </div>
          {user.last_login_at && (
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Último acceso
              </dt>
              <dd className="text-sm text-gray-900">
                {new Date(user.last_login_at).toLocaleDateString("es-AR")}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};
