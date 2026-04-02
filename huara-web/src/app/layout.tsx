import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "El Huarachón — Pide en Línea",
  description:
    "Tacos de Asada, Pastor y más. Pide en línea desde Mexicali y gana Huara-Puntos con cada orden. ¡El mejor sazón cachanilla!",
  openGraph: {
    title: "El Huarachón — Pide en Línea",
    description: "Los tacos más rápidos de Mexicali. Pide ahora.",
    siteName: "El Huarachón",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-white font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
