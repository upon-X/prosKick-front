'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/auth.context";

interface ProfileFormProps {
  on_save?: () => void;
  on_cancel?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  on_save, 
  on_cancel 
}) => {
  const { player_profile, update_profile, loading } = useAuth();
  const [form_data, set_form_data] = useState<{
    name: string;
    handle: string;
    location: {
      province: string;
      city: string;
    };
    foot: string;
    position: string[];
    height_cm: string;
    weight_kg: string;
  }>({
    name: '',
    handle: '',
    location: {
      province: '',
      city: ''
    },
    foot: '',
    position: [] as string[],
    height_cm: '',
    weight_kg: ''
  });
  const [is_loading, setIsLoading] = useState(false);
  const [handle_available, setHandleAvailable] = useState<boolean | null>(null);

  // Cargar datos del perfil
  useEffect(() => {
    if (player_profile) {
      set_form_data({
        name: player_profile.name || '',
        handle: player_profile.handle || '',
        location: {
          province: player_profile.location?.province || '',
          city: player_profile.location?.city || ''
        },
        foot: player_profile.foot || '',
        position: player_profile.position || [],
        height_cm: player_profile.height_cm?.toString() || '',
        weight_kg: player_profile.weight_kg?.toString() || ''
      });
    }
  }, [player_profile]);

  // Verificar disponibilidad del handle
  const check_handle_availability = async (handle: string) => {
    if (handle.length < 3 || handle.length > 20) {
      setHandleAvailable(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/check-handle/${handle}`);
      const data = await response.json();
      setHandleAvailable(data.success ? data.data.available : false);
    } catch (error) {
      console.error('Error verificando handle:', error);
      setHandleAvailable(false);
    }
  };

  // Debounce para verificar handle
  useEffect(() => {
    const timeout_id = setTimeout(() => {
      if (form_data.handle && form_data.handle !== player_profile?.handle) {
        check_handle_availability(form_data.handle);
      } else {
        setHandleAvailable(true);
      }
    }, 500);

    return () => clearTimeout(timeout_id);
  }, [form_data.handle, player_profile?.handle]);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (handle_available === false) {
      return;
    }

    try {
      setIsLoading(true);
      
      const update_data: Record<string, unknown> = {};
      
      if (form_data.name !== player_profile?.name) {
        update_data.name = form_data.name;
      }
      
      if (form_data.handle !== player_profile?.handle) {
        update_data.handle = form_data.handle;
      }
      
      if (form_data.location.province !== player_profile?.location?.province || 
          form_data.location.city !== player_profile?.location?.city) {
        update_data.location = form_data.location;
      }
      
      if (form_data.foot !== player_profile?.foot) {
        update_data.foot = form_data.foot;
      }
      
      if (JSON.stringify(form_data.position) !== JSON.stringify(player_profile?.position)) {
        update_data.position = form_data.position;
      }
      
      if (form_data.height_cm && parseInt(form_data.height_cm) !== player_profile?.height_cm) {
        update_data.height_cm = parseInt(form_data.height_cm);
      }
      
      if (form_data.weight_kg && parseInt(form_data.weight_kg) !== player_profile?.weight_kg) {
        update_data.weight_kg = parseInt(form_data.weight_kg);
      }

      await update_profile(update_data);
      on_save?.();
    } catch (error) {
      console.error('Error actualizando perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handle_position_change = (position: string, checked: boolean) => {
    if (checked) {
      set_form_data(prev => ({
        ...prev,
        position: [...prev.position, position]
      }));
    } else {
      set_form_data(prev => ({
        ...prev,
        position: prev.position.filter(p => p !== position)
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handle_submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            value={form_data.name}
            onChange={(e) => set_form_data(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Handle */}
        <div>
          <label htmlFor="handle" className="block text-sm font-medium text-gray-700">
            Handle
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="handle"
              value={form_data.handle}
              onChange={(e) => set_form_data(prev => ({ ...prev, handle: e.target.value }))}
              className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                handle_available === false ? 'border-red-300' : ''
              }`}
              required
            />
            {handle_available === false && (
              <p className="mt-1 text-sm text-red-600">Handle no disponible</p>
            )}
            {handle_available === true && form_data.handle !== player_profile?.handle && (
              <p className="mt-1 text-sm text-green-600">Handle disponible</p>
            )}
          </div>
        </div>

        {/* Provincia */}
        <div>
          <label htmlFor="province" className="block text-sm font-medium text-gray-700">
            Provincia
          </label>
          <select
            id="province"
            value={form_data.location.province}
            onChange={(e) => set_form_data(prev => ({
              ...prev,
              location: { ...prev.location, province: e.target.value }
            }))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Seleccionar provincia</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Mendoza">Mendoza</option>
            <option value="Tucumán">Tucumán</option>
            <option value="Salta">Salta</option>
            <option value="Entre Ríos">Entre Ríos</option>
            <option value="Misiones">Misiones</option>
            <option value="Corrientes">Corrientes</option>
            <option value="Chaco">Chaco</option>
            <option value="Formosa">Formosa</option>
            <option value="Santiago del Estero">Santiago del Estero</option>
            <option value="Catamarca">Catamarca</option>
            <option value="La Rioja">La Rioja</option>
            <option value="San Juan">San Juan</option>
            <option value="San Luis">San Luis</option>
            <option value="La Pampa">La Pampa</option>
            <option value="Río Negro">Río Negro</option>
            <option value="Neuquén">Neuquén</option>
            <option value="Chubut">Chubut</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="Tierra del Fuego">Tierra del Fuego</option>
          </select>
        </div>

        {/* Ciudad */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <input
            type="text"
            id="city"
            value={form_data.location.city}
            onChange={(e) => set_form_data(prev => ({
              ...prev,
              location: { ...prev.location, city: e.target.value }
            }))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Pie hábil */}
        <div>
          <label htmlFor="foot" className="block text-sm font-medium text-gray-700">
            Pie hábil
          </label>
          <select
            id="foot"
            value={form_data.foot}
            onChange={(e) => set_form_data(prev => ({ ...prev, foot: e.target.value }))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Seleccionar</option>
            <option value="right">Derecho</option>
            <option value="left">Izquierdo</option>
            <option value="both">Ambos</option>
          </select>
        </div>

        {/* Posición */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posición
          </label>
          <div className="space-y-2">
            {['GK', 'DEF', 'MID', 'FWD'].map((pos) => (
              <label key={pos} className="flex items-center">
                <input
                  type="checkbox"
                  checked={form_data.position.includes(pos)}
                  onChange={(e) => handle_position_change(pos, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{pos}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Altura */}
        <div>
          <label htmlFor="height_cm" className="block text-sm font-medium text-gray-700">
            Altura (cm)
          </label>
          <input
            type="number"
            id="height_cm"
            value={form_data.height_cm}
            onChange={(e) => set_form_data(prev => ({ ...prev, height_cm: e.target.value }))}
            min="100"
            max="250"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Peso */}
        <div>
          <label htmlFor="weight_kg" className="block text-sm font-medium text-gray-700">
            Peso (kg)
          </label>
          <input
            type="number"
            id="weight_kg"
            value={form_data.weight_kg}
            onChange={(e) => set_form_data(prev => ({ ...prev, weight_kg: e.target.value }))}
            min="30"
            max="200"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3">
        {on_cancel && (
          <button
            type="button"
            onClick={on_cancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={is_loading || handle_available === false}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {is_loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

