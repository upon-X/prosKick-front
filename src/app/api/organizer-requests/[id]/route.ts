import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de solicitud requerido",
        },
        { status: 400 }
      );
    }

    // Obtener cookies y construir headers
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

    // Llamar al backend
    const response = await fetch(`${BACKEND_URL}/organizer-requests/${id}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Error al obtener la solicitud",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error en API route GET organizador por ID:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
