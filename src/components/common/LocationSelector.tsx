"use client";

import { useEffect, useState } from "react";
import { getProvincias, getMunicipios } from "@/services/georef.services";
import { Provincia, Municipio, LocationFormData } from "@/types/georef";

interface LocationSelectorProps {
  value: LocationFormData;
  onChange: (location: LocationFormData) => void;
  errors?: {
    provincia?: string;
    municipio?: string;
    address?: string;
  };
  required?: boolean;
}

export function LocationSelector({
  value,
  onChange,
  errors = {},
  required = true,
}: LocationSelectorProps) {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState({
    provincias: false,
    municipios: false,
  });

  // Cargar provincias al montar el componente
  useEffect(() => {
    const loadProvincias = async () => {
      setLoading((prev) => ({ ...prev, provincias: true }));
      try {
        const data = await getProvincias();
        setProvincias(data);
      } catch (error) {
        console.error("Error cargando provincias:", error);
      } finally {
        setLoading((prev) => ({ ...prev, provincias: false }));
      }
    };

    loadProvincias();
  }, []);

  // Cargar municipios cuando cambia la provincia
  useEffect(() => {
    if (!value.provincia) {
      setMunicipios([]);
      return;
    }

    const loadMunicipios = async () => {
      setLoading((prev) => ({ ...prev, municipios: true }));
      try {
        const data = await getMunicipios(value.provincia);
        setMunicipios(data);
        // Limpiar selecciones dependientes
        onChange({
          ...value,
          municipio: "",
        });
      } catch (error) {
        console.error("Error cargando municipios:", error);
      } finally {
        setLoading((prev) => ({ ...prev, municipios: false }));
      }
    };

    loadMunicipios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.provincia]);

  // Manejar cambio de dirección
  const handleAddressChange = (address: string) => {
    onChange({ ...value, address });
  };

  return (
    <div className="space-y-4">
      {/* Provincia */}
      <div>
        <select
          value={value.provincia}
          onChange={(e) => onChange({ ...value, provincia: e.target.value })}
          className={`w-full text-gray-600 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.provincia ? "border-red-500" : "border-gray-300"
          }`}
          disabled={loading.provincias}
        >
          <option value="">
            {loading.provincias ? "Cargando..." : "Seleccionar provincia"}
          </option>
          {provincias.map((provincia) => (
            <option key={provincia.id} value={provincia.nombre}>
              {provincia.nombre}
            </option>
          ))}
        </select>
        {errors.provincia && (
          <p className="mt-1 text-sm text-red-600">{errors.provincia}</p>
        )}
      </div>

      {/* Ciudad */}
      {value.provincia && (
        <div>
          <select
            value={value.municipio}
            onChange={(e) => onChange({ ...value, municipio: e.target.value })}
            className={`w-full text-gray-600 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.municipio ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading.municipios}
          >
            <option value="">
              {loading.municipios ? "Cargando..." : "Seleccionar ciudad"}
            </option>
            {municipios.map((municipio) => (
              <option key={municipio.id} value={municipio.nombre}>
                {municipio.nombre}
              </option>
            ))}
          </select>
          {errors.municipio && (
            <p className="mt-1 text-sm text-red-600">{errors.municipio}</p>
          )}
        </div>
      )}

      {/* Dirección */}
      {value.municipio && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={value.address}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Ej: Av. Corrientes 1234"
            className={`w-full text-gray-600 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
      )}
    </div>
  );
}
