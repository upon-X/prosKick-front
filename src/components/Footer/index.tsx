import { appName } from "@/config";
import Link from "next/link";
import LogoNviem from "../common/LogoNviem";
import { Logo } from "../common/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex text-primary items-center justify-start font-extrabold text-4xl select-none"
            >
              <Logo />
            </Link>
            <p className="text-gray-300 text-sm">
              La plataforma definitiva para organizar y gestionar partidos de
              fútbol. Conecta jugadores, canchas y organizadores en un solo
              lugar.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              <p>
                &copy; {currentYear} {appName}. Todos los derechos reservados.
              </p>
            </div>

            {/* Información de desarrollo */}
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p className="flex items-center justify-center gap-2 whitespace-nowrap">
                Desarrollado por <LogoNviem size="xs" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
