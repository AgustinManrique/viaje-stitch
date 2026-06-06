"use client";

type Cell = { icon: string; bg: string };

const PUZZLES: Record<string, Cell[]> = {
  "sonido-inicial": [
    { icon: "🌞", bg: "#FFD93D" },
    { icon: "🚗", bg: "#5BC0EB" },
    { icon: "🦆", bg: "#FF6B9D" },
  ],
  "discriminacion": [
    { icon: "M", bg: "#5BC0EB" },
    { icon: "M", bg: "#5BC0EB" },
    { icon: "M", bg: "#5BC0EB" },
  ],
  "trazado": [
    { icon: "M", bg: "#8B5FBF" },
  ],
  "silabas": [
    { icon: "PA", bg: "#FF6B9D" },
    { icon: "PE", bg: "#FF6B9D" },
    { icon: "PI", bg: "#FF6B9D" },
    { icon: "PO", bg: "#FF6B9D" },
    { icon: "PU", bg: "#FF6B9D" },
  ],
  "palabras": [
    { icon: "🦆", bg: "#FFD93D" },
    { icon: "🍽️", bg: "#5BC0EB" },
    { icon: "🌙", bg: "#8B5FBF" },
    { icon: "🗺️", bg: "#FF6B9D" },
  ],
};

export function ActivityPuzzle({
  activityKey,
  filled,
}: {
  activityKey: string;
  filled: number;
}) {
  const cells = PUZZLES[activityKey] ?? [];

  return (
    <div className="flex gap-1.5 flex-wrap justify-end max-w-[13rem]">
      {cells.map((cell, i) => {
        const earned = i < filled;
        return (
          <div
            key={i}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-kid text-sm transition-all ${
              earned
                ? "shadow-md animate-pop"
                : "border-2 border-dashed border-[#1E5F8C]/30 bg-white"
            }`}
            style={earned ? { background: cell.bg, color: "white" } : undefined}
          >
            {earned ? cell.icon : ""}
          </div>
        );
      })}
    </div>
  );
}
