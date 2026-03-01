"use client"

import React, { useEffect } from "react"

export default function MapPage(): React.JSX.Element {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      // Na TV ovladačích se Back/Zpět často mapuje na Escape nebo Backspace
      if (e.key === "Escape" || e.key === "Backspace") {
        window.history.back()
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
      <div style={styles.container}>
          <img
              src="/media/RychterIS_final.png"
              alt="Logo"
              style={styles.logo}
              width="180"
          />

      <div style={styles.header}></div>
        <iframe
            src="https://intmap.holidayinfo.cz/webmap.php?lang=cs&mapname=benecko&servicecode=1234"
            style={styles.frame}
            title="Mapa skiareálu"
            // frameBorder je v Reactu zastaralý, používáme border: "none" ve stylech
        />
      </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000",
    overflow: "hidden",
  },
  frame: {
    width: "100%",
    height: "100%",
    border: "none",
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
    logo: {
        position: "absolute" as const,
        top: 10,
        right: 10,
        zIndex: 9999,
        pointerEvents: "none" as const,
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
    }
}