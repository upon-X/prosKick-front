// Tipos para la API de Georef Argentina
export interface Provincia {
  id: string;
  nombre: string;
}

export interface Municipio {
  id: string;
  nombre: string;
  provincia: {
    id: string;
    nombre: string;
  };
}

export interface Localidad {
  id: string;
  nombre: string;
  provincia: {
    id: string;
    nombre: string;
  };
  municipio?: {
    id: string;
    nombre: string;
  };
}

export interface Calle {
  id: string;
  nombre: string;
  provincia: {
    id: string;
    nombre: string;
  };
  municipio?: {
    id: string;
    nombre: string;
  };
}

// Respuestas de la API
export interface GeorefResponse<T> {
  cantidad: number;
  total: number;
  inicio: number;
  parametros: Record<string, string | number>;
  [key: string]: T[] | number | Record<string, string | number>;
}

export interface ProvinciasResponse extends GeorefResponse<Provincia> {
  provincias: Provincia[];
}

export interface MunicipiosResponse extends GeorefResponse<Municipio> {
  municipios: Municipio[];
}

export interface LocalidadesResponse extends GeorefResponse<Localidad> {
  localidades: Localidad[];
}

export interface CallesResponse extends GeorefResponse<Calle> {
  calles: Calle[];
}

export interface Direccion {
  id: string;
  nombre: string;
  ubicacion: {
    lat: number;
    lon: number;
  };
  provincia: {
    id: string;
    nombre: string;
  };
  municipio?: {
    id: string;
    nombre: string;
  };
}

export interface DireccionesResponse extends GeorefResponse<Direccion> {
  direcciones: Direccion[];
}

// Estado del formulario de ubicación
export interface LocationFormData {
  provincia: string;
  municipio: string; // Ciudad
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Datos del teléfono con código de país
export interface PhoneData {
  countryCode: string;
  phoneNumber: string;
}

// Datos del formulario de organizador
export interface OrganizerFormData {
  name: string;
  email: string;
  phone: PhoneData;
  location: LocationFormData;
  image: string;
  user_id: string;
}

// Tipos para la API de solicitudes de organizadores
export interface OrganizerRequest {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  location: {
    country: "AR";
    province: string;
    city: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  image?: string;
  user_id?: string;
  reviewed_by?: {
    id: string;
    name: string;
  };
  reviewed_at?: string;
  status: "pending_review" | "approved" | "rejected" | "pending_fix";
  rejection_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizerRequestResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    status: string;
    created_at: string;
  };
  errors?: Array<{
    path: string[];
    message: string;
  }>;
}

export interface PaginatedOrganizerRequests {
  data: OrganizerRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
