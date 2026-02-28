"use client"

import { useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { kioskConfig } from "@/app/tv/_data/kioskConfig"

// Definice konstant pro klávesy (přehlednější než magická čísla)
const BACK_KEYS = ["Escape", "Backspace", "BrowserBack"]
const BACK_KEY_CODES = [27, 8, 166]

const isBackAction = (e: KeyboardEvent): boolean =>
    BACK_KEYS.includes(e.key) || BACK_KEY_CODES.includes(e.keyCode)

export default function SnowPage() {
    const router = useRouter()
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const handleBack = useCallback(() => {
        // Pokud existuje historie v rámci aplikace, jdi zpět, jinak na hlavní TV rozcestník
        if (window.history.length > 1) {
            router.back()
        } else {
            router.push("/tv")
        }
    }, [router])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!isBackAction(e)) return

            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation?.()

            handleBack()
        }

        // Window focus helper pro případy, kdy iframe "ukradne" pozornost
        const recoverFocus = () => window.focus()

        window.addEventListener("keydown", onKeyDown, true)
        window.addEventListener("mousedown", recoverFocus, true)

        return () => {
            window.removeEventListener("keydown", onKeyDown, true)
            window.removeEventListener("mousedown", recoverFocus, true)
        }
    }, [handleBack])

    return (
        <main style={styles.container}>
            <img
                src="/media/RychterIS_final.png"
                alt="Logo"
                style={styles.logo}
                width="180"
            />
            <div style={styles.overlay} />

            <header style={styles.header}>
                <h1 style={styles.title}>
                    <span style={styles.icon} aria-hidden="true">❄️</span>
                    Stav sněhu – mapa
                </h1>
                <div style={styles.hint}>Zpět = Escape / Back</div>
            </header>

            <section style={styles.content}>
                <div style={styles.frameCard}>
                    <iframe
                        ref={iframeRef}
                        src={kioskConfig.urls.snow}
                        title="Mapa sněhu"
                        style={styles.frame}
                        referrerPolicy="no-referrer"
                        allow="fullscreen"
                    />
                </div>
            </section>
        </main>
    )
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#000",
        backgroundImage: "url('/media/rychtrovka-illustration.png')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
    },
    overlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.75) 100%)",
        zIndex: 1,
    },
    header: {
        position: "absolute",
        top: 30,
        left: 50,
        right: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        zIndex: 10,
        pointerEvents: "none",
    },
    title: {
        margin: 0,
        fontSize: 45,
        fontWeight: 900,
        fontStyle: "italic",
        color: "#ff2222",
        textShadow: "0 4px 20px rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    icon: { fontSize: 34 },
    hint: {
        fontSize: 18,
        opacity: 0.85,
        color: "#fff",
        textShadow: "0 4px 20px rgba(0,0,0,0.8)",
    },
    content: {
        position: "relative",
        height: "100%",
        padding: "80px 40px 40px", // přidaný horní padding kvůli headeru
        boxSizing: "border-box",
        display: "flex",
        zIndex: 5,
    },
    frameCard: {
        flex: 1,
        borderRadius: 24,
        overflow: "hidden",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
    },
    frame: {
        width: "100%",
        height: "100%",
        border: "none",
        background: "transparent",
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
