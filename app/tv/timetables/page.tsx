"use client"

import { useEffect, useMemo, useState } from "react"
import { kioskConfig } from "../_data/kioskConfig"
import { usePdfList } from "../_hooks/usePdfList"

export default function TimetablesPage() {
    const { items, loading } = usePdfList(kioskConfig.hotelId, "pdfTimeTables")
    const [focused, setFocused] = useState(0)
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

    const cols = 3
    const safe = useMemo(() => items ?? [], [items])
    const max = safe.length

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const isBack = e.key === "Escape" || e.key === "Backspace" || e.keyCode === 27 || e.keyCode === 8 || e.keyCode === 166

            if (isBack) {
                e.preventDefault()
                if (selectedUrl) setSelectedUrl(null)
                else window.history.back()
                return
            }

            if (selectedUrl || !max) return

            if (e.key === "ArrowRight") setFocused((i) => Math.min(i + 1, max - 1))
            if (e.key === "ArrowLeft") setFocused((i) => Math.max(i - 1, 0))
            if (e.key === "ArrowDown") setFocused((i) => Math.min(i + cols, max - 1))
            if (e.key === "ArrowUp") setFocused((i) => Math.max(i - cols, 0))

            const isEnter = e.key === "Enter" || e.key === "OK" || e.key === "Select" || e.keyCode === 13
            if (isEnter) {
                e.preventDefault()
                const url = safe[focused]?.url
                if (url) {
                    // OPRAVA: ŽÁDNÉ window.open! Jen nastavení stavu.
                    setSelectedUrl(url)
                }
            }
        }
        window.addEventListener("keydown", onKey, true)
        return () => window.removeEventListener("keydown", onKey, true)
    }, [focused, max, safe, selectedUrl])

    return (
        <div style={pageStyles.container}>
            <div style={pageStyles.overlay} />

            <div style={pageStyles.content}>
                <div style={pageStyles.header}>
                    <div style={pageStyles.title}>
                        {selectedUrl ? "📄 Detail spoje" : "🚌 Jízdní řády Benecko"}
                    </div>
                    <div style={pageStyles.hint}>
                        {selectedUrl ? "Zpět pro seznam spojů" : "Zpět = Escape / Back"}
                    </div>
                </div>

                <div style={pageStyles.card}>
                    {selectedUrl ? (
                        <div style={pageStyles.viewerPadding}>
                            <embed
                                src={`${selectedUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                type="application/pdf"
                                style={pageStyles.pdfEmbed}
                            />
                        </div>
                    ) : (
                        <div style={pageStyles.gridPadding}>
                            {loading ? (
                                <div style={pageStyles.status}>Načítám jízdní řády…</div>
                            ) : (
                                <div style={pageStyles.grid}>
                                    {safe.map((it, idx) => (
                                        <div
                                            key={it.id}
                                            // OPRAVA: I tady jen setSelectedUrl
                                            onClick={() => setSelectedUrl(it.url)}
                                            style={{
                                                ...pageStyles.item,
                                                background: idx === focused ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)",
                                                border: idx === focused ? "3px solid #ff2222" : "1px solid rgba(255,255,255,0.1)",
                                            }}
                                        >
                                            <div style={{ fontSize: 32 }}>🚌</div>
                                            <div style={pageStyles.itemTitle}>{it.title}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const pageStyles: Record<string, React.CSSProperties> = {
    container: { height: "100vh", position: "relative", overflow: "hidden", backgroundImage: "url('/media/rychtrovka-illustration.png')", backgroundSize: "cover" },
    overlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)" },
    content: { position: "relative", height: "100%", padding: 44, display: "flex", flexDirection: "column", zIndex: 1 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 },
    title: { fontSize: 40, fontWeight: 900, fontStyle: "italic", color: "#ff2222", textShadow: "0 4px 20px rgba(0,0,0,0.8)" },
    hint: { fontSize: 18, color: "white", opacity: 0.8 },
    card: { flex: 1, borderRadius: 24, overflow: "hidden", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 25px 60px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column" },
    gridPadding: { padding: 25, height: "100%" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15 },
    item: { cursor: "pointer", borderRadius: 18, padding: "18px", color: "white", display: "flex", alignItems: "center", gap: 12 },
    itemTitle: { fontSize: 20, fontWeight: 800, lineHeight: 1.1 },
    status: { color: "white", fontSize: 22, textAlign: "center", marginTop: 50 },
    viewerPadding: { width: "100%", height: "100%", padding: "20px", boxSizing: "border-box" },
    pdfEmbed: { width: "100%", height: "100%", borderRadius: 12, background: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }
}