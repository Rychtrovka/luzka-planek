"use client"

import { useEffect } from "react"
import type { CSSProperties } from "react"

export default function WeatherPage() {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isBack =
        e.key === "Escape" ||
        e.key === "Backspace" ||
        e.key === "BrowserBack" ||
        // fallbacky pro některé ovladače / starší webview:
        (e as any).keyCode === 27 ||
        (e as any).keyCode === 8 ||
        (e as any).keyCode === 166

      if (isBack) {
        e.preventDefault()
        window.history.back()
      }
    }

    window.addEventListener("keydown", handleKey, true)
    return () => window.removeEventListener("keydown", handleKey, true)
  }, [])

  return (
    <div style={styles.container}>
      <img
          src="/media/RychterIS_final.png"
          alt="Logo"
          style={styles.logo}
          width="180"
      />
      <div style={styles.overlay} />

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span style={styles.icon} aria-hidden="true">
              🌡️
            </span>
            Počasí – Rychtrovka
          </div>

          <div style={styles.hint}>Zpět = Escape / Back</div>
        </div>

        <div style={styles.frameCard}>
          <iframe
            src="https://weewx.rychtrovka.cz/ss/"
            title="Počasí Rychtrovka"
            style={styles.frame}
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    backgroundImage: "url('/media/rychtrovka-illustration.png')",
    backgroundSize: "cover",
    backgroundPosition: "center bottom",
    backgroundRepeat: "no-repeat",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.75) 100%)",
  },

 content: {
  position: "relative",
  height: "100vh",        // pevně na obrazovku
  display: "flex",
  flexDirection: "column",
},

header: {
  flexShrink: 0,          // header se nesmí roztahovat
  padding: "30px 40px 10px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  color: "#ff2222",
  fontStyle: "italic",
  zIndex: 2,
},

frameCard: {
  flex: 1,                // zabere zbytek výšky
  minHeight: 0,           // KRITICKÉ pro správné zmenšení
  padding: "0 40px 40px 40px",
  boxSizing: "border-box",
},

frame: {
  width: "100%",
  height: "100%",
  border: "none",
  borderRadius: 24,
  display: "block",
},

  title: {
    fontSize: 44,
    fontWeight: 700,
    fontStyle: "italic",
    color: "#ff2222",
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "baseline",
    gap: 12,
  },

  icon: {
    fontSize: 40,
    lineHeight: 1,
  },

  hint: {
    fontSize: 18,
    opacity: 0.85,
    color: "white",
    textShadow: "0 4px 20px rgba(0,0,0,0.8)",
    whiteSpace: "nowrap",
  },
  logo: {
    position: "absolute" as const,
    top: 10,
    right: 10,
    zIndex: 9999,
    pointerEvents: "none" as const,
    filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
  },

  
}
