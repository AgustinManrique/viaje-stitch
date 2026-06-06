"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stitch } from "./Stitch";
import { SpaceshipPuzzle } from "./SpaceshipPuzzle";
import { useStitchAudio } from "@/hooks/useStitchAudio";

const activityOrder = [
  "/lucia/sonido-inicial",
  "/lucia/discriminacion",
  "/lucia/trazado",
  "/lucia/silabas",
  "/lucia/palabras",
];

export function CompletionScreen({ completed }: { completed: number[] }) {
  const router = useRouter();
  const allDone = completed.length >= 5;
  const nextHref = allDone ? "/sesion" : activityOrder[completed.length];
  const speak = useStitchAudio();

  useEffect(() => {
    const msg = allDone
      ? "¡La nave está lista! ¡Reparaste la nave de Stitch!"
      : "¡Pieza conseguida! ¡Muy bien!";
    const fire = () => speak(msg);
    if (window.speechSynthesis.getVoices().length > 0) {
      fire();
    } else {
      window.speechSynthesis.onvoiceschanged = fire;
    }
  }, [allDone, speak]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 px-6"
      style={{ background: "linear-gradient(160deg, #e9d5ff 0%, #fce7f3 50%, #fef3c7 100%)" }}>

      {/* subtle sparkles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute text-2xl opacity-30 animate-float"
            style={{ top: `${(i * 41) % 90}%`, left: `${(i * 59) % 90}%`, animationDelay: `${i * 0.15}s` }}>
            ✨
          </div>
        ))}
      </div>

      <div className="relative text-center max-w-md w-full flex flex-col items-center gap-6">

        {/* Stitch — tap to repeat audio */}
        <button
          onClick={() => speak(allDone
            ? "¡La nave está lista! ¡Reparaste la nave de Stitch!"
            : "¡Pieza conseguida! ¡Muy bien!"
          )}
          className="animate-pop focus:outline-none"
          aria-label="Escuchar a Stitch"
        >
          <Stitch size={200} mood="cheer" />
          <span className="block text-3xl mt-1">🔊</span>
        </button>

        {/* stars showing progress */}
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-4xl transition-all ${i < completed.length ? "opacity-100 animate-pop" : "opacity-20"}`}>
              ⭐
            </span>
          ))}
        </div>

        {/* spaceship puzzle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 w-full shadow-lg">
          <SpaceshipPuzzle completed={completed} />
        </div>

        {/* navigation — arrow only */}
        <button
          onClick={() => router.push(nextHref)}
          className="w-full bg-yellow-300 hover:bg-yellow-400 active:scale-95 text-[#1E5F8C] rounded-2xl btn-shadow transition flex items-center justify-center"
          style={{ minHeight: "5rem" }}
          aria-label={allDone ? "Ver la nave" : "Siguiente misión"}
        >
          {allDone ? (
            <span className="text-6xl">🛸</span>
          ) : (
            <span className="text-6xl font-bold leading-none">→</span>
          )}
        </button>
      </div>
    </div>
  );
}
