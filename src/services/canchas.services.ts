import { ICancha } from "../types/canchas";

export const get_canchas_service = async (): Promise<ICancha[]> => {
  try {
    const response = await fetch("/api/canchas/get");
    if (!response.ok) {
      throw new Error("Error al obtener las canchas");
    }
    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error("Error en la respuesta de la API");
    }
  } catch (error) {
    console.error("Error al obtener las canchas", error);
    throw error;
  }
};
