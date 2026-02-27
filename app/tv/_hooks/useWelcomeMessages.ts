"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../lib/firebaseClient"

type Result = {
    messages: string[]
    groupData: {
        groupName: string
        arrival: string
        departure: string
    } | null

    source: "firebase" | "fallback"
    error: string | null
}

export function useWelcomeMessages(hotelId: string, fallback: string[], fallbackGroup: any): Result {
    const [state, setState] = useState<Result>({
        messages: fallback,
        groupData: fallbackGroup,
        source: "fallback",
        error: null,
    })

    const formatFirestoreValue = (val: any): string => {
        if (!val) return "";
        // Pokud je to Firebase Timestamp (má metodu toDate)
        if (typeof val.toDate === 'function') {
            const d = val.toDate();
            return `${d.getDate()}. ${d.getMonth() + 1}.`; // Formát "27. 2."
        }
        // Pokud je to už string, vrátíme ho
        return String(val);
    };

    useEffect(() => {
        if (!hotelId) return

        const ref = doc(db, "hotels", hotelId, "kiosk/config")

        const unsub = onSnapshot(ref, (snap) => {
            if (!snap.exists()) return

            const data = snap.data() as any
            const rawMessages = data?.welcomeMessages

            // Vyčištění zpráv
            const cleanedMessages = Array.isArray(rawMessages)
                ? rawMessages.filter((x: any) => typeof x === "string").map((x: string) => x.trim()).filter(x => x.length > 0)
                : fallback

            setState({
                messages: cleanedMessages.length ? cleanedMessages : fallback,
                groupData: {
                    groupName: String(data?.groupName || fallbackGroup.groupName),
                    arrival: formatFirestoreValue(data?.arrival || fallbackGroup.arrival),
                    departure: formatFirestoreValue(data?.departure || fallbackGroup.departure),
                },
                source: "firebase",
                error: null,
            });
        })

        return () => unsub()
    }, [hotelId, fallback, fallbackGroup])

    return state
}