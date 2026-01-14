import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/app/api/config";

export async function GET(request: NextRequest) {
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

    const canchas = await fetch(`${BACKEND_URL}/canchas`, {
      method: "GET",
      headers,
      credentials: "include",
    });
    const data = await canchas.json();
    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error,
        message: "Error al obtener las canchas",
      },
      { status: 500 }
    );
  }
}
