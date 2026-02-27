
import type { Metadata } from "next"
import { Caladea } from "next/font/google"
import { Crimson_Pro } from "next/font/google"
import "./globals.css"

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

const caladea = Caladea({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
   style: ["normal", "italic"],
})

const crimson = Crimson_Pro({ 
  subsets: ["latin"],
  weight: ["400", "700", "900"], // Zde si navolíte extra tučnou 900
})

export const metadata: Metadata = {
  title: "Rychtrovka TV",
  description: "Hotel kiosk TV",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body className={crimson.className}>{children}</body>
    </html>
  )
}

