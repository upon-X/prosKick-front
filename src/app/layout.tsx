import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/auth.context";
import { UserRequestsProvider } from "../context/user-requests.context";
import { appName } from "@/config";
import { Navbar } from "@/components/Navbar";
import GlobalUserUpdater from "@/components/auth/GlobalUserUpdater";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: appName,
  description:
    "Plataforma para gestión de equipos, jugadores y partidos de fútbol. Encuentra canchas de Futbol cerca de ti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/maplibre-gl@5.8.0/dist/maplibre-gl.css"
        />
      </head>
      <body className={`${montserrat.className} antialiased h-full`}>
        <AuthProvider>
          <UserRequestsProvider>
            <Toaster position="top-right" duration={5000} richColors />
            <GlobalUserUpdater debug={process.env.NODE_ENV === "development"} />
            <Navbar />
            {children}
          </UserRequestsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
