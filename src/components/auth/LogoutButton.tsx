'use client';

import React, { useState } from 'react';
import { useAuth } from "@/context/auth.context";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '', 
  children 
}) => {
  const { logout, loading } = useAuth();
  const [is_loading, setIsLoading] = useState(false);

  const handle_logout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error('Error en logout:', error);
      // Aquí podrías mostrar un toast o mensaje de error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handle_logout}
      disabled={loading || is_loading}
      className={`
        inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading || is_loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cerrando sesión...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {children || 'Cerrar sesión'}
        </>
      )}
    </button>
  );
};

