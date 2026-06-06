"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Stitch } from "@/components/Stitch";
import { SpaceshipPuzzle } from "@/components/SpaceshipPuzzle";
import { getCompleted } from "@/lib/progress";

const activityOrder = [
  "/lucia/sonido-inicial",
  "/lucia/discriminacion",
  "/lucia/trazado",
  "/lucia/silabas",
  "/lucia/palabras",
];

export default function LuciaHome() {
  const router = useRouter();
  const [completed, setCompleted] = useState<number[]>([]);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allDone = completed.length >= 5;

  useEffect(() => {
    setCompleted(getCompleted());
  }, []);

  const handleExit = useCallback(() => {
    tapCount.current++;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      router.push("/sesion");
      return;
    }
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 800);
  }, [router]);

  const startNext = () => {
    const nextHref = activityOrder[completed.length] ?? "/lucia";
    router.push(nextHref);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-700 to-pink-500 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(40)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-50"
            style={{ top: `${(i * 37) % 100}%`, left: `${(i * 53) % 100}%` }} />
        ))}
        <div className="absolute top-10 right-16 text-6xl">🪐</div>
        <div className="absolute bottom-16 left-10 text-5xl opacity-60">🌙</div>
      </div>

      <button
        onClick={handleExit}
        className="absolute top-4 left-4 bg-white/10 text-white/30 w-12 h-12 rounded-full font-bold select-none z-10"
        aria-label="Salir (triple tap)"
      >←</button>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-10 text-center gap-6">
        <div className="animate-float">
          <Stitch size={160} mood={allDone ? "cheer" : "happy"} />
        </div>

        <div className="bg-white rounded-3xl px-6 py-4 max-w-xs stitch-shadow relative">
          <div className="absolute -top-3 left-10 w-6 h-6 bg-white rotate-45" />
          <p className="font-kid text-lg text-[#1E5F8C]">
            {completed.length === 0 && "¡Ayudame a reparar mi nave! 🛸"}
            {completed.length > 0 && completed.length < 5 && `¡Ya tenemos ${completed.length} pieza${completed.length > 1 ? "s" : ""}! Seguimos 💪`}
            {allDone && "¡Reparaste toda mi nave! ¡Sos la mejor! 🚀"}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 w-full max-w-xs">
          <p className="font-kid text-white text-sm mb-3">🛸 La nave de Stitch</p>
          <SpaceshipPuzzle completed={completed} />
        </div>

        {!allDone && (
          <button
            onClick={startNext}
            className="bg-yellow-300 hover:bg-yellow-400 text-[#1E5F8C] px-10 py-4 rounded-2xl font-kid text-2xl btn-shadow transition w-full max-w-xs"
          >
            {completed.length === 0 ? "¡Empezar! 🚀" : "¡Siguiente misión! →"}
          </button>
        )}

        {allDone && (
          <div className="bg-yellow-300 rounded-2xl px-8 py-4 font-kid text-2xl text-[#1E5F8C] btn-shadow">
            ¡La nave está completa! 🚀✨
          </div>
        )}
      </div>
    </div>
  );
}
