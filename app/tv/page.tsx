"use client"

import { useEffect, useRef, useState, useMemo } from "react"

import {i18n, LangCode, nextLang} from "./_data/i18n"
import { tiles } from "./_data/tiles"
import { videos } from "./_data/videos"
import { kioskConfig } from "./_data/kioskConfig"

import { styles } from "./_styles/tvStyles"
import { useTvRemote } from "./_hooks/useTvRemote"
import { useOutdoorWeather } from "./_hooks/useOutdoorWeather"
import { useWelcomeMessages } from "./_hooks/useWelcomeMessages"

import WelcomeDashboard from "./_components/WelcomeDashboard"
import MenuScreen from "./_components/MenuScreen"
import DetailScreen from "./_components/DetailScreen"
import VideoScreen, {VideoKey} from "./_components/VideoScreen"



// Pomocné funkce mimo komponentu pro čistší tělo
const formatTime = (sec: number) => {
  const s = Math.max(0, Math.floor(sec || 0))
  const mm = String(Math.floor(s / 60)).padStart(2, "0")
  const ss = String(s % 60).padStart(2, "0")
  return `${mm}:${ss}`
}

type Screen = "WELCOME" | "MENU" | "DETAIL" | "VIDEO"
//type VideoKey = "story" | "guide" | null

export default function TVPage() {
  // --- STATE ---
  const [screen, setScreen] = useState<Screen>("WELCOME")
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [videoKey, setVideoKey] = useState<VideoKey>(null)
  const [videoTime, setVideoTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)

  // Inicializace jazyka přímo z localStorage (zabrání probliknutí defaultu)
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rychtrovka_lang") || kioskConfig.defaultLang || "cs"
    }
    return kioskConfig.defaultLang || "cs"
  })

  // --- REFS & DATA ---
  const videoRef = useRef<HTMLVideoElement>(null)
  const t = i18n[lang as keyof typeof i18n]  || i18n.cs
  const selectedTileId = tiles[focusedIndex]?.id

  const { data: outdoorWeather } = useOutdoorWeather({
    lat: kioskConfig.location.lat,
    lon: kioskConfig.location.lon,
    timezone: kioskConfig.location.timezone,
  })

/*
  const { messages } = useWelcomeMessages(
      kioskConfig.hotelId,
      kioskConfig.welcome.messages
  )
    */

  // --- MEMOIZED DATA ---
  // Transformace dat počasí, aby se nepřepočítávala při každém renderu
  const welcomeData = useMemo(() => ({
    ...kioskConfig.welcome,
    weather: outdoorWeather
        ? {
          tempC: outdoorWeather.tempC ?? kioskConfig.welcome.weather?.tempC ?? null,
          snowDepthCm: outdoorWeather.snowDepthCm ?? null,
          snowfallCm24h: outdoorWeather.snowfallCm24h ?? null,
          forecast: (outdoorWeather.forecast ?? []).slice(0, 3),
        }
        : kioskConfig.welcome.weather,
  }), [outdoorWeather])

  // --- EFFECTS ---
  // Sync jazyka do localStorage
  useEffect(() => {
    localStorage.setItem("rychtrovka_lang", lang)
  }, [lang])

  // Autoplay logika
  useEffect(() => {
    if (screen === "VIDEO" && videoRef.current) {
      videoRef.current.play().catch(() => {
        console.warn("Autoplay blocked or failed")
      })
    }
  }, [screen, videoKey])

  // --- REMOTE CONTROL ---
    useTvRemote({
        screen,
        setScreen,
        focusedIndex,
        setFocusedIndex,
        tilesLength: tiles.length,
        columns: 3,
        selectedTileId,
        // OPRAVA 1: Přetypování lang na string (pro potřeby hooku)
        lang: lang as any,
        // OPRAVA 2: Wrapper pro setLang, který zajistí, že string z hooku se uloží jako LangCode
        setLang: setLang as any,
        //  setLang: (l: string) => setLang(l as LangCode),
        // OPRAVA 3: Wrapper pro nextLang
        nextLang: (current: string) => nextLang(current as LangCode),
        setVideoKey,
        videoRef,
        setVideoTime,
        setVideoDuration,
    })

  // --- RENDER HELPERS ---
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
                //messages={messages}
            />
        )
      case "MENU":
        return (
            <MenuScreen
                t={t}
                lang={lang}
                styles={styles}
                tiles={tiles}
                focusedIndex={focusedIndex}
            />
        )
      case "DETAIL":
        return <DetailScreen t={t} styles={styles} currentTileId={selectedTileId} />
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
                  setVideoTime(0)
                  setVideoDuration(0)
                  setVideoKey(null)
                  setScreen("MENU")
                }}
            />
        )
      default:
        return null
    }
  }

  return (
      <main style={styles.container}>
        <div style={styles.overlay} />
        <div style={styles.content}>
          {renderScreen()}
        </div>
      </main>
  )
}
