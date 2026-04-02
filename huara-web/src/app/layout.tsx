import type { Metadata, Viewport } from "next";
import { Roboto, Montserrat } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Taquerías El Huarachón — Dale Gusto Al Paladar",
  description:
    "Taqueria en Mexicali desde 1976. Tacos de Asada, Pastor, Parrilladas y más. Pide en línea y gana Huara-Puntos. ¡El mejor sazón cachanilla!",
  openGraph: {
    title: "Taquerías El Huarachón — Dale Gusto Al Paladar",
    description: "Taqueria en Mexicali desde 1976. Pide en línea.",
    siteName: "El Huarachón",
  },
  icons: {
    icon: "https://taqueriaelhuarachon.com/wp-content/uploads/2023/10/cropped-Objeto-inteligente-vectorial-32x32.webp",
    apple: "https://taqueriaelhuarachon.com/wp-content/uploads/2023/10/cropped-Objeto-inteligente-vectorial-180x180.webp",
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
    <html lang="es" className={`${roboto.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-white font-[var(--font-roboto)]">
        {children}
      </body>
    </html>
  );
}
