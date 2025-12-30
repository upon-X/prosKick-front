import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:4040';

export async function PATCH(request: NextRequest) {
  try {
    const auth_header = request.headers.get('authorization');
    
    if (!auth_header) {
      return NextResponse.json(
        { success: false, error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Enviar al backend
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth_header,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Error actualizando perfil' },
        { status: response.status }
      );
    }

    // Validar que la respuesta tenga la estructura esperada
    if (!data.success || !data.data || !data.data.player_profile) {
      console.error('Respuesta del backend inválida:', data);
      return NextResponse.json(
        { success: false, error: 'Respuesta del servidor inválida' },
        { status: 500 }
      );
    }

    // Extraer los datos del wrapper del backend
    const response_data = data.data.player_profile;

    return NextResponse.json(response_data);
  } catch (error) {
    console.error('Error en API route profile:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

