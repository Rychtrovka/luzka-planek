"use client";

export const dynamic = "force-dynamic";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { kioskConfig } from "../_data/kioskConfig";
import { usePdfList } from "../_hooks/usePdfList";

export default function TimeTablesPage() {
    // ✅ tady MUSÍ být pdfTimeTables
    const { items, loading } = usePdfList(kioskConfig.hotelId, "pdfTimeTables");

    const [focused, setFocused] = useState(0);
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
                if (selectedUrl) setSelectedUrl(null);
                else window.history.back(); // tady už klidně back, ať to jde i v browseru

                return;
            }

            // když je otevřené PDF, nech šipky na /pdf viewer (iframe)
            if (selectedUrl) return;

            if (!max) return;

            if (e.key === "ArrowRight") setFocused((i) => Math.min(i + 1, max - 1));
            if (e.key === "ArrowLeft") setFocused((i) => Math.max(i - 1, 0));
            if (e.key === "ArrowDown") setFocused((i) => Math.min(i + cols, max - 1));
            if (e.key === "ArrowUp") setFocused((i) => Math.max(i - cols, 0));

            const isEnter = e.key === "Enter" || e.key === "OK" || e.key === "Select" || e.keyCode === 13;
            if (isEnter) {
                e.preventDefault();
                const url = safe[focused]?.url;
                if (url) openPdf(url);
            }
        };

        // ✅ capture = true, ať to vyhraje proti focusu ve WebView/iframes
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [cols, focused, max, openPdf, safe, selectedUrl]);

    return (
        <div style={pageStyles.container}>
            <img src="/media/RychterIS_final.png" alt="Logo" style={pageStyles.logo} width="180" />
            <div style={pageStyles.backgroundLayer} />
            <div style={pageStyles.overlay} />

            {/* ✅ mini diagnostika – uvidíš na boxu co se fakt renderuje */}
            <div style={pageStyles.debugPill}>
                /tv/timetables • kind=pdfTimeTables • items={safe.length} • {selectedUrl ? "viewer" : "list"}
            </div>

            <div style={pageStyles.content}>
                <div style={pageStyles.header}>
                    <div style={pageStyles.title}>
                        {selectedUrl ? "📄 Zde je požadovaný jízdní řád" : "🚌 Jízdní řády"}
                    </div>
                    <div style={pageStyles.hint}>
                        {selectedUrl ? "←/→ stránka • Zpět = Menu" : "Šipky = výběr • OK = otevřít • Zpět = Šipka zpět"}
                    </div>
                </div>

                <div style={pageStyles.card}>
                    {selectedUrl ? (
                        <div style={pageStyles.viewerWindow} ref={viewerRef}>
                            <iframe src={selectedUrl} style={pageStyles.pdfFrame} />
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
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 9999,
        pointerEvents: "none",
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
    debugPill: {
        position: "absolute",
        left: 18,
        top: 18,
        zIndex: 9999,
        padding: "8px 12px",
        borderRadius: 16,
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "rgba(255,255,255,0.9)",
        fontSize: 14,
        pointerEvents: "none",
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