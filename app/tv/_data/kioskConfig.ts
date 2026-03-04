// app/tv/_data/kioskConfig.ts
import type { KioskConfig } from "./types"

export const kioskConfig: KioskConfig = {
    hotelId: "rychtrovka",
    defaultLang: "cs",

   cfg: {
       links: {
           weather: "https://weewx.rychtrovka.cz/ss/",
           map: "https://intmap.holidayinfo.cz/webmap.php?lang=cs&mapname=benecko&servicecode=1234",
           beer: "https://192.168.0.25/dashboard",
           snow: "https://embed.windy.com/embed2.html?lat=50.6647602554353 &lon=15.55067082439214 &detailLat=50.6647602554353 &detailLon=15.550&width=1920&height=1080&zoom=30&level=surface&overlay=snowcover&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=kmh&metricTemp=%C2%B0C&radarRange=-1"
       },
   },

    location: {
        // Benecko / Rychtrovka (doladíš kdykoliv)
        lat: 50.6647602554353,
        lon: 15.550670824392142,
        timezone: "Europe/Prague",
    },

    welcome: {
        groupName: "načítá se...",
        arrival: "...",
        departure: "...",

        weather: {
            tempC: 0.0,
            forecast: [
                {day: "--", tMin: 0, tMax: 0, label: "sněžení"},
                {day: "--", tMin: 0, tMax: 0, label: "polojasno"},
                {day: "--", tMin: 0, tMax: 0, label: "jasno"},
            ],
        },
        messages: ["načítá se..."]
    },

    urls: {
        weather: "https://weewx.rychtrovka.cz/ss/",
        map: "https://intmap.holidayinfo.cz/webmap.php?lang=cs&mapname=benecko&servicecode=1234",
        beer: "http://192.168.0.25/dashboard",
        // ✅ snow map (Windy embed) – Benecko / Rychtrovka přibližně
        snow: "https://embed.windy.com/embed2.html?lat=50.6647602554353 &lon=15.55067082439214 &detailLat=50.6647602554353 &detailLon=15.550&width=1920&height=1080&zoom=30&level=surface&overlay=snowcover&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=kmh&metricTemp=%C2%B0C&radarRange=-1",
        //menuPdf: "https://tv.rychtrovka.cz/pdf/jidelni-listek.pdf",
        //timetablePdf: "https://tv.rychtrovka.cz/pdf/jizdni-rady.pdf",
    },

    media: {
        storyVideoUrl: "/media/story.mp4",
        guideVideoUrl: "/media/guide.mp4",
    },
} as const