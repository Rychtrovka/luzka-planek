import React, { useEffect, useMemo, useRef } from "react";
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

    // udělá z různých variant vždy https://video.rychtrovka.cz/...
    const cleaned = rawUrl
        .replace(/^https?:\/\/video\.rychtrovka\.cz/i, "")
        .replace(/^video\.rychtrovka\.cz\//i, "/");

    return cleaned ? `https://video.rychtrovka.cz${cleaned.startsWith("/") ? "" : "/"}${cleaned.replace(/^\//, "")}` : "";
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

    const finalVideoSrc = useMemo(() => {
        const rawUrl = videoKey && videos[videoKey] ? videos[videoKey].url : "";
        return toHttpsVideoUrl(rawUrl);
    }, [videoKey, videos]);

    useEffect(() => {
        wrapperRef.current?.focus();
    }, []);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        v.addEventListener("error", (e) => {
            console.error("VIDEO ERROR", v.error);
        });

        v.addEventListener("play", () => console.log("VIDEO PLAY"));
        v.addEventListener("playing", () => console.log("VIDEO PLAYING"));
        v.addEventListener("stalled", () => console.log("VIDEO STALLED"));
        v.addEventListener("waiting", () => console.log("VIDEO WAITING"));
    }, []);

    const videoStyle: CSSProperties = {
        ...styles.video,
        maxWidth: "90%",
        maxHeight: "80vh",
        margin: "0 auto",
        display: "block",
        objectFit: "contain",
    };

    return (
        <div ref={wrapperRef} style={styles.videoPage} tabIndex={0}>
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
                    crossOrigin="anonymous"
                    autoPlay
                    preload="auto"
                    onTimeUpdate={(e) => setVideoTime(e.currentTarget.currentTime || 0)}
                    onLoadedMetadata={(e) => {
                        setVideoDuration(e.currentTarget.duration || 0);
                        e.currentTarget.volume = 1.0;
                    }}
                    onEnded={onEnded}
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