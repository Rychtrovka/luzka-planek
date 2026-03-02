import React, { useEffect } from "react";
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


    const rawUrl = (videoKey && videos[videoKey]) ? videos[videoKey].url : "";

    const cleanFileName = rawUrl
        .replace("https://video.rychtrovka.cz", "")
        .replace("http://video.rychtrovka.cz", "")
        .replace("video.rychtrovka.cz/", "");

    const finalVideoSrc = cleanFileName
        ? "https://video.rychtrovka.cz" + cleanFileName
        : "";

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
            style={styles.videoPage}
            tabIndex={0}                 // 👈 aby měl wrapper focus
            ref={(el) => el?.focus()}    // 👈 focus na mount
        >
            <div style={styles.videoHeader}>
                <div style={styles.videoTitle}>
                    {videoKey ? t.tiles[videoKey] : ""}
                </div>
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
                    onTimeUpdate={(e) =>
                        setVideoTime(e.currentTarget.currentTime || 0)
                    }
                    onLoadedMetadata={(e) => {
                        setVideoDuration(e.currentTarget.duration || 0);
                        e.currentTarget.volume = 1.0;
                    }}
                    onEnded={onEnded}
                />

                <div style={styles.progressOverlay}>
                    <div style={styles.progressRow}>
                        <div style={styles.timeText}>
                            {formatTime(videoTime)}
                        </div>
                        <div style={styles.timeText}>
                            {formatTime(videoDuration)}
                        </div>
                    </div>

                    <div style={styles.progressTrack}>
                        <div
                            style={{
                                ...styles.progressFill,
                                width:
                                    videoDuration > 0
                                        ? Math.min(
                                        100,
                                        (videoTime / videoDuration) * 100
                                    ) + "%"
                                        : "0%",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}