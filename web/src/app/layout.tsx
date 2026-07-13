import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
