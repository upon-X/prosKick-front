"use client";

import { useEffect, useState } from "react";

interface MarkerTooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  text: string;
  onClose: () => void;
}

export default function MarkerTooltip({
  isVisible,
  position,
  text,
  onClose,
}: MarkerTooltipProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldShow(true);
      // Auto-hide después de 3 segundos
      const timer = setTimeout(() => {
        setShouldShow(false);
        setTimeout(onClose, 300); // Esperar a que termine la animación
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShouldShow(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !shouldShow) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 80}px`, // 60px arriba del marker
        transform: 'translateX(-50%)', // Centrar horizontalmente
      }}
    >
      {/* Tooltip */}
      <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200">
        {text}
        {/* Flecha que apunta al marker */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
