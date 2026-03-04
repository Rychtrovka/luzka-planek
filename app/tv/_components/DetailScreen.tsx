"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

type Props = {
    t: {
        info: {
            title: string;
            wifi?: {
                ssid: string;
                password?: string;
                label?: string;
                qrHint?: string;
            };
            sections: { icon?: string; heading: string; text: string }[];
            quickLinksTitle?: string;
            menuPdfTitle?: string;
            menuPdfSub?: string;
            timetablePdfTitle?: string;
            timetablePdfSub?: string;
        };
        tiles?: Record<string, string>;
    };
    styles: any;
    currentTileId?: string;
};

const buildWifiQr = (ssid: string, pass: string) => {
    const esc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
    return `WIFI:T:WPA;S:${esc(ssid)};P:${esc(pass)};;`;
};

export default function DetailScreen({ t, styles, currentTileId }: Props) {
    const [qrDataUrl, setQrDataUrl] = useState("");

    const info = t.info as any;
    const wifi = info?.wifi as any;

    const qrPayload = useMemo(
        () => (wifi?.ssid ? buildWifiQr(wifi.ssid, wifi.password || "") : ""),
        [wifi]
    );

    useEffect(() => {
        let alive = true;

        if (!qrPayload) return;

        QRCode.toDataURL(qrPayload, {
            margin: 1,
            scale: 8,
            errorCorrectionLevel: "M",
        }).then((url) => {
            if (alive) setQrDataUrl(url);
        });

        return () => {
            alive = false;
        };
    }, [qrPayload]);

    if (currentTileId !== "info") {
        return (
            <div style={styles.center}>
                <h1 style={styles.title}>{t.tiles?.[currentTileId ?? ""]}</h1>
            </div>
        );
    }

    // ---------- QUICK LINKS ----------
    const links = useMemo(
        () => [
            {
                icon: "🍽️",
                title: info.menuPdfTitle || "Jídelní lístek",
                sub: info.menuPdfSub || "Otevřít nabídku",
                path: "/tv/menus",
            },
            {
                icon: "🚌",
                title: info.timetablePdfTitle || "Jízdní řády",
                sub: info.timetablePdfSub || "Autobusy / Vlaky",
                path: "/tv/timetables",
            },
        ],
        [info]
    );

    const [focused, setFocused] = useState(0);
    const refs = useRef<Array<HTMLButtonElement | null>>([]);

    const openRoute = (path: string) => {
        window.location.href = path;
    };

    // skutečný DOM focus
    useEffect(() => {
        refs.current[focused]?.focus();
    }, [focused]);

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
                window.history.back();
                return;
            }

            const isEnter =
                e.key === "Enter" ||
                e.key === "OK" ||
                e.key === "Select" ||
                e.keyCode === 13;

            if (
                e.key === "ArrowRight" ||
                e.key === "ArrowDown"
            ) {
                e.preventDefault();
                setFocused((i) => Math.min(i + 1, links.length - 1));
                return;
            }

            if (
                e.key === "ArrowLeft" ||
                e.key === "ArrowUp"
            ) {
                e.preventDefault();
                setFocused((i) => Math.max(i - 1, 0));
                return;
            }

            if (isEnter) {
                e.preventDefault();
                openRoute(links[focused].path);
            }
        };

        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [focused, links]);

    const QuickLink = ({
                           idx,
                           icon,
                           title,
                           sub,
                           path,
                       }: {
        idx: number;
        icon: string;
        title: string;
        sub: string;
        path: string;
    }) => (
        <button
            ref={(el) => (refs.current[idx] = el)}
            tabIndex={0}
            onClick={() => openRoute(path)}
            style={{
                ...cardStyles.button,
                border:
                    idx === focused
                        ? "3px solid rgba(255,255,255,0.9)"
                        : "1px solid rgba(255,255,255,0.18)",
                background:
                    idx === focused
                        ? "rgba(255,255,255,0.14)"
                        : "rgba(0,0,0,0.35)",
            }}
        >
            <div style={{ fontSize: 34 }}>{icon}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 24, fontWeight: 850 }}>
                    {title}
                </div>

                <div style={{ fontSize: 18, opacity: 0.85 }}>
                    {sub}
                </div>
            </div>
        </button>
    );

    return (
        <div style={{ ...styles.page, overflowY: "auto", paddingBottom: 40 }}>
            <h1 style={{ ...styles.header, marginBottom: 26 }}>
                {info.title}
            </h1>

            {/* WIFI */}
            {wifi?.ssid && (
                <div style={{ display: "flex", gap: 28, marginBottom: 22 }}>
                    <div style={cardStyles.glass}>
                        <div
                            style={{
                                fontSize: 30,
                                fontWeight: 850,
                                marginBottom: 10,
                            }}
                        >
                            📶 {wifi.label || "Wi-Fi"}
                        </div>

                        <div style={{ fontSize: 22, lineHeight: 1.5 }}>
                            <div>
                                <b>SSID:</b> {wifi.ssid}
                            </div>

                            <div>
                                <b>Heslo:</b>{" "}
                                {wifi.password || "(bez hesla)"}
                            </div>
                        </div>
                    </div>

                    <div style={cardStyles.qrContainer}>
                        {qrDataUrl ? (
                            <img
                                src={qrDataUrl}
                                alt="QR"
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : (
                            <div style={{ fontSize: 14, opacity: 0.5 }}>
                                Načítám...
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* QUICK LINKS */}
            <div
                style={{
                    fontSize: 20,
                    opacity: 0.85,
                    marginBottom: 12,
                }}
            >
                {info.quickLinksTitle || "Rychlé odkazy"}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 18,
                }}
            >
                <QuickLink idx={0} {...links[0]} />
                <QuickLink idx={1} {...links[1]} />
            </div>
        </div>
    );
}

const cardStyles: Record<string, React.CSSProperties> = {
    glass: {
        flex: 1,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        borderRadius: 22,
        padding: 26,
        border: "1px solid rgba(255,255,255,0.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: 180,
    },

    qrContainer: {
        width: 220,
        background: "white",
        borderRadius: 22,
        padding: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    button: {
        cursor: "pointer",
        textAlign: "left",
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        borderRadius: 20,
        padding: "18px",
        color: "white",
        display: "flex",
        gap: 14,
        alignItems: "center",
        outline: "none",
    },
};