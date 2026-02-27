"use client"

import { useEffect, useState } from "react"
import { getDownloadURL, listAll, ref } from "firebase/storage"
import { storage } from "../../lib/firebaseClient" // uprav cestu podle toho, kde máš firebaseClient

export type PdfItem = { name: string; url: string }

export function usePdfFolder(path: string) {
    const [items, setItems] = useState<PdfItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let alive = true

        async function load() {
            try {
                setLoading(true)
                setError(null)

                const folderRef = ref(storage, path) // např. "pdf/menus"
                const res = await listAll(folderRef)

                const out = await Promise.all(
                    res.items.map(async (it) => ({
                        name: it.name,
                        url: await getDownloadURL(it),
                    }))
                )

                out.sort((a, b) => a.name.localeCompare(b.name, "cs"))

                if (alive) setItems(out)
            } catch (e: any) {
                if (alive) setError(e?.message ?? String(e))
            } finally {
                if (alive) setLoading(false)
            }
        }

        load()
        return () => {
            alive = false
        }
    }, [path])

    return { items, loading, error }
}