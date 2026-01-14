import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/config";

export async function PATCH(request: NextRequest) {
  try {
    // Obtener cookies del request
    const access_token = request.cookies.get("access_token")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (access_token) {
      headers["Authorization"] = `Bearer ${access_token}`;
    }

    const cookie_header = request.cookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    if (cookie_header) {
      headers["Cookie"] = cookie_header;
    }

    const body = await request.json();

    // Enviar al backend
    const response = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Error actualizando perfil" },
        { status: response.status }
      );
    }

    // Validar que la respuesta tenga la estructura esperada
    if (!data.success || !data.data || !data.data.player_profile) {
      console.error("Respuesta del backend inválida:", data);
      return NextResponse.json(
        { success: false, error: "Respuesta del servidor inválida" },
        { status: 500 }
      );
    }

    // Extraer los datos del wrapper del backend
    const response_data = data.data.player_profile;

    return NextResponse.json(response_data);
  } catch (error) {
    console.error("Error en API route profile:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
