"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../lib/firebaseClient"

type Result = {
    messages: string[]
    source: "firebase" | "fallback"
    error: string | null
}

export function useWelcomeMessages(hotelId: string, fallback: string[]): Result {
    const [state, setState] = useState<Result>({
        messages: fallback,
        source: "fallback",
        error: null,
    })

    useEffect(() => {
        if (!hotelId) {
            setState({ messages: fallback, source: "fallback", error: "hotelId je prázdné" })
            return
        }

        const ref = doc(db, "kiosks", hotelId)
        console.log("[welcomeMessages] subscribe:", `kiosks/${hotelId}`)

        const unsub = onSnapshot(
            ref,
            (snap) => {
                console.log("[welcomeMessages] snapshot:", { exists: snap.exists() })

                if (!snap.exists()) {
                    setState({ messages: fallback, source: "fallback", error: "Dokument neexistuje" })
                    return
                }

                const data = snap.data() as any
                const raw = data?.welcomeMessages

                console.log("[welcomeMessages] data.welcomeMessages:", raw)

                if (!Array.isArray(raw)) {
                    setState({
                        messages: fallback,
                        source: "fallback",
                        error: "welcomeMessages není pole",
                    })
                    return
                }

                const cleaned = raw
                    .filter((x: any) => typeof x === "string")
                    .map((x: string) => x.trim())
                    .filter((x: string) => x.length > 0)

                setState({
                    messages: cleaned.length ? cleaned : fallback,
                    source: cleaned.length ? "firebase" : "fallback",
                    error: cleaned.length ? null : "Pole je prázdné (nebo jen whitespace)",
                })
            },
            (err) => {
                console.error("[welcomeMessages] onSnapshot error:", err)
                setState({ messages: fallback, source: "fallback", error: err?.message ?? "neznámá chyba" })
            }
        )

        return () => unsub()
    }, [hotelId, fallback])

    return state
}