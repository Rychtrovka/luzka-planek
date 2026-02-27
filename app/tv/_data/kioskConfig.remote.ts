// app/tv/_data/kioskConfig.remote.ts
import type { KioskConfig } from "./types"
import { kioskConfig as fallback } from "./kioskConfig"

import { doc, getDoc } from "firebase/firestore"
import { db } from "../../lib/firebaseClient"

// načte config z Firestore, když selže → vrátí lokální fallback
export async function loadKioskConfig(): Promise<KioskConfig> {
    try {
        // doporučení: dokument např. kiosks/rychtrovka
        const ref = doc(db, "kiosks", "rychtrovka")
        const snap = await getDoc(ref)

        if (!snap.exists()) return fallback

        const data = snap.data() as Partial<KioskConfig>

        // jednoduché “sloučení” – vezmeme fallback a přepíšeme tím, co přišlo z DB
        return {
            ...fallback,
            ...data,
            welcome: {
                ...fallback.welcome,
                ...(data.welcome || {}),
                weather: {
                    ...fallback.welcome.weather,
                    ...(data.welcome?.weather || {}),
                },
            },
            urls: {
                ...fallback.urls,
                ...(data.urls || {}),
            },
            media: {
                ...fallback.media,
                ...(data.media || {}),
            },
        }
    } catch (e) {
        return fallback
    }
}