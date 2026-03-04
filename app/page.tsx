"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [tick, setTick] = useState(0);
    const didNav = useRef(false);

    useEffect(() => {
        // malý "boot" delay, aby uživatel viděl hezkou obrazovku
        const navTimer = window.setTimeout(() => {
            if (didNav.current) return;
            didNav.current = true;
            router.replace("/tv");
        }, 700);

        // jen kosmetika: tři tečky / timer
        const uiTimer = window.setInterval(() => setTick((t) => t + 1), 400);

        // BEZPEČNĚ: refresh jen pokud by někdo zůstal na "/"
        const refreshInterval = window.setInterval(() => {
            if (window.location.pathname === "/") {
                // tvrdý refresh (vymaže runtime stav)
                window.location.href = "/";
            }
        }, 12 * 60 * 1000); // 12 minut

        return () => {
            window.clearTimeout(navTimer);
            window.clearInterval(uiTimer);
            window.clearInterval(refreshInterval);
        };
    }, [router]);

    const dots = ".".repeat((tick % 3) + 1);

    return (
        <main
            style={{
                height: "100vh",
                background: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* jemná textura / glow */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at 50% 40%, rgba(255,34,34,0.18), rgba(0,0,0,0) 55%)",
                    opacity: 1,
                    pointerEvents: "none",
                }}
            />

            <div style={{ textAlign: "center", padding: 48 }}>
                <div
                    style={{
                        fontSize: 54,
                        fontWeight: 900,
                        color: "#ff2222",
                        letterSpacing: "0.04em",
                        textShadow: "0 6px 22px rgba(0,0,0,0.75)",
                        marginBottom: 14,
                    }}
                >
                    RychterIS TV
                </div>

                <div
                    style={{
                        fontSize: 22,
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: "0.08em",
                        marginBottom: 26,
                    }}
                >
                    Inicializace systému{dots}
                </div>

                <div
                    style={{
                        width: 520,
                        height: 10,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.12)",
                        overflow: "hidden",
                        margin: "0 auto",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.55)",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${20 + ((tick * 13) % 80)}%`,
                            background: "#ff2222",
                            borderRadius: 999,
                            transition: "width 0.35s ease",
                        }}
                    />
                </div>

                <div
                    style={{
                        marginTop: 18,
                        fontSize: 16,
                        color: "rgba(255,255,255,0.55)",
                    }}
                >
                    Připravuji rozhraní…
                </div>
            </div>
        </main>
    );
}