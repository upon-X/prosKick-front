import {
  Provincia,
  Municipio,
  Localidad,
  Calle,
  ProvinciasResponse,
  MunicipiosResponse,
  LocalidadesResponse,
  CallesResponse,
  DireccionesResponse,
} from "@/types/georef";

const BASE_URL = "https://apis.datos.gob.ar/georef/api";

// Función genérica para hacer requests a la API de Georef
async function georefRequest<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (!response.ok) {
      throw new Error(`Error Georef API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en georefRequest:", error);
    throw new Error("Error al consultar la API de Georef");
  }
}

// Obtener todas las provincias
export async function getProvincias(): Promise<Provincia[]> {
  try {
    const response = await georefRequest<ProvinciasResponse>("/provincias", {
      campos: "id,nombre",
      orden: "nombre",
      max: 50,
    });
    return response.provincias || [];
  } catch (error) {
    console.error("Error obteniendo provincias:", error);
    return [];
  }
}

// Obtener municipios por provincia
export async function getMunicipios(provincia: string): Promise<Municipio[]> {
  if (!provincia) return [];
  
  try {
    const response = await georefRequest<MunicipiosResponse>("/municipios", {
      provincia,
      campos: "id,nombre,provincia",
      orden: "nombre",
      max: 5000,
    });
    return response.municipios || [];
  } catch (error) {
    console.error("Error obteniendo municipios:", error);
    return [];
  }
}

// Obtener localidades por provincia y municipio
export async function getLocalidades(
  provincia: string,
  municipio?: string
): Promise<Localidad[]> {
  if (!provincia) return [];
  
  try {
    const response = await georefRequest<LocalidadesResponse>("/localidades", {
      provincia,
      municipio: municipio || "",
      campos: "id,nombre,provincia,municipio",
      orden: "nombre",
      max: 5000,
    });
    return response.localidades || [];
  } catch (error) {
    console.error("Error obteniendo localidades:", error);
    return [];
  }
}

// Buscar calles por provincia y nombre
export async function searchCalles(
  provincia: string,
  nombre: string,
  limit: number = 30
): Promise<Calle[]> {
  if (!provincia || !nombre) return [];
  
  try {
    const response = await georefRequest<CallesResponse>("/calles", {
      provincia,
      nombre,
      campos: "id,nombre,provincia,departamento",
      orden: "nombre",
      max: limit,
    });
    return response.calles || [];
  } catch (error) {
    console.error("Error buscando calles:", error);
    return [];
  }
}

// Obtener coordenadas de una dirección (geocoding)
export async function getCoordinates(
  provincia: string,
  municipio: string,
  direccion: string
): Promise<{ lat: number; lng: number } | null> {
  if (!provincia || !municipio || !direccion) return null;
  
  try {
    const response = await georefRequest<DireccionesResponse>("/direcciones", {
      provincia,
      municipio,
      direccion,
      max: 1,
    });
    
    if (response.direcciones && response.direcciones.length > 0) {
      const dir = response.direcciones[0];
      return {
        lat: dir.ubicacion.lat,
        lng: dir.ubicacion.lon,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error obteniendo coordenadas:", error);
    return null;
  }
}
