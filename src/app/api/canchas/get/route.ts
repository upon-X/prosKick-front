import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:4040";

export async function GET() {
  try {
    const canchas = await fetch(`${API_URL}/canchas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
