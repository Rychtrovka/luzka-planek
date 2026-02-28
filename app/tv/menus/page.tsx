"use client"

import { useEffect, useMemo, useState } from "react"
import { kioskConfig } from "../_data/kioskConfig"
import { usePdfList } from "../_hooks/usePdfList"

export default function MenusPage() {
    const { items, loading } = usePdfList(kioskConfig.hotelId, "pdfMenus")
    const [focused, setFocused] = useState(0)
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
    const [scrollOffset, setScrollOffset] = useState(0)

    const cols = 3
    const safe = useMemo(() => items ?? [], [items])
    const max = safe.length

    useEffect(() => {
        setScrollOffset(0)
    }, [selectedUrl])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const isBack = e.key === "Escape" || e.key === "Backspace" || e.key === "BrowserBack" || e.keyCode === 27 || e.keyCode === 8 || e.keyCode === 166

            if (isBack) {
                e.preventDefault()
                if (selectedUrl) setSelectedUrl(null)
                else window.history.back()
                return
            }

            if (selectedUrl) {
                const step = 250
                if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setScrollOffset(prev => prev - step)
                }
                if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setScrollOffset(prev => Math.min(0, prev + step))
                }
                return
            }

            if (!max) return
            if (e.key === "ArrowRight") setFocused((i) => Math.min(i + 1, max - 1))
            if (e.key === "ArrowLeft")  setFocused((i) => Math.max(i - 1, 0))
            if (e.key === "ArrowDown")  setFocused((i) => Math.min(i + cols, max - 1))
            if (e.key === "ArrowUp")    setFocused((i) => Math.max(i - cols, 0))

            if (e.key === "Enter" || e.key === "OK" || e.keyCode === 13) {
                e.preventDefault()
                const url = safe[focused]?.url
                if (url) setSelectedUrl(url)
            }
        }
        window.addEventListener("keydown", onKey, true)
        return () => window.removeEventListener("keydown", onKey, true)
    }, [focused, max, safe, selectedUrl])

    return (
        <div style={pageStyles.container}>
            <div style={pageStyles.backgroundLayer} />
            <div style={pageStyles.overlay} />
            <div style={pageStyles.content}>
                <div style={pageStyles.header}>
                    <div style={pageStyles.title}>{selectedUrl ? "📄 Zde je váš jídelní lístek" : "🍽️ Jídelní lístky námi doporučovaných podniků"}</div>
                    <div style={pageStyles.hint}>{selectedUrl ? "Šipky = Posun | Zpět = Menu" : "Zpět = Escape"}</div>
                </div>

                <div style={pageStyles.card}>
                    {selectedUrl ? (
                        <div style={pageStyles.viewerWindow}>
                            {/* Obal pro vycentrování a scroll */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                top: scrollOffset,
                                transition: 'top 0.3s ease-out',
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column', // Seřadí listy pod sebe
                                alignItems: 'center',    // Vycentruje papír horizontálně
                                padding: '20px 0'        // Mezera nahoře a dole

                            }}>
                                <iframe
                                    src={`${selectedUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                                    style={pageStyles.pdfFrame}
                                    frameBorder="0"
                                />
                            </div>

                            {scrollOffset === 0 && (
                                <div style={pageStyles.scrollIndicator}>↓  DALŠÍ LIST</div>
                            )}
                        </div>
                    ) : (
                        <div style={pageStyles.gridPadding}>
                            {loading ? <div style={pageStyles.status}>Načítám…</div> : (
                                <div style={pageStyles.grid}>
                                    {safe.map((it, idx) => (
                                        <div key={it.id} onClick={() => setSelectedUrl(it.url)}
                                             style={{
                                                 ...pageStyles.item,
                                                 background: idx === focused ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                                                 border: idx === focused ? "3px solid #ff2222" : "1px solid rgba(255,255,255,0.1)",
                                             }}>
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
    )
}

const pageStyles: Record<string, React.CSSProperties> = {
    container: {
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "white", // Základní barva, než se načte obrázek
       // backgroundImage: "url('/media/rychtrovka-illustration.png')",
    },
    // Nová vrstva pro samotný obrázek
    backgroundLayer: {
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/media/rychtrovka-illustration.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 0, // Nejnižší úroveň
    },
    overlay: {
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 100%)",
        zIndex: 1 // Nad obrázkem
    },
    content: {
        position: "relative",
        height: "100%",
        padding: 44,
        display: "flex",
        flexDirection: "column",
        zIndex: 2 // Bezpečně nad všemi vrstvami pozadí
    },
    // ... zbytek stylů zůstává stejný

    header: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
    title: { fontSize: 50, fontWeight: 900, color: "#ff2222" },
    hint: { fontSize: 18, color: "white", opacity: 0.9 },
    card: {
        flex: 1,
        borderRadius: 24,
        overflow: "hidden",
        background: "rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.15)",
        position: "relative"
    },
    viewerWindow: {
        position: "absolute",
        width: "100%",
        inset: 15,
        overflow: "hidden",
        borderRadius: 12,
        background: "transparent"
    },

    pdfFrame: {
        width: "600px",  // Fixní šířka papíru zamezí zvětšení písma
        height: "8000px", // Dostatečná výška pro všechny strany pod sebou
        pointerEvents: "none",
        background: "transparent",
        boxShadow: "0 0 40px rgba(0,0,0,0.5)"
    },

    gridPadding: { padding: 25, height: "100%" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15 },
    item: { cursor: "pointer", fontSize: 25, borderRadius: 18, padding: "18px", color: "white", display: "flex", alignItems: "center", gap: 12 },
    status: { color: "white", fontSize: 30, textAlign: "center", marginTop: 50 },
    scrollIndicator: { position: "absolute", bottom: 20, right: 20, background: "#ff2222", color: "white", padding: "10px 20px", borderRadius: 30, fontWeight: "bold", zIndex: 10, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }
}