"use client";
import { useRouter } from "next/navigation";
import { Stitch } from "./Stitch";
import { SpaceshipPuzzle } from "./SpaceshipPuzzle";

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
  const nextIndex = completed.length; // next pieceId = next index
  const nextHref = allDone ? "/lucia" : activityOrder[nextIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-700 to-pink-500 flex flex-col items-center justify-center z-50 px-6">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{ top: `${(i * 41) % 100}%`, left: `${(i * 59) % 100}%` }} />
        ))}
      </div>

      <div className="relative text-center max-w-md w-full">
        <div className="animate-pop flex justify-center mb-2">
          <Stitch size={160} mood="cheer" />
        </div>

        <p className="font-kid text-3xl text-yellow-300 drop-shadow mb-1">
          {allDone ? "¡La nave está lista!" : "¡Pieza conseguida!"}
        </p>
        <p className="text-white/80 mb-6 text-lg">
          {allDone ? "¡Reparaste la nave de Stitch! 🚀" : `${completed.length} de 5 piezas`}
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 mb-8">
          <SpaceshipPuzzle completed={completed} />
        </div>

        <button
          onClick={() => router.push(nextHref)}
          className="w-full bg-yellow-300 hover:bg-yellow-400 text-[#1E5F8C] px-8 py-4 rounded-2xl font-kid text-2xl btn-shadow transition"
        >
          {allDone ? "¡Ver la nave! 🛸" : "Siguiente misión →"}
        </button>
      </div>
    </div>
  );
}
