"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../lib/firebaseClient" // uprav import pokud máš jinde

type FireWelcome = {
    groupName?: string
    arrival?: string
    departure?: string
}

type FireConfig = {
    welcome?: FireWelcome
}

export function useKioskConfig(hotelId: string) {
    const [data, setData] = useState<FireConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<unknown>(null)

    useEffect(() => {
        if (!hotelId) return

        // /hotels/rychtrovka/kiosk/config
        const ref = doc(db, "hotels", hotelId, "kiosk", "config")

        const unsub = onSnapshot(
            ref,
            (snap) => {
                setLoading(false)
                if (!snap.exists()) {
                    setData(null)
                    return
                }
                setData(snap.data() as FireConfig)
            },
            (err) => {
                setLoading(false)
                setError(err)
            }
        )

        return () => unsub()
    }, [hotelId])

    return { data, loading, error }
}