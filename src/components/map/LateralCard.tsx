"use client";

import { useScreenSize } from "@/hooks/useScreenSize";
import LateralCardMobile from "./LateralCardMobile";
import LateralCardDesktop from "./LateralCardDesktop";
import { ICancha } from "@/types/canchas";

interface LateralCardProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  cancha?: ICancha;
  onCenterMap?: (lat: number, lng: number) => void;
}

export default function LateralCard({
  isOpen,
  onClose,
  title,
  cancha,
  onCenterMap,
}: LateralCardProps) {
  const { isMobile, isDesktop } = useScreenSize();

  // Renderizar el componente apropiado según el dispositivo
  if (isMobile) {
    return (
      <LateralCardMobile
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        cancha={cancha}
        onCenterMap={onCenterMap}
      />
    );
  }

  if (isDesktop) {
    return (
      <LateralCardDesktop
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        cancha={cancha}
        onCenterMap={onCenterMap}
      />
    );
  }

  // Fallback: no renderizar nada si no se puede determinar el dispositivo
  return null;
}
