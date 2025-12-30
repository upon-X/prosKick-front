import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/config";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de solicitud requerido",
        },
        { status: 400 }
      );
    }

    // Validar datos requeridos
    if (!body.status) {
      return NextResponse.json(
        {
          success: false,
          message: "Estado requerido",
        },
        { status: 400 }
      );
    }

    // Llamar al backend
    const response = await fetch(
      `${BACKEND_URL}/organizer-requests/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Aquí agregarías el token de autenticación cuando esté implementado
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Error al actualizar la solicitud",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error en API route PATCH estado organizador:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
