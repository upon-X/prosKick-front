"use client";

import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useScreenSize } from "@/hooks/useScreenSize";
import { ICancha } from "@/types/canchas";
import LateralCard from "./LateralCard";
import MarkerTooltip from "./MarkerTooltip";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Función para obtener el color del marker según reputación y tipo
const getMarkerColor = (cancha: ICancha): string => {
  // Equipos de primera siempre violetas
  if (cancha.tipo === "equipo_primera") {
    return "#8E44AD"; // Violeta
  }

  // Organizadores según reputación (Opción 1 - Verde → Rojo)
  if (cancha.reputacion >= 80) return "#2ECC71"; // Verde lima - Excelente
  if (cancha.reputacion >= 60) return "#27AE60"; // Verde - Muy bueno
  if (cancha.reputacion >= 40) return "#F1C40F"; // Amarillo - Normal
  if (cancha.reputacion >= 20) return "#E67E22"; // Naranja - Malo
  return "#C0392B"; // Rojo oscuro - Muy malo
};

// Tamaño base de los markers (en píxeles)
const MARKER_BASE_SIZE = 30; // Aumentado de 20 a 30 (50% más grande)

// Función para obtener el tamaño del marker según reputación y tipo
const getMarkerSize = (cancha: ICancha): number => {
  // Equipos de primera siempre grandes
  if (cancha.tipo === "equipo_primera") {
    return 1.2; // 20% más grande que el base
  }

  // Organizadores según reputación
  if (cancha.reputacion >= 80) return 1.2; // Tamaño normal
  if (cancha.reputacion >= 60) return 1.1; // 10% más chico
  if (cancha.reputacion >= 40) return 1.0; // 20% más chico
  if (cancha.reputacion >= 20) return 0.9; // 30% más chico
  return 0.6; // 40% más chico
};

// Función para obtener la opacidad del marker según reputación
const getMarkerOpacity = (cancha: ICancha): number => {
  // Equipos de primera siempre opacos
  if (cancha.tipo === "equipo_primera") {
    return 1.0;
  }

  // Organizadores según reputación
  if (cancha.reputacion >= 60) return 1.0; // Opaco
  if (cancha.reputacion >= 40) return 0.8; // 80% opacidad
  if (cancha.reputacion >= 20) return 0.6; // 60% opacidad
  return 0.4; // 40% opacidad
};

// Usar el tipo estándar de MapLibre

type Suggestion = {
  label: string;
  lat: number;
  lng: number;
  isCancha?: boolean;
  cancha?: ICancha;
};

type GeorefDireccion = {
  calle?: { nombre: string };
  altura?: { valor: string };
  localidad?: { nombre: string };
  departamento?: { nombre: string };
  provincia?: { nombre: string };
  ubicacion?: { lat: string; lon: string };
};

type GeorefLocalidad = {
  nombre: string;
  departamento?: { nombre: string };
  provincia?: { nombre: string };
  centroide?: { lat: string; lon: string };
};

interface MapaCanchasProps {
  canchas: ICancha[];
  mapTilerKey?: string;
}

export default function MapaCanchas({
  canchas,
  mapTilerKey,
}: MapaCanchasProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [query, setQuery] = useState("");
  const { isMobile, isDesktop } = useScreenSize();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedCancha, setSelectedCancha] = useState<ICancha | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [tooltip, setTooltip] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
    text: string;
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    text: "",
  });

  // Opciones de geolocalización memoizadas para evitar recreación
  const geolocationOptions = useMemo(
    () => ({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutos
    }),
    []
  );

  // Hook de geolocalización
  const {
    latitude,
    longitude,
    loading: geolocationLoading,
  } = useGeolocation(geolocationOptions);

  // Inicializar el mapa cuando tengamos las coordenadas
  useEffect(() => {
    if (map.current || geolocationLoading || !latitude || !longitude) return;

    const mapStyle = `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`;
    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: mapStyle,
      center: [longitude, latitude], // Usar ubicación del usuario o CABA como fallback
      zoom: 10,
      locale: "es",
    });

    // Agregar controles
    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "bottom-right"
    );

    // Esperar a que el mapa esté completamente cargado
    map.current.on("load", () => {
      setMapLoaded(true);
      console.log("Mapa cargado completamente");
    });

    return () => {
      // Limpiar marcadores
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapTilerKey, latitude, longitude, geolocationLoading]);

  // Memoizar las canchas para evitar recreación innecesaria
  const memoizedCanchas = useMemo(() => canchas, [canchas]);

  // Referencia para almacenar los marcadores y poder limpiarlos
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Crear nuevos marcadores
    memoizedCanchas.forEach((cancha) => {
      const color = getMarkerColor(cancha);
      const size = getMarkerSize(cancha);
      const opacity = getMarkerOpacity(cancha);

      // Crear elemento HTML personalizado para el marker
      const markerElement = document.createElement("div");
      const markerSize = MARKER_BASE_SIZE * size;
      markerElement.style.width = `${markerSize}px`;
      markerElement.style.height = `${markerSize}px`;
      markerElement.style.borderRadius = "50%";
      markerElement.style.backgroundColor = color;
      markerElement.style.border =
        cancha.tipo === "equipo_primera"
          ? "none" // Sin borde para equipos de primera
          : "2px solid #ffffff";
      markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      markerElement.style.opacity = opacity.toString();
      markerElement.style.cursor = "pointer";
      markerElement.style.display = "flex";
      markerElement.style.alignItems = "center";
      markerElement.style.justifyContent = "center";
      markerElement.style.fontSize = `${Math.max(12, markerSize * 0.4)}px`; // Tamaño de fuente proporcional
      markerElement.style.fontWeight = "bold";
      markerElement.style.color = "#ffffff";
      markerElement.style.textShadow = "1px 1px 2px rgba(0,0,0,0.7)";

      // Agregar emoji según el tipo
      markerElement.textContent =
        cancha.tipo === "equipo_primera" ? "⚽" : "🏟️";

      const marker = new maplibregl.Marker({
        element: markerElement,
      })
        .setLngLat([cancha.lng, cancha.lat])
        .addTo(map.current!);

      // Agregar evento de click al marcador (optimizado)
      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation(); // Evitar propagación de eventos

        // Ocultar tooltip inmediatamente para evitar conflictos
        setTooltip((prev) => ({ ...prev, isVisible: false }));

        // Abrir la card lateral PRIMERO (más rápido)
        setSelectedCancha(cancha);
        setIsModalOpen(true);

        // FlyTo después (no bloquea la UI)
        if (map.current) {
          map.current.flyTo({
            center: [cancha.lng, cancha.lat],
            zoom: 16,
            duration: 600, // Reducido para mejor rendimiento
            essential: true, // Esta animación es esencial
          });
        }
      });

      // Agregar evento de hover al marcador
      const showTooltip = () => {
        if (map.current) {
          const point = map.current.project([cancha.lng, cancha.lat]);
          const mapContainer = map.current.getContainer();
          const rect = mapContainer.getBoundingClientRect();

          const tooltipText =
            cancha.tipo === "equipo_primera"
              ? `⚽ ${cancha.name} (${cancha.equipo})`
              : `${cancha.name}`;
          // Calcular el tamaño del marker para posicionar el tooltip arriba
          const markerSize = MARKER_BASE_SIZE * getMarkerSize(cancha);
          const tooltipOffset = markerSize / 2 - 40;

          setTooltip({
            isVisible: true,
            position: {
              x: point.x + rect.left,
              y: point.y + rect.top - tooltipOffset, // Posicionar arriba del marker
            },
            text: tooltipText,
          });
        }
      };

      marker.getElement().addEventListener("mouseenter", showTooltip);
      marker.getElement().addEventListener("mouseleave", () => {
        setTooltip((prev) => ({ ...prev, isVisible: false }));
      });

      // Actualizar posición del tooltip cuando el mapa se mueve
      if (map.current) {
        const updateTooltipPosition = () => {
          if (
            tooltip.isVisible &&
            (tooltip.text.includes(cancha.name) || tooltip.text === cancha.name)
          ) {
            const point = map.current!.project([cancha.lng, cancha.lat]);
            const mapContainer = map.current!.getContainer();
            const rect = mapContainer.getBoundingClientRect();

            // Calcular el tamaño del marker para posicionar el tooltip arriba
            const markerSize = MARKER_BASE_SIZE * getMarkerSize(cancha);
            const tooltipOffset = markerSize / 2 - 40;

            setTooltip((prev) => ({
              ...prev,
              position: {
                x: point.x + rect.left,
                y: point.y + rect.top - tooltipOffset, // Posicionar arriba del marker
              },
            }));
          }
        };

        map.current.on("move", updateTooltipPosition);
      }

      // Agregar cursor pointer
      marker.getElement().style.cursor = "pointer";

      markersRef.current.push(marker);
    });
  }, [mapLoaded, memoizedCanchas, tooltip.isVisible, tooltip.text]);

  // Búsqueda de direcciones y canchas
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      // Si no hay query pero el input está enfocado, mostrar las primeras 3 canchas
      if ((!query || query.length === 0) && isInputFocused) {
        const canchasFiltered = memoizedCanchas
          .slice(0, 3) // Primeras 3 canchas
          .map((cancha) => ({
            label: `🏟️ ${cancha.name}${
              cancha.address ? ` - ${cancha.address}` : ""
            }`,
            lat: cancha.lat,
            lng: cancha.lng,
            isCancha: true,
            cancha: cancha,
          }));
        setSuggestions(canchasFiltered);
        return;
      }

      // Si no hay query o es muy corta, limpiar sugerencias
      if (!query || query.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);

      try {
        // 1) Buscar canchas que coincidan con la query
        const canchasFiltered = memoizedCanchas
          .filter(
            (cancha) =>
              cancha.name.toLowerCase().includes(query.toLowerCase()) ||
              (cancha.address &&
                cancha.address.toLowerCase().includes(query.toLowerCase()))
          )
          .slice(0, 3) // Máximo 3 canchas
          .map((cancha) => ({
            label: `🏟️ ${cancha.name}${
              cancha.address ? ` - ${cancha.address}` : ""
            }`,
            lat: cancha.lat,
            lng: cancha.lng,
            isCancha: true,
            cancha: cancha,
          }));

        // 2) Direcciones completas (calle + altura) dentro de AR
        const urlDir = `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${encodeURIComponent(
          query
        )}&max=5`;
        // 3) Localidades/barrios/ciudades
        const urlLoc = `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(
          query
        )}&max=5`;

        const [responseDir, responseLoc] = await Promise.all([
          fetch(urlDir).catch(() => ({
            json: () => Promise.resolve({ direcciones: [] }),
          })),
          fetch(urlLoc).catch(() => ({
            json: () => Promise.resolve({ localidades: [] }),
          })),
        ]);

        const dataDir = await responseDir.json();
        const dataLoc = await responseLoc.json();

        const suggestionsDir = (dataDir?.direcciones ?? [])
          .filter((x: GeorefDireccion) => x.ubicacion?.lat && x.ubicacion?.lon)
          .map((x: GeorefDireccion) => ({
            label: `📍 ${x.calle?.nombre ?? ""} ${x.altura?.valor ?? ""}, ${
              x.localidad?.nombre ?? x.departamento?.nombre ?? ""
            }, ${x.provincia?.nombre ?? "Argentina"}`.replace(/\s+,/g, ","),
            lat: Number(x.ubicacion!.lat),
            lng: Number(x.ubicacion!.lon),
            isCancha: false,
          }));

        const suggestionsLoc = (dataLoc?.localidades ?? [])
          .filter((x: GeorefLocalidad) => x.centroide?.lat && x.centroide?.lon)
          .map((x: GeorefLocalidad) => ({
            label: `🏙️ ${x.nombre}, ${x.departamento?.nombre ?? ""}, ${
              x.provincia?.nombre ?? ""
            }`.replace(/\s+,/g, ","),
            lat: Number(x.centroide!.lat),
            lng: Number(x.centroide!.lon),
            isCancha: false,
          }));

        // Combinar todos los resultados, priorizando canchas
        setSuggestions([
          ...canchasFiltered,
          ...suggestionsDir,
          ...suggestionsLoc,
        ]);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [query, memoizedCanchas, isInputFocused]);

  // Al elegir sugerencia: centrar y marcar
  const goTo = useCallback((suggestion: Suggestion) => {
    if (map.current) {
      // Usar flyTo con opciones optimizadas para mejor rendimiento
      map.current.flyTo({
        center: [suggestion.lng, suggestion.lat],
        zoom: suggestion.isCancha ? 16 : 14, // Zoom más cercano para canchas
        duration: 1000,
        essential: true, // Esta animación es esencial y no se puede deshabilitar
      });
    }

    // Si es una cancha, abrir el modal
    if (suggestion.isCancha && suggestion.cancha) {
      setSelectedCancha(suggestion.cancha);
      setIsModalOpen(true);
    }

    setSuggestions([]);
    setQuery(suggestion.label);
  }, []);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setIsInputFocused(false);
  }, []);

  // Mostrar indicador de carga mientras se obtiene la ubicación
  if (geolocationLoading) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100"
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Obteniendo tu ubicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-screen flex"
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Card lateral - se adapta automáticamente a mobile/desktop */}
      <LateralCard
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCancha(null);
        }}
        title={selectedCancha?.name}
        cancha={selectedCancha || undefined}
        onCenterMap={(lat, lng) => {
          if (map.current) {
            map.current.flyTo({
              center: [lng, lat],
              zoom: 16,
              duration: 1000,
              essential: true,
            });
          }
        }}
      />

      {/* Contenedor del mapa */}
      <div
        className={`relative flex-1 transition-all duration-300 ${
          isModalOpen && isDesktop ? "ml-64" : ""
        }`}
        style={{
          height: isModalOpen && isMobile ? "50vh" : "100vh",
        }}
      >
        {/* Caja de búsqueda */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[min(640px,90vw)]">
          <div className="relative">
            <input
              className="w-full rounded-xl px-4 py-3 pr-10 shadow-lg bg-white/95 text-gray-900 border border-gray-200 focus:ring-2 focus:border-transparent"
              placeholder="Buscar canchas, direcciones o ciudades…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {
                // Delay para permitir que el click en las sugerencias funcione
                setTimeout(() => setIsInputFocused(false), 200);
              }}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
              >
                ✕
              </button>
            )}
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 text-gray-900"></div>
              </div>
            )}
          </div>

          {/* Sugerencias */}
          {suggestions.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-lg max-h-72 overflow-auto border border-gray-200 text-gray-900">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
                  onClick={() => goTo(suggestion)}
                >
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">
                      {suggestion.isCancha
                        ? "🏟️"
                        : suggestion.label.includes("🏙️")
                        ? "🏙️"
                        : "📍"}
                    </span>
                    <span className="text-gray-900">
                      {suggestion.label.replace(/^[🏟️🏙️📍]\s*/, "")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Mapa */}
        <Link
          href="/"
          className="absolute top-5 right-5 z-10 text-sm text-gray-500 hover:text-gray-900
          bg-white/95 px-4 py-2 rounded-md shadow-lg flex items-center gap-2
          "
          rel="noopener noreferrer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <div
          ref={mapContainer}
          className="w-full h-full"
          style={{
            height: "100%",
            width: "100%",
          }}
        />
        {/* Tooltip del marker */}
        <MarkerTooltip
          isVisible={tooltip.isVisible}
          position={tooltip.position}
          text={tooltip.text}
          onClose={() => setTooltip((prev) => ({ ...prev, isVisible: false }))}
        />
      </div>
    </div>
  );
}
