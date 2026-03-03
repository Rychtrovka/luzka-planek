import React, { useEffect, useMemo, useRef, useState } from "react";
import { CSSProperties } from "react";

export type VideoKey = "story" | "guide" | null;

interface VideoScreenProps {
    t: { tiles: Record<string, string>; videoHint: string };
    styles: Record<string, CSSProperties>;
    videoKey: VideoKey;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    videos: Record<string, { url: string }>;
    videoTime: number;
    videoDuration: number;
    formatTime: (time: number) => string;
    setVideoTime: (time: number) => void;
    setVideoDuration: (time: number) => void;
    onEnded: () => void;
}

function toHttpsVideoUrl(rawUrl: string): string {
    if (!rawUrl) return "";
    let path = rawUrl
        .replace(/^https?:\/\/video\.rychtrovka\.cz/i, "")
        .replace(/^video\.rychtrovka\.cz\//i, "/");
    if (!path.startsWith("/")) path = `/${path}`;
    return `https://video.rychtrovka.cz${path}`;
}

export default function VideoScreen({
                                        t,
                                        styles,
                                        videoKey,
                                        videoRef,
                                        videos,
                                        videoTime,
                                        videoDuration,
                                        formatTime,
                                        setVideoTime,
                                        setVideoDuration,
                                        onEnded,
                                    }: VideoScreenProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [dbg, setDbg] = useState("init");

    const finalVideoSrc = useMemo(() => {
        const rawUrl = videoKey && videos[videoKey] ? videos[videoKey].url : "";
        return toHttpsVideoUrl(rawUrl);
    }, [videoKey, videos]);

    useEffect(() => {
        wrapperRef.current?.focus();
    }, []);

    // diagnostika stavu videa každých 400ms
    useEffect(() => {
        const id = window.setInterval(() => {
            const v = videoRef.current;
            if (!v) {
                setDbg("no videoRef");
                return;
            }
            const err = v.error
                ? `err(code=${v.error.code}${v.error.message ? ` msg=${v.error.message}` : ""})`
                : "err(none)";
            setDbg(
                [
                    `src=${v.currentSrc || "(empty)"}`,
                    `rs=${v.readyState}`, // 0..4
                    `ns=${v.networkState}`, // 0..3
                    `paused=${v.paused}`,
                    `ct=${Math.round(v.currentTime * 10) / 10}`,
                    err,
                ].join(" | ")
            );
        }, 400);

        return () => window.clearInterval(id);
    }, [videoRef]);

    const videoStyle: CSSProperties = {
        ...styles.video,
        maxWidth: "90%",
        maxHeight: "80vh",
        margin: "0 auto",
        display: "block",
        objectFit: "contain",
        background: "transparent",
    };

    return (
        <div
            ref={wrapperRef}
            style={{ ...styles.videoPage, outline: "none" }}
            tabIndex={0}
        >
            {/* DIAGNOSTIKA – uvidíš přímo na TV */}
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    right: 10,
                    zIndex: 99999,
                    fontSize: 14,
                    color: "#0f0",
                    background: "rgba(0,0,0,0.55)",
                    padding: "6px 10px",
                    borderRadius: 10,
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                key={String(videoKey)} | finalSrc={finalVideoSrc} | {dbg}
            </div>

            <div style={styles.videoHeader}>
                <div style={styles.videoTitle}>{videoKey ? t.tiles[videoKey] : ""}</div>
                <div style={styles.videoHint}>{t.videoHint}</div>
            </div>

            <div style={styles.videoWrap}>
                <video
                    key={finalVideoSrc}
                    ref={videoRef}
                    src={finalVideoSrc}
                    style={videoStyle}
                    controls={false}
                    playsInline
                    autoPlay
                    preload="auto"
                    onLoadedMetadata={(e) => {
                        setVideoDuration(e.currentTarget.duration || 0);
                        e.currentTarget.volume = 1.0;
                    }}
                    onTimeUpdate={(e) => setVideoTime(e.currentTarget.currentTime || 0)}
                    onEnded={onEnded}
                    onError={(e) => {
                        const v = e.currentTarget;
                        console.log("VIDEO ERROR", v.currentSrc, v.error?.code, v.error?.message);
                    }}
                />

                <div style={styles.progressOverlay}>
                    <div style={styles.progressRow}>
                        <div style={styles.timeText}>{formatTime(videoTime)}</div>
                        <div style={styles.timeText}>{formatTime(videoDuration)}</div>
                    </div>

                    <div style={styles.progressTrack}>
                        <div
                            style={{
                                ...styles.progressFill,
                                width:
                                    videoDuration > 0
                                        ? `${Math.min(100, (videoTime / videoDuration) * 100)}%`
                                        : "0%",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}