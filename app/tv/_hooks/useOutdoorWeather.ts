"use client"

import { useEffect, useState } from "react"

export type WeatherIcon =
    | "clear"
    | "partly"
    | "cloudy"
    | "fog"
    | "drizzle"
    | "rain"
    | "snow"
    | "storm"
    | "unknown"

export type OutdoorWeather = {
    tempC: number | null
    snowDepthCm: number | null
    snowfallCm24h: number | null
    forecast: Array<{
        date: string // YYYY-MM-DD
        tMin: number | null
        tMax: number | null
        icon: WeatherIcon
    }>
    updatedAt: number // ms
}

function weatherCodeToIcon(code: number | null | undefined): WeatherIcon {
    if (code == null) return "unknown"

    // Open-Meteo weather codes (WMO) :contentReference[oaicite:1]{index=1}
    if (code === 0) return "clear"
    if (code === 1 || code === 2) return "partly"
    if (code === 3) return "cloudy"
    if (code === 45 || code === 48) return "fog"
    if (code === 51 || code === 53 || code === 55) return "drizzle"
    if (code === 61 || code === 63 || code === 65 || code === 80 || code === 81 || code === 82) return "rain"
    if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) return "snow"
    if (code === 95 || code === 96 || code === 99) return "storm"
    return "unknown"
}

function toNumberOrNull(v: unknown): number | null {
    const n = typeof v === "number" ? v : Number(v)
    return Number.isFinite(n) ? n : null
}

export function useOutdoorWeather(params: {
    lat: number
    lon: number
    timezone: string
    refreshMs?: number
}) {
    const { lat, lon, timezone, refreshMs = 10 * 60 * 1000 } = params

    const [data, setData] = useState<OutdoorWeather | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let alive = true
        let timer: number | undefined

        const load = async () => {
            try {
                setLoading(true)
                setError(null)

                // Forecast API: current + daily + hourly snow depth/snowfall :contentReference[oaicite:2]{index=2}
                const url =
                    "https://api.open-meteo.com/v1/forecast" +
                    `?latitude=${encodeURIComponent(lat)}` +
                    `&longitude=${encodeURIComponent(lon)}` +
                    `&timezone=${encodeURIComponent(timezone)}` +
                    `&current=temperature_2m` +
                    `&hourly=snow_depth,snowfall` +
                    `&daily=temperature_2m_min,temperature_2m_max,weathercode` +
                    `&forecast_days=3`

                const res = await fetch(url, { cache: "no-store" })
                if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`)

                const json = await res.json()

                const tempC = toNumberOrNull(json?.current?.temperature_2m)

                // hourly arrays
                const hourlyTime: string[] = json?.hourly?.time || []
                const hourlySnowDepth: unknown[] = json?.hourly?.snow_depth || []
                const hourlySnowfall: unknown[] = json?.hourly?.snowfall || []

                // vezmeme poslední známý snow_depth
                let snowDepthCm: number | null = null
                if (hourlySnowDepth.length) {
                    const last = hourlySnowDepth[hourlySnowDepth.length - 1]
                    // Open-Meteo snow_depth bývá v metrech (m) – převedeme na cm,
                    // ale když by to vycházelo divně, radši to jen zobrazíš jako "—".
                    const m = toNumberOrNull(last)
                    snowDepthCm = m == null ? null : Math.round(m * 100)
                }

                // snowfall je většinou v mm/h nebo cm? Open-Meteo snowfall bývá v cm. :contentReference[oaicite:3]{index=3}
                // Uděláme robustní: sečteme posledních 24 hodin (pokud máme hodinová data).
                let snowfallCm24h: number | null = null
                if (hourlyTime.length && hourlySnowfall.length === hourlyTime.length) {
                    const nowIdx = hourlyTime.length - 1
                    const fromIdx = Math.max(0, nowIdx - 24)
                    let sum = 0
                    let any = false
                    for (let i = fromIdx; i <= nowIdx; i++) {
                        const v = toNumberOrNull(hourlySnowfall[i])
                        if (v != null) {
                            sum += v
                            any = true
                        }
                    }
                    snowfallCm24h = any ? Math.round(sum * 10) / 10 : null
                }

                const dailyTime: string[] = json?.daily?.time || []
                const tMinArr: unknown[] = json?.daily?.temperature_2m_min || []
                const tMaxArr: unknown[] = json?.daily?.temperature_2m_max || []
                const codeArr: unknown[] = json?.daily?.weathercode || []

                const forecast = dailyTime.slice(0, 3).map((date, i) => {
                    const tMin = toNumberOrNull(tMinArr[i])
                    const tMax = toNumberOrNull(tMaxArr[i])
                    const code = toNumberOrNull(codeArr[i])
                    return {
                        date,
                        tMin: tMin == null ? null : Math.round(tMin),
                        tMax: tMax == null ? null : Math.round(tMax),
                        icon: weatherCodeToIcon(code),
                    }
                })

                const payload: OutdoorWeather = {
                    tempC,
                    snowDepthCm,
                    snowfallCm24h,
                    forecast,
                    updatedAt: Date.now(),
                }

                if (!alive) return
                setData(payload)
            } catch (e: any) {
                if (!alive) return
                setError(e?.message || "Weather fetch failed")
            } finally {
                if (!alive) return
                setLoading(false)
            }
        }

        load()
        timer = window.setInterval(load, refreshMs)

        return () => {
            alive = false
            if (timer) window.clearInterval(timer)
        }
    }, [lat, lon, timezone, refreshMs])

    return { data, loading, error }
}