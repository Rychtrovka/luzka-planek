import { useEffect } from "react"
import type { TileId } from "../_data/tiles"
//import {kioskConfig} from "../_data/kioskConfig"

//import { tiles } from "../_data/tiles"
//import { useTvRemote } from "../_hooks/useTvRemote"
import { i18n } from "../_data/i18n"; // Importuj svůj objekt s překlady

const KEY_BACK = new Set(["Escape", "Backspace", "BrowserBack"])
const KEY_ENTER = new Set(["Enter", "OK", "Select"])

export function isBackKey(e: KeyboardEvent) {
  // některé TV ovladače posílají jen keyCode
  return KEY_BACK.has(e.key) || e.keyCode === 27 || e.keyCode === 8 || e.keyCode === 166
}

export function isEnterKey(e: KeyboardEvent) {
  return KEY_ENTER.has(e.key) || e.keyCode === 13
}

type Screen = "WELCOME" | "MENU" | "DETAIL" | "VIDEO"
type VideoKey = "story" | "guide" | null
// type TileId = string | undefined

type LangCode = keyof typeof i18n;

type Params = {
  screen: Screen
  setScreen: React.Dispatch<React.SetStateAction<Screen>>

  focusedIndex: number
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>
  tilesLength: number
  columns: number

  selectedTileId: TileId | undefined

  lang: LangCode
  setLang: React.Dispatch<React.SetStateAction<string>>
  nextLang: (current: string) => LangCode

  setVideoKey: React.Dispatch<React.SetStateAction<VideoKey>>
  videoRef: React.RefObject<HTMLVideoElement | null>
  setVideoTime: React.Dispatch<React.SetStateAction<number>>
  setVideoDuration: React.Dispatch<React.SetStateAction<number>>
}

export function useTvRemote({
                              screen,
                              setScreen,
                              focusedIndex,
                              setFocusedIndex,
                              tilesLength,
                              columns,
                              selectedTileId,
                              lang,
                              setLang,
                              nextLang,
                              setVideoKey,
                              videoRef,
                              setVideoTime,
                              setVideoDuration,
                            }: Params)
{
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // BACK everywhere
      if (isBackKey(e)) {
        e.preventDefault()
        e.stopPropagation()

        if (screen === "VIDEO") {
          const v = videoRef.current
          if (v) {
            try {
              v.pause()
              v.currentTime = 0
            } catch {}
          }
          setVideoTime(0)
          setVideoDuration(0)
          setVideoKey(null)
          setScreen("MENU")
          return
        }

        if (screen === "DETAIL") {
          setScreen("MENU")
          return
        }

        if (screen === "MENU") {
          setScreen("WELCOME")
          return
        }

        return
      }

      // shortcut language
      if (String(e.key).toLowerCase() === "l") {
        setLang(nextLang(lang))
        return
      }

      // WELCOME
      if (screen === "WELCOME") {
        if (isEnterKey(e)) {
          e.preventDefault()
          setScreen("MENU")
        }
        return
      }

      // VIDEO controls
      if (screen === "VIDEO") {
        const v = videoRef.current
        if (!v) return

        if (isEnterKey(e)) {
          e.preventDefault()
          if (v.paused) v.play()
          else v.pause()
          return
        }

        if (e.key === "ArrowLeft") {
          e.preventDefault()
          v.currentTime = Math.max(0, (v.currentTime || 0) - 10)
          return
        }

        if (e.key === "ArrowRight") {
          e.preventDefault()
          const dur = Number.isFinite(v.duration) ? v.duration : 0
          v.currentTime = dur
              ? Math.min(dur, (v.currentTime || 0) + 10)
              : (v.currentTime || 0) + 10
          return
        }

        return
      }

      // MENU navigation
      if (screen === "MENU") {
        if (e.key === "ArrowRight") {
          setFocusedIndex((i) => Math.min(i + 1, tilesLength - 1))
          return
        }
        if (e.key === "ArrowLeft") {
          setFocusedIndex((i) => Math.max(i - 1, 0))
          return
        }
        if (e.key === "ArrowDown") {
          setFocusedIndex((i) => Math.min(i + columns, tilesLength - 1))
          return
        }
        if (e.key === "ArrowUp") {
          setFocusedIndex((i) => Math.max(i - columns, 0))
          return
        }

        if (isEnterKey(e)) {
          e.preventDefault()

          const selected = selectedTileId
          if (!selected) return

          if (selected === "language") {
            setLang(nextLang(lang))
            return
          }

          if (selected === "story" || selected === "guide") {
            setVideoKey(selected)
            setScreen("VIDEO")
            return
          }

          if (selected === "map") {
            window.location.href = "/tv/map"
            return
          }

          if (selected === "weather") {
            window.location.href = "/tv/weather"
            return
          }

          if (selected === "beer") {
            window.location.href = "/tv/beer"
            return
          }

          if (selected === "snow") {
            window.location.href = "/tv/snow"
            return
          }

          if (selected === "info") {
            window.location.href = "/tv/info"
            return
          }

          setScreen("DETAIL")
          return
        }

        return
      }
    }

    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [
    screen,
    setScreen,
    focusedIndex,
    setFocusedIndex,
    tilesLength,
    columns,
    selectedTileId,
    lang,
    setLang,
    nextLang,
    setVideoKey,
    videoRef,
    setVideoTime,
    setVideoDuration,
  ])
}