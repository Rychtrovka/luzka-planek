import type { Metadata, Viewport } from "next";
import { Crimson_Pro, Caladea } from "next/font/google";
import "./globals.css";

// Definice fontů
const crimson = Crimson_Pro({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
  variable: '--font-crimson', // Umožní použití v CSS přes var(--font-crimson)
});

const caladea = Caladea({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: '--font-caladea',
});

// Správné nastavení viewportu pro mobilní zařízení a kiosky
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Metadata včetně cesty k ikoně
export const metadata: Metadata = {
  title: "RychterIS TV",
  description: "Rychtrovka - kiosk TV",
  icons: {
    icon: "/favicon.ico", // Ujisti se, že soubor je v public/favicon.ico
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="cs" className={`${crimson.variable} ${caladea.variable}`}>
      <body
          className={crimson.className}
          style={{ margin: 0, padding: 0, overflow: 'hidden' }}
      >
      {children}
      </body>
      </html>
  );
}
