"use client"

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react"
import { kioskConfig } from "../_data/kioskConfig"
import QrCode from "../_components/QrCode"
import {usePdfFolder} from "@/app/tv/_hooks/usePdfFolder";

type Lang = "cs" | "en" | "de" | "pl"

const wifiSsid = "RB_Agnes";
const wifiPassword = '76117611..';
const wifiQr = `WIFI:T:WPA;S:${wifiSsid};P:${wifiPassword};;`;



const copy: Record<Lang, { title: string; blocks: { title: string; lines: string[] }[]; hint: string; menus: string; timetables: string }> = {
    cs: {
        title: "Užitečné informace",
        hint: "Zpět = Escape / Back",
        menus: "Jídelní lístky doporučených resturací",
        timetables: "Jízdní řády místních linek" +
            "",
        blocks: [
            { title: "📶 Wi-Fi", lines: ["Síť: RB_Agnes", "Heslo: 76117611.."] },
            { title: "👨‍💼 Správce", lines: ["Telefon: 603 569 260 (6:00 - 16:00)", "E-mail: info@rychtrovka.cz"] },
            { title: "🧖 Sauna", lines: ["Saunu zatím máme rozestavěnou, zprovoznění plánujeme na léto"] },
            { title: "🌙 Noční klid", lines: ["Prosíme o klid po 22:00. Děkujeme 🙂"] },
        ],
    },
    en: {
        title: "Useful Information",
        hint: "Back = Escape / Back",
        menus: "Menu (PDF)",
        timetables: "Timetables (PDF)",
        blocks: [
            { title: "📶 Wi-Fi", lines: ["Network: RB_Agnes", "Password: 76117611.."] },
            { title: "👨‍💼 Manager", lines: ["Phone: +420 603 569 260 (6am - 4pm)", "E-mail: info@rychtrovka.cz"] },
            { title: "🧖 Sauna", lines: ["The sauna is currently under construction, opening planned for summer"] },
            { title: "🌙 Quiet Hours", lines: ["Please keep quiet after 10:00 PM. Thank you 🙂"] },
        ],
    },
    de: {
        title: "Nützliche Informationen",
        hint: "Zurück = Escape / Back",
        menus: "Speisekarten (PDF)",
        timetables: "Fahrpläne (PDF)",
        blocks: [
            { title: "📶 WLAN", lines: ["Netz: RB_Agnes", "Passwort: 76117611.."] },
            { title: "👨‍💼 Verwalter", lines: ["Telefon: +420 603 569 260 (6:00 - 16:00)", "E-Mail: info@rychtrovka.cz"] },
            { title: "🧖 Sauna", lines: ["Die Sauna ist derzeit im Bau, Eröffnung für den Sommer geplant"] },
            { title: "🌙 Nachtruhe", lines: ["Bitte um Ruhe nach 22:00 Uhr. Danke 🙂"] },
        ],
    },
    pl: {
        title: "Przydatne informacje",
        hint: "Wstecz = Escape / Back",
        menus: "Menu (PDF)",
        timetables: "Rozkłady jazdy (PDF)",
        blocks: [
            { title: "📶 Wi-Fi", lines: ["Sieć: RB_Agnes", "Hasło: 76117611.."] },
            { title: "👨‍💼 Zarządca", lines: ["Telefon: +420 603 569 260 (6:00 - 16:00)", "E-mail: info@rychtrovka.cz"] },
            { title: "🧖 Sauna", lines: ["Sauna jest obecnie w budowie, otwarcie planowane na lato"] },
            { title: "🌙 Cisza nocna", lines: ["Prosimy o ciszę po 22:00. Dziękujemy 🙂"] },
        ],
    },
}


function getLang(): Lang {
    const v = (typeof window !== "undefined" ? localStorage.getItem("rychtrovka_lang") : null) as Lang | null
    return v && (["cs", "en", "de", "pl"] as const).includes(v) ? v : "cs"
}

function openRoute(path: string) {
    // Žádné _blank, prostě změna adresy v aktuálním okně
    window.location.href = path;
}

export default function InfoPage() {
    const [lang, setLang] = useState<Lang>("cs")
    const [focus, setFocus] = useState<0 | 1>(0) // 0=menus, 1=timetables

    useEffect(() => setLang(getLang()), [])

    const t = useMemo(() => copy[lang] ?? copy.cs, [lang])
    const menus = usePdfFolder("pdf/menus")
    const timetables = usePdfFolder("pdf/timetables")

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const isBack =
                e.key === "Escape" ||
                e.key === "Backspace" ||
                e.key === "BrowserBack" ||
                e.keyCode === 27 ||
                e.keyCode === 8 ||
                e.keyCode === 166

            if (isBack) {
                e.preventDefault()
                window.history.back()
                return
            }

            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault()
                setFocus((f) => (f === 0 ? 1 : 0))
                return
            }

            const isEnter = e.key === "Enter" || e.key === "OK" || e.key === "Select" || e.keyCode === 13
            if (isEnter) {
                e.preventDefault()
                if (focus === 0) openRoute("/tv/menus")
                else openRoute("/tv/timetables")
            }
        }

        window.addEventListener("keydown", onKey, true)
        return () => window.removeEventListener("keydown", onKey, true)
    }, [focus])

    return (
        <div
            style={{
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                backgroundImage: "url('/media/rychtrovka-illustration.png')",
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
                backgroundRepeat: "no-repeat",
            }}
        >

            <img
            src="/media/RychterIS_final.png"
            alt="Logo"
            style={{
                position: "absolute" as const,
                top: 10,
                right: 10,
                zIndex: 9999,
                pointerEvents: "none" as const,
                filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
            }}
            width="180"
            />


            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.75) 100%)",
                }}
            />

            <div style={{ position: "relative", height: "100%", padding: 44, boxSizing: "border-box" }}>
                {/* HEADER */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                    <div style={{ fontSize: 46, fontWeight: 800, fontStyle: "italic", color: "#ff2222", textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>
                        ℹ️ {t.title}
                    </div>
                    <div style={{ fontSize: 18, color: "white", opacity: 0.9, textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>{t.hint}</div>
                </div>

                {/* BODY GRID */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: 18,
                        height: "calc(100% - 80px)",
                    }}
                >
                    {/* LEFT: text cards */}
                    <div
                        style={{
                            borderRadius: 24,
                            overflow: "hidden",
                            backdropFilter: "blur(3px)",
                            WebkitBackdropFilter: "blur(3px)",
                            background: "rgba(0,0,0,0.35)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
                            padding: 22,
                            display: "flex",
                            flexDirection: "column",
                            gap: 14,

                        }}
                    >
                        {t.blocks.map((b) => {
                            const isWifi = b.title.toLowerCase().includes("wi")

                            return (
                                <div
                                    key={b.title}
                                    style={{
                                        borderRadius: 18,
                                        padding: "14px 16px",
                                        background: "rgba(0,0,0,0.22)",
                                        border: "1px solid rgba(255,255,255,0.10)",
                                        display: "flex",
                                        flexDirection: isWifi ? "row" : "column",
                                        gap: isWifi ? 20 : 0,
                                        alignItems: isWifi ? "center" : "stretch",
                                        justifyContent: "space-between",

                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontSize: 22,
                                                fontWeight: 800,
                                                marginBottom: 6,
                                                color: "white",
                                            }}
                                        >
                                            {b.title}
                                        </div>

                                        {b.lines.map((ln, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    fontSize: 20,
                                                    color: "rgba(255,255,255,0.9)",
                                                    lineHeight: 1.25,
                                                    letterSpacing: "0.1em",
                                                }}
                                            >
                                                {ln}
                                            </div>
                                        ))}
                                    </div>

                                    {isWifi && (
                                        <QrCode value={wifiQr} size={150} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* RIGHT: actions + QR */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {/* action tiles */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                            <div
                                onClick={() => openRoute("/tv/menus")}
                                style={{
                                    cursor: "pointer",
                                    borderRadius: 22,
                                    padding: 18,
                                    border: focus === 0 ? "3px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.15)",
                                    background: focus === 0 ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.35)",
                                    backdropFilter: "blur(3px)",
                                    WebkitBackdropFilter: "blur(3px)",
                                    boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
                                    color: "white",
                                    userSelect: "none",
                                }}
                            >
                                <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>🍽️ {t.menus}</div>
                                <div style={{ opacity: 0.9, fontSize: 18 }}>Otevře seznam. PDF dodávají naši přátelé, nemusí být aktuální.</div>
                            </div>

                            <div
                                onClick={() => openRoute("/tv/timetables")}
                                style={{
                                    cursor: "pointer",
                                    borderRadius: 22,
                                    padding: 18,
                                    border: focus === 1 ? "3px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.15)",
                                    background: focus === 1 ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.35)",
                                    backdropFilter: "blur(3px)",
                                    WebkitBackdropFilter: "blur(3px)",
                                    boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
                                    color: "white",
                                    userSelect: "none",
                                }}
                            >
                                <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>🚌 {t.timetables}</div>
                                <div style={{ opacity: 0.9, fontSize: 18 }}>Jízdní řády přebíráme z Portálu dopravy.</div>
                            </div>
                        </div>


                        </div>
                    </div>
                </div>
            </div>

    )
}