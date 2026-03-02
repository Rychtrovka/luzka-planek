"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { kioskConfig } from "../_data/kioskConfig";
import { usePdfList } from "../_hooks/usePdfList";

export default function MenusPage() {
    const { items, loading } = usePdfList(kioskConfig.hotelId, "pdfMenus");
    const [focused, setFocused] = useState(0);

    // selectedUrl je URL na interní /pdf viewer (ne přímo PDF)
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    const cols = 3;
    const safe = useMemo(() => items ?? [], [items]);
    const max = safe.length;

    const viewerRef = useRef<HTMLDivElement | null>(null);

    const openPdf = (pdfDirectUrl: string) => {
        const r = viewerRef.current?.getBoundingClientRect();
        const w = r ? Math.round(r.width) : 1200;
        const h = r ? Math.round(r.height) : 700;

        setSelectedUrl(`/pdf?url=${encodeURIComponent(pdfDirectUrl)}&w=${w}&h=${h}`);
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const isBack =
                e.key === "Escape" ||
                e.key === "Backspace" ||
                e.key === "BrowserBack" ||
                e.keyCode === 27 ||
                e.keyCode === 8 ||
                e.keyCode === 166;

            if (isBack) {
                e.preventDefault();
                e.stopPropagation();
                // když je otevřený PDF viewer v iframe, zavři ho v rámci UI
                if (selectedUrl) {
                    setSelectedUrl(null);
                }
                // jinak NIC – back vyřeší Android (onBackPressed -> web.goBack / kiosk)
                return;
            }

            // Když je otevřené PDF, šipky necháváme na /pdf viewer (iframe).
            // MenusPage jen neřeší navigaci v gridu.
            if (selectedUrl) return;

            if (!max) return;

            if (e.key === "ArrowRight") setFocused((i) => Math.min(i + 1, max - 1));
            if (e.key === "ArrowLeft") setFocused((i) => Math.max(i - 1, 0));
            if (e.key === "ArrowDown") setFocused((i) => Math.min(i + cols, max - 1));
            if (e.key === "ArrowUp") setFocused((i) => Math.max(i - cols, 0));

            if (e.key === "Enter" || e.key === "OK" || e.keyCode === 13) {
                e.preventDefault();
                const url = safe[focused]?.url;
                if (url) openPdf(url);
            }
        };

        window.addEventListener("keydown", onKey, false);
        return () => window.removeEventListener("keydown", onKey, false);
    }, [focused, max, safe, selectedUrl]);

    return (
        <div style={pageStyles.container}>
            <img
                src="/media/RychterIS_final.png"
                alt="Logo"
                style={pageStyles.logo}
                width="180"
            />
            <div style={pageStyles.backgroundLayer} />
            <div style={pageStyles.overlay} />

            <div style={pageStyles.content}>
                <div style={pageStyles.header}>
                    <div style={pageStyles.title}>
                        {selectedUrl ? "📄 Zde je váš jídelní lístek" : "🍽️ Jídelní lístky námi doporučovaných podniků"}
                    </div>
                    <div style={pageStyles.hint}>
                        {selectedUrl ? "←/→ stránka  • Zpět = Menu" : "Šipky = výběr • OK = otevřít • Zpět = Escape"}
                    </div>
                </div>

                <div style={pageStyles.card}>
                    {selectedUrl ? (
                        <div style={pageStyles.viewerWindow} ref={viewerRef}>
                            <iframe
                                src={selectedUrl}
                                style={pageStyles.pdfFrame}
                                //allow="fullscreen"
                            />
                        </div>
                    ) : (
                        <div style={pageStyles.gridPadding} ref={viewerRef}>
                            {loading ? (
                                <div style={pageStyles.status}>Načítám…</div>
                            ) : (
                                <div style={pageStyles.grid}>
                                    {safe.map((it, idx) => (
                                        <div
                                            key={it.id}
                                            onClick={() => openPdf(it.url)}
                                            style={{
                                                ...pageStyles.item,
                                                background: idx === focused ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                                                border: idx === focused ? "3px solid #ff2222" : "1px solid rgba(255,255,255,0.1)",
                                            }}
                                        >
                                            📄 {it.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
        background: "white",
    },

    logo: {
        position: "absolute" as const,
        top: 10,
        right: 10,
        zIndex: 9999,
        pointerEvents: "none" as const,
        filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
    },

    backgroundLayer: {
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/media/rychtrovka-illustration.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0,
    },

    overlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
        zIndex: 1,
    },

    content: {
        position: "relative",
        height: "100%",
        padding: 44,
        display: "flex",
        flexDirection: "column",
        zIndex: 2,
    },

    header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
    title: { fontSize: 50, fontWeight: 900, color: "#ff2222" },
    hint: { fontSize: 18, color: "white", opacity: 0.9 },

    card: {
        flex: 1,
        borderRadius: 24,
        overflow: "hidden",
       // background: "rgba(0,0,0,0.1)",
        background:"transparent",
        border: "1px solid rgba(255,255,255,0.15)",
        position: "relative",
    },

    viewerWindow: {
        position: "absolute",
        width: "100%",
        inset: 15,
        overflow: "hidden",
        borderRadius: 12,
        background: "transparent",
    },

    pdfFrame: {
        width: "50%",
        height: "100%",
        border: "none",
        background: "transparent",
        boxShadow: "0 0 40px rgba(0,0,0,0.5)",
    },

    gridPadding: { padding: 25, height: "100%" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15 },
    item: {
        cursor: "pointer",
        fontSize: 25,
        borderRadius: 18,
        padding: "18px",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    status: { color: "white", fontSize: 30, textAlign: "center", marginTop: 50 },
};