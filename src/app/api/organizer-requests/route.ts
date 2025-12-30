import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación básica en el frontend (el backend ya valida con Zod)
    if (!body.name || !body.email || !body.phone || !body.location) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos requeridos faltantes",
        },
        { status: 400 }
      );
    }

    // Validar que el user_id esté presente
    if (!body.user_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Debes iniciar sesión para enviar una solicitud",
        },
        { status: 401 }
      );
    }

    // Transformar datos del frontend al formato del backend
    const requestData = {
      name: body.name,
      email: body.email, // Email del usuario logueado (viene del frontend)
      phone_number: `${body.phone.countryCode}${body.phone.phoneNumber}`, // Ahora countryCode es numérico (54, 55, etc.)
      location: {
        country: "AR" as const,
        province: body.location.provincia,
        city: body.location.municipio,
        address: body.location.address,
        coordinates: body.location.coordinates,
      },
      image: body.image,
      user_id: body.user_id, // Incluir user_id del usuario autenticado
    };

    // Llamar al backend
    const response = await fetch(`${BACKEND_URL}/organizer-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Error al enviar la solicitud",
          errors: result.errors,
        },
        { status: response.status }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Solicitud enviada correctamente",
      data: result,
    });
  } catch (error: Error | unknown) {
    console.error("Error en API route de organizadores:", error);

    if (
      error instanceof Error &&
      error.message.includes("Datos requeridos faltantes")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos de entrada inválidos",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // Construir query string
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);

    const url = `${BACKEND_URL}/organizer-requests?${queryParams.toString()}`;

    // Llamar al backend
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Aquí agregarías el token de autenticación cuando esté implementado
        // "Authorization": `Bearer ${token}`,
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
    console.error("Error en API route GET organizadores:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
