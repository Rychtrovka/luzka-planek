"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

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
        let pdfDoc: any = null;

        const render = async () => {
            if (!pdfDoc || cancelled) return;

            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);

            await page.render({ canvasContext: ctx, viewport }).promise;
        };

        (async () => {
            try {
                setErr(null);
                setLoading(true);

                const task = pdfjsLib.getDocument({
                    url: pdfUrl,
                    // tyto volby pomáhají na některých TV webview
                    disableRange: false,
                    disableStream: false,
                });

                pdfDoc = await task.promise;
                if (cancelled) return;

                setNumPages(pdfDoc.numPages);
                setPageNum(1);

                await render();
                if (!cancelled) setLoading(false);
            } catch (e: any) {
                if (!cancelled) {
                    setErr(e?.message ?? "PDF error");
                    setLoading(false);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [pdfUrl]);

    // přerender při změně page/scale
    useEffect(() => {
        if (!pdfUrl) return;
        // hack: reload stránky renderem bez držení docu by byl složitý
        // proto to děláme tak, že držíme doc v paměti přes "window.__pdfDoc"
        // a když tam není, tak nic. (viz níž)
    }, [pageNum, scale, pdfUrl]);

    // drž doc v window a renderuj při změnách (TV-friendly)
    useEffect(() => {
        const anyWin = window as any;

        const onKeyDown = (e: KeyboardEvent) => {
            // Stránky
            if (e.key === "ArrowLeft") { e.preventDefault(); setPageNum(p => Math.max(1, p - 1)); }
            if (e.key === "ArrowRight") { e.preventDefault(); setPageNum(p => Math.min(numPages, p + 1)); }

            // Zoom
            if (e.key === "+" || e.key === "=") { e.preventDefault(); setScale(s => Math.min(3.0, Number((s + 0.2).toFixed(2)))); }
            if (e.key === "-" || e.key === "_") { e.preventDefault(); setScale(s => Math.max(0.8, Number((s - 0.2).toFixed(2)))); }

            // Back/Escape řeší Android (pošle backspace/escape -> MenusPage zavře viewer)
        };

        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [numPages]);

    // Render při změně page/scale – jednoduše znovu načti dokument (pro kiosk OK)
    // (PDFy bývají malé; pokud chceš optimalizaci, doplníme caching)
    useEffect(() => {
        if (!pdfUrl) return;
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const task = pdfjsLib.getDocument({ url: pdfUrl });
                const pdf = await task.promise;
                if (cancelled) return;

                setNumPages(pdf.numPages);

                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                canvas.width = Math.floor(viewport.width);
                canvas.height = Math.floor(viewport.height);

                await page.render({ canvasContext: ctx, viewport }).promise;
                if (!cancelled) setLoading(false);
            } catch (e: any) {
                if (!cancelled) {
                    setErr(e?.message ?? "PDF error");
                    setLoading(false);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [pdfUrl, pageNum, scale]);

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