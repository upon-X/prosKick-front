"use client";

import React from "react";
import Link from "next/link";
import { Banner } from "@/components/Banner";
import { Permanent_Marker } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const stats = {
    users: {
      title: "Usuarios registrados",
      value: 89,
    },
    canchas: {
      title: "Canchas registradas",
      value: 100,
    },
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex flex-col items-start justify-center p-4 h-[100dvh] select-none">
        <Banner />
        <div className="flex flex-col items-center justify-center gap-32 z-20 pl-[10vw]">
          <div className="flex flex-row gap-8">
            <span className="text-4xl md:text-6xl text-white/90 font-extrabold text-right leading-17">
              Juga donde
              <br />
              con quien
            </span>
            <span
              className={`text-primary text-[120px] ${permanentMarker.className} leading-30 uppercase`}
            >
              quieras
            </span>
          </div>
          <Link
            href={"/map"}
            className="flex items-center gap-2 text-2xl px-8 py-4 text-white bg-primary/80 hover:bg-primary transition-all duration-150"
          >
            Descubrir
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitás para el fúlbo
            </h3>
            <p className="text-lg text-gray-600">
              Una plataforma completa para jugadores, equipos y organizadores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Gestioná Equipos
              </h4>
              <p className="text-gray-600">
                Creá y administrá tu equipo, invita jugadores y organizá
                entrenamientos
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Encontrá Canchas
              </h4>
              <p className="text-gray-600">
                Descubrí canchas cercanas, reservá horarios y organizá partidos
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚽</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Organizá Partidos
              </h4>
              <p className="text-gray-600">
                Creá partidos, invita equipos y seguí estadísticas en tiempo
                real
              </p>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 relative overflow-hidden">
        {/* Background Pattern (Pelota + Cancha, diagonal, aireado) */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: (() => {
                // 🎨 Ajustes rápidos
                const color = "#00ff66"; // color principal (ProKick)
                const opacity = 0.28; // 0..1
                const stroke = 1.8; // grosor de línea
                const tile = 200; // tamaño del mosaico (px)

                // 📐 Usamos los íconos originales (viewBox 24x24) y los escalamos
                const scale = 2.2; // 24*2.2 ≈ 53px de tamaño visual por icono

                // 🧩 Distribución diagonal (pelota ↘, cancha ↙)
                // Pelota en (24,24); Cancha en (tile-24*scale-24, tile-24*scale-24)
                const pX = 24,
                  pY = 24;
                const cX = tile - 24 * scale - 24;
                const cY = tile - 24 * scale - 24;

                const svg = `
<svg width='${tile}' height='${tile}' viewBox='0 0 ${tile} ${tile}' xmlns='http://www.w3.org/2000/svg'>
  <defs>
    <!-- Símbolo Pelota (paths exactos Tabler) -->
    <symbol id='ball' viewBox='0 0 24 24'>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'/>
      <path d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' />
      <path d='M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55z' />
      <path d='M12 7v-4m3 13l2.5 3m-.74 -8.55l3.74 -1.45m-11.44 7.05l-2.56 2.95m.74 -8.55l-3.74 -1.45' />
    </symbol>

    <!-- Símbolo Cancha (paths exactos Tabler) -->
    <symbol id='field' viewBox='0 0 24 24'>
      <path stroke='none' d='M0 0h24v24H0z' fill='none'/>
      <path d='M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' />
      <path d='M3 9h3v6h-3z' />
      <path d='M18 9h3v6h-3z' />
      <path d='M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z' />
      <path d='M12 5l0 14' />
    </symbol>
  </defs>

  <!-- Rejilla ligera para dar textura (opcional, descomentar si querés)
  <rect x='0' y='0' width='${tile}' height='${tile}' fill='none' stroke='${color}' opacity='0.05' stroke-width='1'/>
  -->

  <!-- Pelota arriba/izquierda -->
  <g transform='translate(${pX} ${pY}) scale(${scale})' fill='none' stroke='${color}' stroke-width='${stroke}'
     stroke-linecap='round' stroke-linejoin='round' opacity='${opacity}'>
    <use href='#ball' />
  </g>

  <!-- Cancha abajo/derecha -->
  <g transform='translate(${cX} ${cY}) scale(${scale}) rotate(-8 12 12)' fill='none' stroke='${color}' stroke-width='${stroke}'
     stroke-linecap='round' stroke-linejoin='round' opacity='${opacity}'>
    <use href='#field' />
  </g>

  <!-- Variantes para romper repetición -->
  <!-- Mini pelota al centro con menos opacidad -->
  <g transform='translate(${tile / 2 - 12} ${
                  tile / 2 - 12
                }) scale(1.2)' fill='none' stroke='${color}' stroke-width='${Math.max(
                  1,
                  stroke - 0.6
                )}'
     stroke-linecap='round' stroke-linejoin='round' opacity='${Math.max(
       0.12,
       opacity - 0.12
     )}'>
    <use href='#ball' />
  </g>
</svg>`;

                return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
              })(),
              backgroundSize: "200px 200px", // = tile
              backgroundRepeat: "repeat",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Números que respaldan
            </h3>
          </div>

          {/* Stats Grid */}
          <div className="flex justify-evenly items-center gap-20">
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className=" justify-start items-center text-center max-w-[200px]"
              >
                <p className="text-5xl md:text-6xl font-bold text-white">
                  {value.value}
                  <span className="text-6xl font-bold text-secondary">+</span>
                </p>
                <h4 className="text-xl font-bold text-white">{value.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
