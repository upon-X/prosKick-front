import { ICancha, TipoCancha } from "../../types/canchas";

// Configuración del mapa
export const MAP_CONFIG = {
  defaultCenter: {
    lat: -31.6333, // Santa Fe, Argentina
    lng: -60.7000,
  },
  defaultZoom: 13,
  minZoom: 10,
  maxZoom: 18,
} as const;

// Configuración de los marcadores por tipo de cancha
export const MARKER_CONFIG = {
  organizador: {
    color: "#3B82F6", // Azul
    icon: "🏟️",
    size: 40,
  },
  equipo_primera: {
    color: "#10B981", // Verde
    icon: "⚽",
    size: 40,
  },
} as const;

// Configuración de popup/tooltip
export const POPUP_CONFIG = {
  maxWidth: 300,
  className: "custom-popup",
  closeButton: true,
  autoClose: false,
  closeOnClick: false,
} as const;

// Configuración de cluster
export const CLUSTER_CONFIG = {
  maxClusterRadius: 50,
  disableClusteringAtZoom: 15,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
} as const;

// Función para obtener el color del marcador según el tipo
export const getMarkerColor = (tipo: TipoCancha): string => {
  return MARKER_CONFIG[tipo as keyof typeof MARKER_CONFIG].color;
};

// Función para obtener el icono del marcador según el tipo
export const getMarkerIcon = (tipo: TipoCancha): string => {
  return MARKER_CONFIG[tipo as keyof typeof MARKER_CONFIG].icon;
};

// Función para obtener el tamaño del marcador según el tipo
export const getMarkerSize = (tipo: TipoCancha): number => {
  return MARKER_CONFIG[tipo as keyof typeof MARKER_CONFIG].size;
};

// Función para formatear la reputación
export const formatReputacion = (reputacion: number): string => {
  return `${reputacion}/100`;
};

// Función para obtener el color de la reputación
export const getReputacionColor = (reputacion: number): string => {
  if (reputacion >= 80) return "#10B981"; // Verde
  if (reputacion >= 60) return "#F59E0B"; // Amarillo
  if (reputacion >= 40) return "#EF4444"; // Rojo
  return "#6B7280"; // Gris
};

// Función para generar el contenido del popup
export const generatePopupContent = (cancha: ICancha): string => {
  const reputacionColor = getReputacionColor(cancha.reputacion);
  const tipoIcon = getMarkerIcon(cancha.tipo);
  
  return `
    <div class="popup-content">
      <div class="popup-header">
        <span class="popup-icon">${tipoIcon}</span>
        <h3 class="popup-title">${cancha.name}</h3>
      </div>
      <div class="popup-body">
        ${cancha.description ? `<p class="popup-description">${cancha.description}</p>` : ''}
        ${cancha.address ? `<p class="popup-address">📍 ${cancha.address}</p>` : ''}
        ${cancha.phone ? `<p class="popup-phone">📞 ${cancha.phone}</p>` : ''}
        <div class="popup-reputacion">
          <span class="popup-reputacion-label">Reputación:</span>
          <span class="popup-reputacion-value" style="color: ${reputacionColor}">
            ${formatReputacion(cancha.reputacion)}
          </span>
        </div>
        ${cancha.organizador ? `<p class="popup-organizador">👤 ${cancha.organizador}</p>` : ''}
        ${cancha.equipo ? `<p class="popup-equipo">🏆 ${cancha.equipo}</p>` : ''}
      </div>
    </div>
  `;
};
