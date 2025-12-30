"use client";

import { ICancha } from "@/types/canchas";
import LateralCardContent from "./LateralCardContent";

interface LateralCardDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  cancha?: ICancha;
  onCenterMap?: (lat: number, lng: number) => void;
}

export default function LateralCardDesktop({
  isOpen,
  onClose,
  title,
  cancha,
  onCenterMap,
}: LateralCardDesktopProps) {
  // Solo mostrar la card si está abierta Y hay datos de cancha
  if (!isOpen || !cancha) return null;

  return (
    <div
      className={`w-80 h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <LateralCardContent cancha={cancha} onCenterMap={onCenterMap} />
    </div>
  );
}
