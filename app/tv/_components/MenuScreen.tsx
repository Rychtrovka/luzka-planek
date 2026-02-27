import React from 'react';

interface Tile {
    readonly id: string;
    readonly icon?: string; // PŘIDÁN OTAZNÍK - icon je nyní volitelná
}

interface MenuScreenProps {
    t: {
        menuTitle: string;
        langLabel: string;
        tiles: Record<string, string>;
        language?: string; // PŘIDÁN OTAZNÍK - language je nyní volitelný
    };
    lang: string;
    tiles: readonly Tile[];
    focusedIndex: number;
    styles: Record<string, React.CSSProperties>;
}

export default function MenuScreen({ t, lang, tiles, focusedIndex, styles }: MenuScreenProps) {
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>
                {t.menuTitle} — {t.langLabel}: {lang.toUpperCase()}
            </h1>

            <div style={styles.grid}>
                {tiles.map((tile, index) => {
                    const isFocused = index === focusedIndex;

                    // Bezpečné získání labelu - pokud chybí t.tiles.language, použije se t.tiles.language (string z objektu)
                    const languageLabel = t.language || t.tiles["language"] || "Language";

                    const label = tile.id === "language"
                        ? `${languageLabel} (${lang.toUpperCase()})`
                        : t.tiles[tile.id] || tile.id;

                    return (
                        <div
                            key={tile.id}
                            style={{
                                ...styles.tile,
                                ...(isFocused ? styles.focused : {}),
                                display: "flex" as const,
                                flexDirection: "row" as const,
                                alignItems: "center" as const,
                                justifyContent: "center" as const,
                                gap: "6px",
                                padding: "10px",
                            }}
                        >
                            {/* Ikonka se vykreslí jen pokud existuje */}
                            {tile.icon && (
                                <span style={{ fontSize: "1.1em" }}>{tile.icon}</span>
                            )}

                            <div style={{
                                fontSize: "0.90em",
                                fontWeight: isFocused ? "700" : "400",
                                whiteSpace: "nowrap" as const,
                            }}>
                                {label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
