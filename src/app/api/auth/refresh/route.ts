import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/config";

export async function POST(request: NextRequest) {
  try {
    // Obtener cookies de la request para enviarlas al backend
    const cookie_header = request.headers.get("cookie");

    // Llamar al backend manteniendo las cookies
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie_header && { Cookie: cookie_header }),
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Error refrescando tokens",
          should_logout: data.should_logout || false,
        },
        { status: response.status }
      );
    }

    // Crear response
    const next_response = NextResponse.json({
      success: true,
      message: data.message || "Tokens refrescados exitosamente",
    });

    // Propagar cookies actualizadas del backend al cliente
    const set_cookie_headers = response.headers.getSetCookie();
    if (set_cookie_headers && set_cookie_headers.length > 0) {
      set_cookie_headers.forEach((cookie) => {
        next_response.headers.append("Set-Cookie", cookie);
      });
    }

    return next_response;
  } catch (error) {
    console.error("Error en refresh:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
