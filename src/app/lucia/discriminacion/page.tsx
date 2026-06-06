"use client";
import { useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";

const letters = [
  { id: 0, ch: "M", x: 12, y: 15, target: true  },
  { id: 1, ch: "N", x: 65, y: 10, target: false },
  { id: 2, ch: "M", x: 40, y: 40, target: true  },
  { id: 3, ch: "N", x: 15, y: 65, target: false },
  { id: 4, ch: "M", x: 72, y: 58, target: true  },
  { id: 5, ch: "N", x: 48, y: 75, target: false },
];
const totalTargets = letters.filter(l => l.target).length;

export default function Discriminacion() {
  const [found, setFound]       = useState<number[]>([]);
  const [wrong, setWrong]       = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[] | null>(null);

  const tap = (id: number, target: boolean) => {
    if (found.includes(id)) return;
    if (target) {
      const next = [...found, id];
      setFound(next);
      if (next.length === totalTargets) {
        setTimeout(() => setCompleted(markCompleted(1)), 800);
      }
    } else {
      setWrong(id);
      setTimeout(() => setWrong(null), 500);
    }
  };

  if (completed) return <CompletionScreen completed={completed} />;

  return (
    <KidShell title="🔍 Buscar la M" pieces={found.length} total={totalTargets}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-kid text-white text-xl drop-shadow mb-4">
          Tocá todas las <span className="bg-yellow-300 text-[#1E5F8C] px-3 py-1 rounded-xl">M</span> que veas
        </p>
        <div className="relative bg-white rounded-3xl mx-auto stitch-shadow" style={{ height: 380 }}>
          {letters.map((l) => (
            <button key={l.id} onClick={() => tap(l.id, l.target)}
              className={`absolute font-kid text-6xl transition select-none ${
                found.includes(l.id) ? "text-emerald-500 ring-4 ring-emerald-400 ring-offset-2 rounded-full animate-pop"
                : wrong === l.id     ? "text-rose-300 animate-shake"
                : "text-[#1E5F8C] hover:scale-110"
              }`}
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
              aria-label={`Letra ${l.ch}`}
            >{l.ch}</button>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Stitch size={110} mood={found.length === totalTargets ? "cheer" : "think"} />
        </div>
      </div>
    </KidShell>
  );
}
