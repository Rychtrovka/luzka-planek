"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { i18n, type LangCode, nextLang } from "./_data/i18n";
import { tiles } from "./_data/tiles";
import { videos } from "./_data/videos";
import { kioskConfig } from "./_data/kioskConfig";

import { styles } from "./_styles/tvStyles";
import { useTvRemote } from "./_hooks/useTvRemote";
import { useOutdoorWeather } from "./_hooks/useOutdoorWeather";

import WelcomeDashboard from "./_components/WelcomeDashboard";
import MenuScreen from "./_components/MenuScreen";
import DetailScreen from "./_components/DetailScreen";
import VideoScreen, { type VideoKey } from "./_components/VideoScreen";

type Screen = "WELCOME" | "MENU" | "DETAIL" | "VIDEO";

// Pomocné funkce mimo komponentu pro čistší tělo
const formatTime = (sec: number) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
};

export default function TVPage() {
    // --- STATE ---
    const [screen, setScreen] = useState<Screen>("WELCOME");
    const [focusedIndex, setFocusedIndex] = useState(0);

    const [videoKey, setVideoKey] = useState<VideoKey>(null);
    const [videoTime, setVideoTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);

    // Init lang z localStorage (bez probliknutí defaultu)
    const [lang, setLang] = useState<LangCode>(() => {
        if (typeof window === "undefined") return kioskConfig.defaultLang || "cs";
        return (localStorage.getItem("rychtrovka_lang") as LangCode) || kioskConfig.defaultLang || "cs";
    });

    // --- REFS & DATA ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const t = i18n[lang] ?? i18n.cs;
    const selectedTileId = tiles[focusedIndex]?.id;

    const { data: outdoorWeather } = useOutdoorWeather({
        lat: kioskConfig.location.lat,
        lon: kioskConfig.location.lon,
        timezone: kioskConfig.location.timezone,
    });

    // --- MEMOIZED DATA ---
    const welcomeData = useMemo(
        () => ({
            ...kioskConfig.welcome,
            weather: outdoorWeather
                ? {
                    tempC: outdoorWeather.tempC ?? kioskConfig.welcome.weather?.tempC ?? null,
                    snowDepthCm: outdoorWeather.snowDepthCm ?? null,
                    snowfallCm24h: outdoorWeather.snowfallCm24h ?? null,
                    forecast: (outdoorWeather.forecast ?? []).slice(0, 3),
                }
                : kioskConfig.welcome.weather,
        }),
        [outdoorWeather]
    );

    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem("rychtrovka_lang", lang);
    }, [lang]);

    useEffect(() => {
        if (screen !== "VIDEO") return;

        let alive = true;
        let tries = 0;

        const tryPlay = async () => {
            if (!alive) return;
            const v = videoRef.current;
            if (!v) {
                requestAnimationFrame(tryPlay);
                return;
            }

            // vynucení audia i když systém někdy dá volume 0
            try { v.muted = false; v.volume = 1.0; } catch {}

            try {
                await v.play();
                // úspěch
            } catch (e) {
                // některé WebView potřebují pár pokusů (focus/network)
                tries += 1;
                if (tries < 10) setTimeout(tryPlay, 250);
                else console.warn("Video play failed:", e);
            }
        };

        // malý delay po přepnutí obrazovky
        const t = setTimeout(tryPlay, 100);

        return () => {
            alive = false;
            clearTimeout(t);
        };
    }, [screen, videoKey]);

    // --- REMOTE CONTROL ---
    useTvRemote({
        screen,
        setScreen,
        focusedIndex,
        setFocusedIndex,
        tilesLength: tiles.length,
        columns: 3,
        selectedTileId,

        lang,
        setLang: (l: any) => setLang(l as LangCode), // hook ti může poslat string
        nextLang: (current: string) => nextLang(current as LangCode),

        setVideoKey,
        videoRef,
        setVideoTime,
        setVideoDuration,
    });

    // --- RENDER ---
    const renderScreen = () => {
        switch (screen) {
            case "WELCOME":
                return (
                    <WelcomeDashboard
                        t={t}
                        lang={lang}
                        hotelId="rychtrovka"
                        styles={styles}
                        welcome={welcomeData}
                    />
                );

            case "MENU":
                return (
                    <MenuScreen
                        t={t}
                        lang={lang}
                        styles={styles}
                        tiles={tiles}
                        focusedIndex={focusedIndex}
                    />
                );

            case "DETAIL":
                return <DetailScreen t={t} styles={styles} currentTileId={selectedTileId} />;

            case "VIDEO":
                return (
                    <VideoScreen
                        t={t}
                        styles={styles}
                        videoKey={videoKey}
                        videoRef={videoRef}
                        videos={videos}
                        videoTime={videoTime}
                        videoDuration={videoDuration}
                        formatTime={formatTime}
                        setVideoTime={setVideoTime}
                        setVideoDuration={setVideoDuration}
                        onEnded={() => {
                            setVideoTime(0);
                            setVideoDuration(0);
                            setVideoKey(null);
                            setScreen("MENU");
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div style={styles.wrapper}>
            <img
                src="/media/RychterIS_final.png"
                alt="Logo"
                style={styles.logo}
                width="180"
            />

            <main style={styles.container}>
                <div style={styles.overlay} />
                <div style={styles.content}>{renderScreen()}</div>
            </main>
        </div>
    );
}