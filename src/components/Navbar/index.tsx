"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth.context";
import { Logo } from "../common/Logo";
import { useScrolled } from "@/hooks/useScrolled";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { user } = useAuth();
  const isScrolled = useScrolled(10);
  const pathname = usePathname();
  const pagesToHide = ["/login", "/register", "/map"];

  return pagesToHide.includes(pathname) ? null : (
    <nav
      className={`fixed top-0 left-0 w-full flex justify-around items-center p-4 text-gray-900 z-100
    ${
      isScrolled ? "bg-black/20 backdrop-blur-sm" : "bg-transparent"
    } transition-all duration-300
    `}
    >
      <Link
        href="/"
        className="flex text-primary items-center justify-center font-extrabold text-4xl select-none"
      >
        <Logo />
      </Link>
      <Link
        href={"/account"}
        className="text-white hover:bg-primary/80 font-semibold bg-primary px-4 py-2 rounded-md"
      >
        {user ? "Mi cuenta" : "Iniciar sesión"}
      </Link>
    </nav>
  );
};
