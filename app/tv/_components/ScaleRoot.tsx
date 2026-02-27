"use client"
import React, { useEffect, useState, ReactNode } from "react"

interface ScaleRootProps {
    children: ReactNode;
}

export default function ScaleRoot({ children }: ScaleRootProps) {
    const [scale, setScale] = useState<number>(1)

    useEffect(() => {
        const recalc = (): void => {
            const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
            setScale(s)
        }

        recalc()
        window.addEventListener("resize", recalc)
        return () => window.removeEventListener("resize", recalc)
    }, [])

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
            <div
                style={{
                    width: 1920,
                    height: 1080,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                }}
            >
                {children}
            </div>
        </div>
    )
}
