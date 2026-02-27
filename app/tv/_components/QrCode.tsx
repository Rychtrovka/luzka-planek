"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

type Props = {
    value: string
    size?: number
}

export default function QrCode({ value, size = 220 }: Props) {
    const [src, setSrc] = useState<string>("")

    useEffect(() => {
        let isAlive = true

        const generateQr = async () => {
            try {
                const dataUrl = await QRCode.toDataURL(value, {
                    width: size,
                    margin: 1,
                    color: {
                        dark: "#cc2222",
                        light: "#ffffff"
                    }
                })
                if (isAlive) setSrc(dataUrl)
            } catch (err) {
                console.error("QR Generation Error:", err)
                if (isAlive) setSrc("")
            }
        }

        generateQr()
        return () => { isAlive = false }
    }, [value, size])

    if (!src) return <div style={{ width: size, height: size }} />

    return (
        <img
            src={src}
            alt="QR Code"
            style={{
                display: "block",
                width: size,
                height: size,
                borderRadius: 14,
                background: "white",
                padding: 10,
                boxSizing: "border-box"
            }}
        />
    )
}