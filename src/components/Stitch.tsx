"use client";
import Image from "next/image";

const moodImages = {
  happy: "/stitch/happy.png",
  cheer: "/stitch/think.png",
  think: "/stitch/cheer.png",
};

export function Stitch({ size = 120, mood = "happy" }: { size?: number; mood?: "happy" | "cheer" | "think" }) {
  return (
    <Image
      src={moodImages[mood]}
      alt={`Stitch ${mood === "cheer" ? "celebrando" : mood === "think" ? "pensando" : "sonriendo"}`}
      width={size}
      height={size}
      className="drop-shadow-lg object-contain"
      priority
    />
  );
}

export function PuzzlePiece({ filled, color = "#FFD93D" }: { filled: boolean; color?: string }) {
  return (
    <svg viewBox="0 0 60 60" width="48" height="48" className={filled ? "animate-pop" : "opacity-30"}>
      <path
        d="M10 10 H25 Q25 5 30 5 Q35 5 35 10 H50 V25 Q55 25 55 30 Q55 35 50 35 V50 H35 Q35 55 30 55 Q25 55 25 50 H10 V35 Q5 35 5 30 Q5 25 10 25 Z"
        fill={filled ? color : "#D1D5DB"}
        stroke="#1E5F8C"
        strokeWidth="2"
      />
    </svg>
  );
}
