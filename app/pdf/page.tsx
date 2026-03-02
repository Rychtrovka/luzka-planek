"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useRef, useState } from "react";

declare global {
    interface Window {
        pdfjsLib?: any;
    }
}

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-src="${src}"]`) as HTMLScriptElement | null;
        if (existing) {
            if ((existing as any)._loaded) return resolve();
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error(`Script load failed: ${src}`)));
            return;
        }

        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.dataset.src = src;
        s.addEventListener("load", () => { (s as any)._loaded = true; resolve(); });
        s.addEventListener("error", () => reject(new Error(`Script load failed: ${src}`)));
        document.head.appendChild(s);
    });
}

export default function PdfPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [pageNum, setPageNum] = useState(1);
    const [numPages, setNumPages] = useState(1);

    // zoom multiplier relative to "fit-to-screen"
    const [zoom, setZoom] = useState(1.0);

    // refresh render on resize (TV/rotation/UI changes)
    const [resizeTick, setResizeTick] = useState(0);

    const pdfUrl = useMemo(() => {
        if (typeof window === "undefined") return "";
        const u = new URL(window.location.href);
        return u.searchParams.get("url") ?? "";
    }, []);

    useEffect(() => {
        const onResize = () => setResizeTick((t) => t + 1);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); setPageNum((p) => Math.max(1, p - 1)); }
            if (e.key === "ArrowRight") { e.preventDefault(); setPageNum((p) => Math.min(numPages, p + 1)); }

            if (e.key === "+" || e.key === "=") { e.preventDefault(); setZoom((z) => Math.min(3.0, Number((z + 0.2).toFixed(2)))); }
            if (e.key === "-" || e.key === "_") { e.preventDefault(); setZoom((z) => Math.max(0.6, Number((z - 0.2).toFixed(2)))); }
        };

        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [numPages]);

    useEffect(() => {
        if (!pdfUrl) {
            setErr("Chybí url");
            setLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                setErr(null);
                setLoading(true);

                await loadScript("/pdfjs/pdf.min.js");

                const pdfjs = window.pdfjsLib;
                if (!pdfjs) throw new Error("pdfjsLib nenalezeno (nenačetl se /pdfjs/pdf.min.js?)");

                pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

                // ✅ často pomáhá v TV WebView: stáhnout celé bez range (můžeš vypnout, když CORS už máš OK)
                const task = pdfjs.getDocument({
                    url: pdfUrl,
                    disableRange: true,
                    disableStream: true,
                    disableAutoFetch: true,
                });

                const pdf = await task.promise;
                if (cancelled) return;

                setNumPages(pdf.numPages);

                const safePageNum = Math.min(Math.max(1, pageNum), pdf.numPages);
                const page = await pdf.getPage(safePageNum);

                // základní viewport pro zjištění rozměrů
                const baseViewport = page.getViewport({ scale: 1 });

                // dostupná plocha – malá rezerva, aby se to nikdy “neuseklo”
                const availW = Math.max(320, window.innerWidth) * 0.98;
                const availH = Math.max(240, window.innerHeight) * 0.98;

                // "fit-to-screen" (contain)
                const fitScale = Math.min(availW / baseViewport.width, availH / baseViewport.height);

                // finální scale = fit * zoom, rozumné meze
                const finalScale = Math.max(0.6, Math.min(6.0, fitScale * zoom));

                const viewport = page.getViewport({ scale: finalScale });

                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                // ostrost na TV: renderuj ve vyšším interním rozlišení
                const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); // limit 2 kvůli výkonu
                canvas.style.width = `${Math.floor(viewport.width)}px`;
                canvas.style.height = `${Math.floor(viewport.height)}px`;
                canvas.width = Math.floor(viewport.width * dpr);
                canvas.height = Math.floor(viewport.height * dpr);

                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                await page.render({ canvasContext: ctx, viewport } as any).promise;

                if (!cancelled) setLoading(false);
            } catch (e: any) {
                if (!cancelled) {
                    setErr(e?.message ?? "PDF error");
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [pdfUrl, pageNum, zoom, resizeTick]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                background: "transparent",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {err ? (
                <div style={{ padding: 24, fontSize: 24 }}>{err}</div>
            ) : (
                <canvas ref={canvasRef} />
            )}

            {/* malý overlay, ať víš kde jsi (nezabírá místo) */}
            <div
                style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    background: "rgba(0,0,0,0.55)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "8px 14px",
                    borderRadius: 18,
                    fontSize: 18,
                    pointerEvents: "none",
                    opacity: 0.95,
                }}
            >
                {loading ? "Načítám…" : `${pageNum}/${numPages}`} &nbsp;|&nbsp; zoom {Math.round(zoom * 100)}%
            </div>
        </div>
    );
}