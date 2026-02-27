"use client"

import React from "react"

type WeatherIcon =

    | "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm" | "unknown"

const iconToEmoji: Record<WeatherIcon, string> = {
    clear: "☀️", partly: "⛅", cloudy: "☁️", fog: "🌫️", drizzle: "🌦️", rain: "🌧️", snow: "🌨️", storm: "⛈️", unknown: "❔",
}

type ForecastDay = {
    day?: string
    date?: string
    tMin?: number | null
    tMax?: number | null
    label?: string
    icon?: WeatherIcon
}

type WelcomeData = {
    groupName: string
    arrival: string
    departure: string
    weather?: {
        tempC?: number | null
        snowDepthCm?: number | null
        snowfallCm24h?: number | null
        forecast?: ForecastDay[]
    }
}

type Props = {
    t: {
        welcomeTitle: string
        langLabel: string
        welcomeHint: string
        adminMessages: string      // "Zprávy od správce"
        noMessages: string         // "Zatím žádné zprávy"
        receptionUpdate: string    // "Aktualizace z recepce"
        groupLabel: string         // "Skupina"
        arrivalLabel: string       // "Příjezd"
        departureLabel: string     // "Odjezd"
        weatherTitle: string       // "Počasí venku"
        snowLabel: string          // "Sníh"
        today: string              // "Dnes"
        tomorrow: string           // "Zítra"
        // ... a další klíče co už máš
    }
    lang: string
    styles: any
    welcome: WelcomeData
    messages?: string[]
}

function formatDay(dateIso: string) {
    return dateIso.slice(5) // MM-DD
}

export default function WelcomeDashboard({ t, lang, styles, welcome, messages }: Props) {
    const safeMessages: string[] = Array.isArray(messages) ? messages : []
    const forecast = welcome?.weather?.forecast ?? []

    const temp = typeof welcome?.weather?.tempC === "number" ? welcome.weather.tempC : null
    const snowDepth = typeof welcome?.weather?.snowDepthCm === "number" ? welcome.weather.snowDepthCm : null
    const snowfall24 = typeof welcome?.weather?.snowfallCm24h === "number" ? welcome.weather.snowfallCm24h : null

    return (
        <div style={styles.welcomeWrap}>
            <div style={styles.welcomeHeader}>
                <h1 style={styles.title} suppressHydrationWarning>{t.welcomeTitle} </h1>
                <div style={styles.welcomeMetaRow}>
                    <div style={styles.meta}>{t.langLabel}: {String(lang).toUpperCase()}</div>
                    <div style={styles.subtitle}>{t.welcomeHint}</div>
                </div>
            </div>

            <div style={{ ...styles.welcomeGrid, gridTemplateColumns: "2fr 1fr", gridAutoRows: "minmax(220px, auto)" }}>

                {/* ZPRÁVY */}
                <div style={{ ...styles.wBox, gridColumn: "1 / 2", gridRow: "1 / span 2", minHeight: 520, display: "flex", flexDirection: "column" }}>
                    <div style={styles.wBoxTitle}>{t.adminMessages}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingRight: 6, flex: 1, marginTop: 10 }}>
                        {safeMessages.length ? (
                            safeMessages.map((msg, idx) => (
                                <div key={idx} style={{ background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: "12px 14px", fontSize: 22, fontWeight: 650 }}>
                                    {msg}
                                </div>
                            ))
                        ) : (
                            <div style={{ opacity: 0.75, fontSize: 20 }}>{t.noMessages}</div>
                        )}
                    </div>
                    <div style={styles.wBoxHint}>{t.receptionUpdate}</div>
                </div>

                {/* SKUPINA */}
                <div style={{ ...styles.wBox, gridColumn: "2 / 3", gridRow: "1 / 2" }}>
                    <div style={styles.wBoxTitle}>{t.groupLabel}</div>
                    <div style={styles.wBoxBig}>{welcome.groupName}</div>
                    <div style={styles.wBoxRow}>
                        <div>
                            <div style={styles.wBoxLabel}>{t.arrivalLabel}</div>
                            <div style={styles.wBoxValue}>{welcome.arrival}</div>
                        </div>
                        <div>
                            <div style={styles.wBoxLabel}>{t.departureLabel}</div>
                            <div style={styles.wBoxValue}>{welcome.departure}</div>
                        </div>
                    </div>
                </div>

                {/* POČASÍ */}
                <div style={{ ...styles.wBox, gridColumn: "2 / 3", gridRow: "2 / 3" }}>
                    <div style={styles.wBoxTitle}>{t.weatherTitle}</div>
                    <div style={styles.wTempRow}>
                        <div style={styles.wTemp}>{temp !== null ? `${temp}°C` : "—"}</div>
                        <div style={styles.wTempSub}>
                            {snowDepth !== null ? `${t.snowLabel}: ${snowDepth} cm` : "Rychtrova bouda"}
                            {snowfall24 !== null ? `  •  24h: +${snowfall24} cm` : ""}
                        </div>
                    </div>

                    <div style={styles.wForecast}>
                        {forecast.length ? (
                            forecast.slice(0, 3).map((d, idx) => {
                                // Internacionalizace Dnes / Zítra
                                const labelDay = d.day ?? (d.date ? (idx === 0 ? t.today : idx === 1 ? t.tomorrow : formatDay(d.date)) : `+${idx}`)
                                const emoji = iconToEmoji[d.icon ?? "unknown"]

                                return (
                                    <div key={idx} style={styles.wForecastItem}>
                                        <div style={styles.wForecastDay}>{labelDay}</div>
                                        <div style={{ fontSize: 26, marginTop: 2 }}>{emoji}</div>
                                        <div style={styles.wForecastNums}>{(d.tMin ?? "—")} / {(d.tMax ?? "—")} °C</div>
                                        {d.label && <div style={styles.wForecastLabel}>{d.label}</div>}
                                    </div>
                                )
                            })
                        ) : (
                            <div style={{ opacity: 0.75, fontSize: 18 }}>—</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
