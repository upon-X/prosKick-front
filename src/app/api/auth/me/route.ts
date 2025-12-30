import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:4040';

export async function GET(request: NextRequest) {
  try {
    const auth_header = request.headers.get('authorization');
    
    if (!auth_header) {
      return NextResponse.json(
        { success: false, error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    // Enviar al backend
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': auth_header,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Error obteniendo perfil' },
        { status: response.status }
      );
    }

    // Validar que la respuesta tenga la estructura esperada
    if (!data.success || !data.data || !data.data.user || !data.data.player_profile) {
      console.error('Respuesta del backend inválida:', data);
      return NextResponse.json(
        { success: false, error: 'Respuesta del servidor inválida' },
        { status: 500 }
      );
    }

    // Extraer los datos del wrapper del backend
    const response_data = {
      user: data.data.user,
      player_profile: data.data.player_profile
    };

    return NextResponse.json(response_data);
  } catch (error) {
    console.error('Error en API route me:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

