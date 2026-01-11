import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL, API_SECRET } from "@/app/api/config";

/**
 * API Route para solicitudes de usuario
 * Actúa como proxy al backend, manejando autenticación
 */

/**
 * GET /api/user-requests
 * Obtener las solicitudes del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    // Construir query string según el tipo de solicitud
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    const auth_header = request.headers.get("authorization");

    if (!auth_header) {
      return NextResponse.json(
        { success: false, error: "Token de autorización requerido" },
        { status: 401 }
      );
    }

    // Determinar el endpoint según el tipo
    let endpoint = "";
    switch (type) {
      case "organizer":
        endpoint = `${BACKEND_URL}/organizer-requests/my-requests`;
        break;
      // Futuros tipos:
      // case "field":
      //   endpoint = `${BACKEND_URL}/field-requests/my-requests`;
      //   break;
      default:
        // Por defecto, solicitudes de organizador
        endpoint = `${BACKEND_URL}/organizer-requests/my-requests`;
    }

    const url = `${endpoint}?${queryParams.toString()}`;

    // Llamar al backend con el token de autenticación
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_SECRET}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Error al obtener las solicitudes",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: Error | unknown) {
    console.error("Error en API route de solicitudes de usuario:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
