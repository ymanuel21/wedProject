import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dewi & Budi — Wedding Invitation",
  description:
    "You are invited to celebrate the wedding of Dewi Amalia and Budi Manuel on March 14, 2027.",
  openGraph: {
    title: "Dewi & Budi — Wedding Invitation",
    description:
      "You are invited to celebrate the wedding of Dewi Amalia and Budi Manuel.",
    images: ["/og-image.svg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
