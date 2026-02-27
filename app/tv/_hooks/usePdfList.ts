"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import { db, storage } from "../../lib/firebaseClient"

export type PdfItem = {
    id: string
    title: string
    url: string
    order: number
}

export function usePdfList(hotelId: string, kind: "pdfMenus" | "pdfTimeTables") {
    const [items, setItems] = useState<PdfItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true

        const fetchData = async () => {
            try {
                setLoading(true)

                // Oprava: 'kind' už obsahuje správný název kolekce z parametrů
                const qy = query(
                    collection(db, "hotels", hotelId, kind),
                    where("active", "==", true),
                    orderBy("order", "asc")
                )

                const snap = await getDocs(qy)
                const rows = await Promise.all(
                    snap.docs.map(async (d) => {
                        const data = d.data()
                        const url = data.storagePath
                            ? await getDownloadURL(ref(storage, data.storagePath))
                            : ""

                        return {
                            id: d.id,
                            title: data.title || d.id,
                            url,
                            order: Number(data.order || 0),
                        }
                    })
                )

                if (alive) {
                    setItems(rows.filter(x => x.url !== ""))
                }
            } catch (e) {
                console.error("PDF Load Error:", e)
                if (alive) setItems([])
            } finally {
                if (alive) setLoading(false)
            }
        }

        fetchData()
        return () => { alive = false }
    }, [hotelId, kind])

    return { items, loading }
}
