"use client";

import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { kioskConfig } from "../_data/kioskConfig";

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

            // volitelné popisky pro meteo (když je časem chceš dát do překladů)
            meteoTitle?: string;
            meteoSub?: string;
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
        })
            .then((url) => {
                if (alive) setQrDataUrl(url);
            })
            .catch((err) => {
                console.error("QR Error:", err);
                if (alive) setQrDataUrl("");
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

    const QuickLink = ({
                           icon,
                           title,
                           sub,
                           path,
                       }: {
        icon: string;
        title: string;
        sub: string;
        path: string;
    }) => (
        <button
            type="button"
            onClick={() => {
                window.location.href = path;
            }}
            style={cardStyles.button}
        >
            <div style={{ fontSize: 34 }}>{icon}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 24, fontWeight: 850 }}>{title}</div>
                <div style={{ fontSize: 18, opacity: 0.85 }}>{sub}</div>
            </div>
        </button>
    );

    return (
        <div style={{ ...styles.page, overflowY: "auto", paddingBottom: 40 }}>
            <h1 style={{ ...styles.header, marginBottom: 26 }}>{info.title}</h1>

            {/* WIFI KARTA */}
            {wifi?.ssid && (
                <div style={{ display: "flex", gap: 28, marginBottom: 22 }}>
                    <div style={cardStyles.glass}>
                        <div style={{ fontSize: 30, fontWeight: 850, marginBottom: 10 }}>
                            📶 {wifi.label || "Wi-Fi"}
                        </div>
                        <div style={{ fontSize: 22, lineHeight: 1.5 }}>
                            <div>
                                <b>SSID:</b> {wifi.ssid}
                            </div>
                            <div>
                                <b>Heslo:</b> {wifi.password || "(bez hesla)"}
                            </div>
                        </div>
                        {wifi.qrHint && (
                            <div style={{ marginTop: 12, fontSize: 18, opacity: 0.85 }}>
                                {wifi.qrHint}
                            </div>
                        )}
                    </div>

                    <div style={cardStyles.qrContainer}>
                        {qrDataUrl ? (
                            <img
                                src={qrDataUrl}
                                alt="QR"
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : (
                            <div style={{ fontSize: 14, opacity: 0.5 }}>Načítám...</div>
                        )}
                    </div>
                </div>
            )}

            {/* RYCHLÉ ODKAZY */}
            <div style={{ fontSize: 20, opacity: 0.85, marginBottom: 12 }}>
                {info.quickLinksTitle || "Rychlé odkazy"}
            </div>

            <div style={cardStyles.linksGrid}>
                <QuickLink
                    icon="🍽️"
                    title={info.menuPdfTitle || "Jídelní lístek"}
                    sub={info.menuPdfSub || "Otevřít nabídku"}
                    path="/tv/menus"
                />

                <QuickLink
                    icon="🚌"
                    title={info.timetablePdfTitle || "Jízdní řády"}
                    sub={info.timetablePdfSub || "Autobusy / Vlaky"}
                    path="/tv/timetables"
                />

                <QuickLink
                    icon="🌤️"
                    title={info.meteoTitle || "Meteo"}
                    sub={info.meteoSub || "Počasí online"}
                    path="https://meteo.rychtrovka.cz"
                />
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
    linksGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 18,
    },
    button: {
        cursor: "pointer",
        textAlign: "left",
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        borderRadius: 20,
        padding: "18px",
        color: "green",
        display: "flex",
        gap: 14,
        alignItems: "center",
    },
};