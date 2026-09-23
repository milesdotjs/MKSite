import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const arcade = localFont({
  src: "./fonts/PressStart2P-Regular.ttf",
  variable: "--font-arcade",
  display: "swap",
});

const dialog = localFont({
  src: "./fonts/DotGothic16-Regular.ttf",
  variable: "--font-dialog",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Try Not to Use Bankai",
  description:
    "Byakuya Kuchiki interrogates you on Bleach, Naruto, Yu-Gi-Oh!, Jujutsu Kaisen and Yu Yu Hakusho trivia. Two mistakes and he uses Bankai. He always uses Bankai.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07060c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${arcade.variable} ${dialog.variable}`}>
      <body>{children}</body>
    </html>
  );
}
