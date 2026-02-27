// app/tv/_data/types.ts

export type Lang = "cs" | "en" | "de" | "pl"

export type ForecastDay = {
    day: string
    tMin: number
    tMax: number
    label: string
}

export type WelcomeWeather = {
    tempC: number
    forecast: ForecastDay[]
}

export type WelcomeData = {
    groupName: string
    arrival: string // ISO date string (YYYY-MM-DD) nebo libovolný text
    departure: string
    messages: string[]
    weather: WelcomeWeather
}

export type Tile =
    | "weather"
    | "snow"
    | "info"
    | "story"
    | "guide"
    | "map"
    | "beer"
    | "language"


export type KioskConfig = {
    hotelId: string
    defaultLang: Lang

    location: {
        lat: number
        lon: number
        timezone: string

    }

    // obrazovky / texty na úvodní stránce
    welcome: WelcomeData

    // volitelně: URL pro externí stránky (počasí, mapa…)
    urls: {
        weather: string
        map: string
        beer: string
        snow: string
    }

    cfg: { links: {
        weather: string
        map: string
        beer: string
        snow: string
    } }


    // volitelně: lokální videa v public/media
    media: {
        storyVideoUrl: string
        guideVideoUrl: string
    }
}