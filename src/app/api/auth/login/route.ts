import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:4040";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id_token) {
      return NextResponse.json(
        { success: false, error: "ID token es requerido" },
        { status: 400 }
      );
    }

    // Enviar al backend con header X-Device-Type: 'web'
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-Type": "web", // Identificar como web para recibir cookies
      },
      body: JSON.stringify({ id_token: body.id_token }),
      credentials: "include", // Importante para recibir/enviar cookies
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Error en autenticación" },
        { status: response.status }
      );
    }

    // Validar que la respuesta tenga la estructura esperada
    if (
      !data.success ||
      !data.data ||
      !data.data.user ||
      !data.data.player_profile
    ) {
      console.error("Respuesta del backend inválida:", data);
      return NextResponse.json(
        { success: false, error: "Respuesta del servidor inválida" },
        { status: 500 }
      );
    }

    // Extraer los datos del wrapper del backend
    const response_data = {
      user: data.data.user,
      player_profile: data.data.player_profile,
      is_new_user: data.data.is_new_user,
    };

    // Crear el response para el cliente
    const next_response = NextResponse.json(response_data);

    // Propagar cookies del backend al cliente
    const set_cookie_headers = response.headers.getSetCookie();
    if (set_cookie_headers && set_cookie_headers.length > 0) {
      set_cookie_headers.forEach((cookie) => {
        next_response.headers.append("Set-Cookie", cookie);
      });
    }

    return next_response;
  } catch (error) {
    console.error("Error en API route login:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
