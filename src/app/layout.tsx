import type { Metadata } from "next";
import { Inter, Space_Mono, Playfair_Display } from "next/font/google";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "HH GOA ID STUDIO",
  description: "Create your HH Goa 2026 Builder ID",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--color-hh-dark-green)] text-white selection:bg-[var(--color-hh-yellow)] selection:text-[var(--color-hh-dark-green)] overflow-x-hidden">
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
