import type { Metadata } from "next";
import { Caladea } from "next/font/google";
import "./globals.css";

const caladea = Caladea({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-caladea",
});

export const metadata: Metadata = {
  title: "Požadavek na využití lůžek",
  description: "součást systému RychterIS",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="cs"
          className={`${caladea.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">
      {children}
      </body>
      </html>
  );
}