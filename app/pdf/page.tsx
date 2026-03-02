"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useRef, useState } from "react";

export default function PdfPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [pageNum, setPageNum] = useState(1);
    const [numPages, setNumPages] = useState(1);
    const [scale, setScale] = useState(1.6);

    const pdfUrl = useMemo(() => {
        if (typeof window === "undefined") return "";
        const u = new URL(window.location.href);
        return u.searchParams.get("url") ?? "";
    }, []);

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

                // ✅ legacy build (kompatibilnější s TV WebView)
                const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
                (pdfjs as any).GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

                const task = (pdfjs as any).getDocument({ url: pdfUrl });
                const pdf = await task.promise;
                if (cancelled) return;

                setNumPages(pdf.numPages);

                const safePageNum = Math.min(Math.max(1, pageNum), pdf.numPages);
                const page = await pdf.getPage(safePageNum);

                const viewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                canvas.width = Math.floor(viewport.width);
                canvas.height = Math.floor(viewport.height);

                await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

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
    }, [pdfUrl, pageNum, scale]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); setPageNum(p => Math.max(1, p - 1)); }
            if (e.key === "ArrowRight") { e.preventDefault(); setPageNum(p => Math.min(numPages, p + 1)); }
            if (e.key === "+" || e.key === "=") { e.preventDefault(); setScale(s => Math.min(3.0, Number((s + 0.2).toFixed(2)))); }
            if (e.key === "-" || e.key === "_") { e.preventDefault(); setScale(s => Math.max(0.8, Number((s - 0.2).toFixed(2)))); }
        };

        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [numPages]);

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#000", color: "#fff", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>PDF</div>
                <div style={{ fontSize: 16 }}>
                    {err ? "Chyba" : loading ? "Načítám…" : `Strana ${pageNum}/${numPages}`} | Zoom {Math.round(scale * 100)}%
                </div>
            </div>

            <div style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                {err ? <div style={{ padding: 24 }}>{err}</div> : <canvas ref={canvasRef} />}
            </div>

            <div style={{ padding: "10px 16px", fontSize: 16, opacity: 0.9 }}>
                ←/→ stránka • +/- zoom • BACK návrat
            </div>
        </div>
    );
}