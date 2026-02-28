"use client"

import { useState, useEffect } from "react"

export default function TVPage() {
  const [screen, setScreen] = useState("WELCOME")

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter" && screen === "WELCOME") {
        setScreen("MENU")
      }

      if ((e.key === "Escape" || e.key === "Backspace") && screen === "MENU") {
        setScreen("WELCOME")
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [screen])

  return (
    <div style={styles.container}>

      {screen === "WELCOME" && (
        <div>
          <h1 style={styles.title}>Vítejte na Rychtrově boudě</h1>
          <p>Stiskněte Enter pro pokračování</p>
        </div>
      )}

      {screen === "MENU" && (
        <div>
          <h1 style={styles.title}>MENU</h1>

          <p>Escape = zpět</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    height: "100vh",
    background: "#111",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "60px",
    marginBottom: "20px"
  }

}

