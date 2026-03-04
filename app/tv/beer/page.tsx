"use client";

import React, { useEffect, useMemo, useState } from "react";
import { kioskConfig } from "../_data/kioskConfig";
import { styles as tvStyles } from "../_styles/tvStyles";

function isBackKey(e: KeyboardEvent) {
    return (
        e.key === "Escape" ||
        e.key === "Backspace" ||
        e.key === "BrowserBack" ||
        e.key === "Back" ||
        e.keyCode === 27 ||
        e.keyCode === 8 ||
        e.keyCode === 166
    );
}

type FrameState = "idle" | "loading" | "loaded" | "error" | "timeout";

export default function BeerPage() {
    const [isLocked, setIsLocked] = useState(true);
    const [frameState, setFrameState] = useState<FrameState>("idle");
    const [frameErr, setFrameErr] = useState<string | null>(null);

    const url = kioskConfig.urls.beer;

    const canEmbedHint = useMemo(() => {
        // jen kosmetika – pokud je to http, WebView může být citlivá
        try {
            const u = new URL(url);
            return u.protocol === "https:" ? "HTTPS" : "POZOR: není HTTPS";
        } catch {
            return "Neplatná URL";
        }
    }, [url]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (isBackKey(e)) {
                e.preventDefault();
                // návrat na /tv
                window.location.href = "/tv";
            }
        };

        window.addEventListener("keydown", handleKey, true);
        return () => window.removeEventListener("keydown", handleKey, true);
    }, []);

    // pokud iframe nic neřekne, zkusíme timeout – typicky blokace X-Frame/CSP se tváří "mrtvě"
    useEffect(() => {
        setFrameState("loading");
        setFrameErr(null);

        const t = window.setTimeout(() => {
            setFrameState((s) => (s === "loaded" ? s : "timeout"));
        }, 6000);

        return () => window.clearTimeout(t);
    }, [url]);

    const openFullscreen = () => {
        // nejspolehlivější fallback: otevřít cílovou stránku jako top-level
        window.location.href = url;
    };

    return (
        <div style={pageStyles.container}>
            <img src="/media/RychterIS_final.png" alt="Logo" style={pageStyles.logo} width="180" />
            <div style={pageStyles.overlay} />

            <div style={pageStyles.header}>
                <div style={pageStyles.title}>
                    <span style={pageStyles.icon}>🍺</span>
                    Pivoměr
                </div>

                <div style={{ display: "flex", gap: 20, alignItems: "center", zIndex: 100 }}>
                    <button
                        type="button"
                        onClick={() => setIsLocked((v) => !v)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 12,
                            border: "none",
                            background: isLocked ? "rgba(255,255,255,0.2)" : "#ff2222",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                            pointerEvents: "auto",
                        }}
                    >
                        {isLocked ? "🔒 Odemknout ovládání" : "🔓 Zamknout (aktivovat Zpět)"}
                    </button>

                    <div style={pageStyles.hint}>Zpět = Escape / Back</div>
                </div>
            </div>

            <div style={pageStyles.content}>
                <div style={pageStyles.frameCard}>

                    {isLocked && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 10,
                                background: "transparent"
                            }}
                        />
                    )}

                    <iframe
                        src={url}
                        title="Pivoměr"
                        style={pageStyles.frame}
                        frameBorder={0}
                        scrolling="no"
                        allow="fullscreen"
                    />

                </div>
            </div>
        </div>
    );
}

const pageStyles: Record<string, React.CSSProperties> = {
    container: {
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundImage: tvStyles.container?.backgroundImage,
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

    header: {
        position: "absolute",
        top: 30,
        left: 50,
        right: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        zIndex: 2,
        pointerEvents: "none",
    },

    title: {
        fontSize: 44,
        fontWeight: 700,
        fontStyle: "italic",
        color: "#ff2222",
        textShadow: "0 4px 20px rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    icon: { fontSize: 34, lineHeight: 1 },

    hint: {
        fontSize: 18,
        opacity: 0.85,
        color: "white",
        textShadow: "0 4px 20px rgba(0,0,0,0.8)",
    },

    content: {
        position: "relative",
        height: "100%",
        padding: 40,
        paddingTop: 110,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        zIndex: 1,
    },

    frameCard: {
        width: "40%",
        height: "100%",
        borderRadius: 24,
        overflow: "hidden",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        background: "rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
        position: "relative", // ✅ důležité pro overlay/diagnostiku
    },

    frame: {
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
        background: "transparent",
    },

    logo: {
        position: "absolute" as const,
        top: 10,
        right: 10,
        zIndex: 9999,
        pointerEvents: "none" as const,
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
    },
};