import { IUser, IPlayerProfile } from "@/types/auth";

// Tipos para las respuestas de la API
interface LoginResponse {
  user: IUser;
  player_profile: IPlayerProfile;
  is_new_user: boolean;
}

interface UserDataResponse {
  user: IUser;
  player_profile: IPlayerProfile;
}

// Servicio de login con Google
export const login_with_google_service = async (
  id_token: string
): Promise<LoginResponse> => {
  try {
    console.log("Iniciando login con Google");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_token }),
    });

    if (!response.ok) {
      const error_data = await response.json();
      console.error("Error en login con Google:", error_data.message, {
        status: response.status,
        error_data,
      });
      throw new Error(error_data.message || "Error en el login");
    }

    const data = await response.json();

    // Validar que la respuesta tenga la estructura esperada
    if (!data.user || !data.player_profile) {
      console.error("Respuesta del login inválida:", data);
      throw new Error("Respuesta del servidor inválida");
    }

    console.log("Login con Google exitoso", {
      user_id: data.user.id,
      is_new_user: data.is_new_user,
    });

    return data;
  } catch (error) {
    console.error("Error en login_with_google_service:", error);
    throw error;
  }
};

// Servicio para obtener datos del usuario actual
export const get_user_data_service = async (): Promise<UserDataResponse> => {
  try {
    console.log("Obteniendo datos del usuario");

    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // Usar cookies automáticamente
    });

    if (!response.ok) {
      const error_data = await response.json();
      console.error(
        "Error obteniendo datos del usuario:",
        error_data.message || error_data.error,
        {
          status: response.status,
          error_data,
        }
      );
      throw new Error(
        error_data.message ||
          error_data.error ||
          "Error obteniendo datos del usuario"
      );
    }

    const data = await response.json();
    console.log("Datos del usuario obtenidos exitosamente", {
      user_id: data.user?.id,
    });

    return data;
  } catch (error) {
    console.error("Error en get_user_data_service:", error);
    throw error;
  }
};

// Servicio para actualizar perfil
export const update_profile_service = async (
  update_data: Partial<IPlayerProfile>
): Promise<IPlayerProfile> => {
  try {
    console.log("Actualizando perfil del usuario", {
      update_fields: Object.keys(update_data),
    });

    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update_data),
      credentials: "include",
    });

    if (!response.ok) {
      const error_data = await response.json();
      console.error("Error actualizando perfil:", error_data.message || error_data.error, {
        status: response.status,
        error_data,
      });
      throw new Error(error_data.message || error_data.error || "Error actualizando perfil");
    }

    const updated_profile = await response.json();
    console.log("Perfil actualizado exitosamente", {
      profile_id: updated_profile.id,
    });

    return updated_profile;
  } catch (error) {
    console.error("Error en update_profile_service:", error);
    throw error;
  }
};
  }
};
