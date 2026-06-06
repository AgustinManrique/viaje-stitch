import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viaje de Rescate con Stitch · Grupo Púrpura",
  description: "Prototipo de diseño inclusivo · DISCENTUSUD 2026 · UTN FRLP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
