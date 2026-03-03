"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

    const openPdf = useCallback((pdfDirectUrl: string) => {
        const r = viewerRef.current?.getBoundingClientRect();
        const w = r ? Math.round(r.width) : 1200;
        const h = r ? Math.round(r.height) : 700;

        setSelectedUrl(`/pdf?url=${encodeURIComponent(pdfDirectUrl)}&w=${w}&h=${h}`);
    }, []);

    const goBack = useCallback(() => {
        if (selectedUrl) {
            setSelectedUrl(null);
            return;
        }
        window.history.back();
    }, [selectedUrl]);

    useEffect(() => {
        const isBackKey = (e: KeyboardEvent) =>
            e.key === "Escape" ||
            e.key === "Backspace" ||
            e.key === "BrowserBack" ||
            e.key === "Back" ||
            e.keyCode === 27 ||
            e.keyCode === 8 ||
            e.keyCode === 166;

        const isEnterKey = (e: KeyboardEvent) =>
            e.key === "Enter" || e.key === "OK" || e.key === "Select" || e.keyCode === 13;

        const onKeyDown = (e: KeyboardEvent) => {
            // BACK (klávesnice / některé ovladače jako keydown)
            if (isBackKey(e)) {
                e.preventDefault();
                e.stopPropagation();
                goBack();
                return;
            }

            // když je otevřený PDF viewer, šipky/enter necháme na /pdf viewer
            if (selectedUrl) return;

            if (!max) return;

            if (e.key === "ArrowRight") setFocused((i) => Math.min(i + 1, max - 1));
            if (e.key === "ArrowLeft") setFocused((i) => Math.max(i - 1, 0));
            if (e.key === "ArrowDown") setFocused((i) => Math.min(i + cols, max - 1));
            if (e.key === "ArrowUp") setFocused((i) => Math.max(i - cols, 0));

            if (isEnterKey(e)) {
                e.preventDefault();
                const url = safe[focused]?.url;
                if (url) openPdf(url);
            }
        };

        // BACK z Androidu (ovladač) -> MainActivity posílá custom event
        const onRychtrovkaBack = (_e: Event) => {
            goBack();
        };

        window.addEventListener("keydown", onKeyDown, true); // capture = true je na TV spolehlivější
        window.addEventListener("rychtrovka:back", onRychtrovkaBack as EventListener, true);

        return () => {
            window.removeEventListener("keydown", onKeyDown, true);
            window.removeEventListener("rychtrovka:back", onRychtrovkaBack as EventListener, true);
        };
    }, [cols, focused, goBack, max, openPdf, safe, selectedUrl]);

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
                    <div style={{ position:"fixed", left:10, bottom:10, color:"#0f0", fontSize:12, zIndex:99999 }}>
                        PAGE: MENUS
                    </div>
                    <div style={pageStyles.title}>
                        {selectedUrl ? "📄 Zde je váš jídelní lístek" : "🍽️ Jídelní lístky námi doporučovaných podniků"}
                    </div>
                    <div style={pageStyles.hint}>
                        {selectedUrl ? "←/→ stránka  • Zpět = Menu" : "Šipky = výběr • OK = otevřít • Zpět = Zpět"}
                    </div>
                </div>

                <div style={pageStyles.card}>
                    {selectedUrl ? (
                        <div style={pageStyles.viewerWindow} ref={viewerRef}>
                            <iframe
                                src={selectedUrl}
                                style={pageStyles.pdfFrame}
                                // allow="fullscreen"
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
        background: "transparent",
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
        display: "flex",
        justifyContent: "center",
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