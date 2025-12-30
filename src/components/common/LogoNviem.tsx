import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type textSizes = "xs" | "sm" | "md" | "default" | "lg" | "xl";

export default function LogoNviem({
  compact = false,
  redirect = true,
  size = "default",
  blockName = false,
}: {
  compact?: boolean;
  redirect?: boolean;
  size?: textSizes;
  blockName?: boolean;
}) {
  const textSizes: { [key in textSizes]: string } = {
    xs: "text-lg",
    sm: "text-2xl",
    md: "text-3xl",
    default: "text-4xl",
    lg: "text-5xl",
    xl: "text-6xl",
  };

  if (!redirect) {
    return (
      <div
        className={`${montserrat.className} ${textSizes[size]} text-gray-400 flex items-center justify-center w-full cursor-default select-none`}
        title="/\/VIEM"
      >
        <>
          <span className="font-[900]">/\/</span>
          {!compact ? (
            <span
              className={`font-semibold ${
                blockName ? "block" : "hidden md:block"
              }`}
            >
              VIEM
            </span>
          ) : null}
        </>
      </div>
    );
  }
  return (
    <Link
      className={`${montserrat.className} ${textSizes[size]} text-gray-400 flex items-center justify-center w-full select-none cursor-pointer`}
      href="https://nviem.com"
      target="_blank"
      rel="noopener noreferrer"
      title="/\/VIEM"
    >
      <>
        <span className="font-[900]">/\/</span>
        {!compact ? (
          <span
            className={`font-semibold ${
              blockName ? "block" : "hidden md:block"
            }`}
          >
            VIEM
          </span>
        ) : null}
      </>
    </Link>
  );
}
