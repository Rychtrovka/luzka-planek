// app/api/tv/weather/route.ts
import { NextResponse } from "next/server"

type ForecastItem = { day: string; tMin: number; tMax: number; icon: string; code: number }

function iconFromWmo(code: number): string {
    // WMO weather interpretation codes (Open-Meteo)
    // jednoduché emoji mapování
    if (code === 0) return "☀️"
    if (code === 1) return "🌤️"
    if (code === 2) return "⛅"
    if (code === 3) return "☁️"
    if (code === 45 || code === 48) return "🌫️"
    if (code >= 51 && code <= 57) return "🌦️"
    if (code >= 61 && code <= 67) return "🌧️"
    if (code >= 71 && code <= 77) return "🌨️"
    if (code >= 80 && code <= 82) return "🌧️"
    if (code === 85 || code === 86) return "🌨️"
    if (code === 95) return "⛈️"
    if (code === 96 || code === 99) return "⛈️"
    return "❓"
}

function dayLabel(i: number) {
    if (i === 0) return "Dnes"
    if (i === 1) return "Zítra"
    return "Pozítří"
}

// Benecko (Rychtrovka je v oblasti Benecka). Souřadnice můžeš kdykoliv upravit.
const DEFAULT_LAT = 50.6661 // ~ 50°39'58" N :contentReference[oaicite:1]{index=1}
const DEFAULT_LON = 15.5481 // ~ 15°32'53" E :contentReference[oaicite:2]{index=2}

export async function GET() {
    try {
        const lat = DEFAULT_LAT
        const lon = DEFAULT_LON

        // Open-Meteo: hourly teplota + snow_depth + weather_code, daily min/max + weather_code
        // snow_depth bývá v metrech (podle modelu); převádíme na cm
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat}&longitude=${lon}` +
            `&hourly=temperature_2m,snow_depth,weather_code` +
            `&daily=temperature_2m_min,temperature_2m_max,weather_code` +
            `&timezone=Europe%2FPrague&forecast_days=3`

        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`)
        const data = await res.json()

        const tempNow = Number(data?.hourly?.temperature_2m?.[0])
        const snowDepthM = Number(data?.hourly?.snow_depth?.[0])
        const snowCm = Number.isFinite(snowDepthM) ? Math.round(snowDepthM * 100) : null

        const dailyMin: number[] = data?.daily?.temperature_2m_min ?? []
        const dailyMax: number[] = data?.daily?.temperature_2m_max ?? []
        const dailyCode: number[] = data?.daily?.weather_code ?? []

        const forecast: ForecastItem[] = [0, 1, 2].map((i) => {
            const tMin = Number(dailyMin?.[i])
            const tMax = Number(dailyMax?.[i])
            const code = Number(dailyCode?.[i])
            return {
                day: dayLabel(i),
                tMin: Number.isFinite(tMin) ? Math.round(tMin) : NaN,
                tMax: Number.isFinite(tMax) ? Math.round(tMax) : NaN,
                code: Number.isFinite(code) ? code : -1,
                icon: Number.isFinite(code) ? iconFromWmo(code) : "❓",
            }
        })

        return NextResponse.json({
            ok: true,
            tempC: Number.isFinite(tempNow) ? Math.round(tempNow) : null,
            snowCm,
            forecast,
        })
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: e?.message ?? "weather fetch failed" },
            { status: 200 }
        )
    }
}