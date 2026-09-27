import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MC9KF4ZX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MC9KF4ZX');`}
        </Script>
      </body>
    </html>
  );
}
