import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/config";

export async function GET(request: NextRequest) {
  try {
    // Obtener cookies de la request
    const access_token = request.cookies.get("access_token")?.value;
    const auth_header = request.headers.get("authorization");

    console.log("GET /api/auth/me", {
      has_access_token_cookie: !!access_token,
      has_auth_header: !!auth_header,
      cookies: request.cookies.getAll().map((c) => c.name),
    });

    // Construir headers para el backend
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Si hay cookie, construir header Authorization con ella
    // Si no, usar el header que viene en la request
    if (access_token) {
      headers["Authorization"] = `Bearer ${access_token}`;
    } else if (auth_header) {
      headers["Authorization"] = auth_header;
    }

    // Construir la cookie string para enviar al backend
    const cookie_header = request.cookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    if (cookie_header) {
      headers["Cookie"] = cookie_header;
    }

    // Enviar al backend con las cookies
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      headers,
      credentials: "include", // Importante para enviar cookies
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Error obteniendo perfil" },
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
    };

    return NextResponse.json(response_data);
  } catch (error) {
    console.error("Error en API route me:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
