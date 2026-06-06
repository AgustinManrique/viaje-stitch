"use client";
import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PuzzlePiece } from "./Stitch";

export function KidShell({
  children,
  pieces = 0,
  total = 4,
  title,
}: {
  children: React.ReactNode;
  pieces?: number;
  total?: number;
  title: string;
}) {
  const router = useRouter();
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleExit = useCallback(() => {
    tapCount.current++;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      router.push("/lucia");
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 800);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-blue-300">
      <header className="flex items-center justify-between p-4 md:px-8">
        <button
          onClick={handleExit}
          className="bg-white/60 text-[#1E5F8C]/40 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold select-none"
          aria-label="Salir (triple tap)"
        >
          ←
        </button>
        <div className="bg-white/90 px-5 py-2 rounded-full font-kid text-[#1E5F8C] text-lg">
          {title}
        </div>
        <div className="flex gap-1 bg-white/80 p-2 rounded-2xl">
          {Array.from({ length: total }).map((_, i) => (
            <PuzzlePiece key={i} filled={i < pieces} color={["#FFD93D", "#FF6B9D", "#8B5FBF", "#5BC0EB"][i % 4]} />
          ))}
        </div>
      </header>
      <main className="px-4 pb-12">{children}</main>
    </div>
  );
}
