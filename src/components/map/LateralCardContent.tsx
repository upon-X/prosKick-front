"use client";

import { ICancha } from "@/types/canchas";
import Image from "next/image";
import { formatArgentinePhoneNumber } from "@/utils/formatArgentinePhoneNumber";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface LateralCardContentProps {
  cancha: ICancha;
  onCenterMap?: (lat: number, lng: number) => void;
}

export default function LateralCardContent({
  cancha,
  onCenterMap,
}: LateralCardContentProps) {
  const wspUrl = `https://wa.me/+${cancha.phone}`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          {/* Foto placeholder */}
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
            {cancha.image ? (
              <Image
                src={cancha.image}
                alt={cancha.name}
                fill
                className="object-cover aspect-square"
                loading="lazy"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Información de la cancha */}
          <div className="space-y-4 p-3">
            {cancha.description && (
              <p className="text-gray-700 text-md">{cancha.description}</p>
            )}

            {cancha.phone && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                <a
                  href={wspUrl}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {formatArgentinePhoneNumber(cancha.phone)}
                </a>
              </div>
            )}

            {cancha.address && (
              <div
                className="grid grid-cols-[26px_1fr] cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg group"
                onClick={() => {
                  onCenterMap?.(cancha.lat, cancha.lng);
                  navigator.clipboard.writeText(cancha.address || "");
                  toast.success("Dirección copiada al portapapeles");
                }}
              >
                <MapPin className="w-6 h-6 group-hover:animate-pulse" />
                <p className="text-md">{cancha.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción - siempre al final */}
        {cancha.phone && (
          <div className="flex-shrink-0 flex flex-col gap-2 p-3 border-t border-gray-200 bg-white">
            <Link
              href={wspUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary text-white px-4 py-2 rounded-lg text-center hover:bg-primary/80 transition-colors"
            >
              Enviar mensaje
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
