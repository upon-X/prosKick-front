import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:4040";

export async function POST(request: NextRequest) {
  try {
    // Obtener cookies de la request para enviarlas al backend
    const cookie_header = request.headers.get("cookie");

    // Llamar al backend manteniendo las cookies
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie_header && { Cookie: cookie_header }),
      },
      credentials: "include",
    });

    const data = await response.json();

    // Crear response
    const next_response = NextResponse.json({
      success: true,
      message: data.message || "Sesión cerrada exitosamente",
    });

    // Propagar limpieza de cookies del backend al cliente
    const set_cookie_headers = response.headers.getSetCookie();
    if (set_cookie_headers && set_cookie_headers.length > 0) {
      set_cookie_headers.forEach((cookie) => {
        next_response.headers.append("Set-Cookie", cookie);
      });
    }

    return next_response;
  } catch (error) {
    console.error("Error en logout:", error);

    // Intentar limpiar cookies del lado del cliente aunque falle el backend
    const next_response = NextResponse.json({
      success: true,
      message: "Sesión cerrada",
    });

    // Limpiar cookies manualmente
    next_response.cookies.delete("accessToken");
    next_response.cookies.delete("refreshToken");

    return next_response;
  }
}
