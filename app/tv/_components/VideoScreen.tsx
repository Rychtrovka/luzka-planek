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

    // ✅ přidej: co se má stát při Back/Escape
    onBack: () => void;
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
                                        onBack,
                                    }: VideoScreenProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const finalVideoSrc = useMemo(() => {
        const rawUrl = videoKey && videos[videoKey] ? videos[videoKey].url : "";

        const cleanFileName = rawUrl
            .replace("https://video.rychtrovka.cz", "")
            .replace("http://video.rychtrovka.cz", "")
            .replace("video.rychtrovka.cz/", "");

        return cleanFileName ? "https://video.rychtrovka.cz" + cleanFileName : "";
    }, [videoKey, videos]);

    // ✅ focus na wrapper (spolehlivě, ne přes ref callback)
    useEffect(() => {
        wrapperRef.current?.focus();
    }, []);

    // ✅ Backspace / Escape / BrowserBack -> návrat na předchozí obrazovku
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const isBack =
                e.key === "Escape" ||
                e.key === "Backspace" ||
                e.key === "BrowserBack" ||
                e.key === "Back" ||
                e.keyCode === 27 ||
                e.keyCode === 8 ||
                e.keyCode === 166;

            if (!isBack) return;

            e.preventDefault();
            e.stopPropagation();

            // zastav video (ať neběží na pozadí)
            const v = videoRef.current;
            if (v) {
                try {
                    v.pause();
                    v.currentTime = 0;
                } catch {}
            }
            setVideoTime(0);
            setVideoDuration(0);

            onBack();
        };

        window.addEventListener("keydown", onKeyDown, true); // capture = true
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [onBack, setVideoDuration, setVideoTime, videoRef]);

    const videoStyle: CSSProperties = {
        ...styles.video,
        maxWidth: "90%",
        maxHeight: "80vh",
        margin: "0 auto",
        display: "block",
        objectFit: "contain",
    };

    return (
        <div
            ref={wrapperRef}
            style={styles.videoPage}
            tabIndex={0} // aby šel fokus
        >
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