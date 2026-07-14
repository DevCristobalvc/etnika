import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { obtenerConfig } from "@/lib/config";
import "./globals.css";

export const revalidate = 60;

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://etnikamoda.com"),
  title: "Étnika — Moda y Diseño | Accesorios y Marroquinería",
  description:
    "Marca colombiana de accesorios artesanales exclusivos. Piezas únicas elaboradas a mano que combinan elegancia, sofisticación y personalidad.",
  openGraph: {
    title: "Étnika — Moda y Diseño",
    description:
      "Accesorios artesanales que cuentan historias y hacen brillar tu esencia.",
    images: ["/portada.jpg"],
    locale: "es_CO",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await obtenerConfig();
  const colores: Record<string, string> = {};
  if (config.color_fondo) colores["--marfil"] = config.color_fondo;
  if (config.color_texto) {
    colores["--tinta"] = config.color_texto;
    colores["--carbon"] = config.color_texto;
  }
  if (config.color_acento) colores["--arena"] = config.color_acento;

  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col" style={colores as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
