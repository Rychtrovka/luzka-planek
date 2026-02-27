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

        if (val && typeof val.toDate === 'function') {
            const d = val.toDate();
            const den = d.getDate();
            const mesic = d.getMonth() + 1;
            const rok = d.getFullYear() + 1;
            const hodiny = d.getHours();
            // Zajistíme, aby minuty měly vždy dvě cifry (např. 14:05 místo 14:5)
            const minuty = String(d.getMinutes()).padStart(2, '0');

            // Výsledek: "27. 2. 14:05"
            return `${den}. ${mesic}.${rok}  / ${hodiny}:${minuty}`;
        }

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