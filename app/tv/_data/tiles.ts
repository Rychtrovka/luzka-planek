export const tiles = [
  { id: "weather", label: "Počasí" },
  { id: "snow", label: "Sníh" },
  { id: "info", label: "Informace" },
  { id: "story", label: "Příběh" },
  { id: "guide", label: "Průvodce" },
  { id: "map", label: "Mapa" },
  { id: "beer", label: "Pivoměr" },   // ✅ nová dlaždice
  { id: "language", label: "Jazyk" },
] as const

export type Tile = typeof tiles[number]
export type TileId = Tile["id"]