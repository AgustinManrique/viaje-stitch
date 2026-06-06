"use client";
import { useEffect, useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";
import { useStitchAudio } from "@/hooks/useStitchAudio";

// Distractors use T and G — clearly different from M visually and phonetically
const letters = [
  { id: 0, ch: "M", x: 12, y: 12, target: true  },
  { id: 1, ch: "T", x: 62, y: 8,  target: false },
  { id: 2, ch: "M", x: 38, y: 38, target: true  },
  { id: 3, ch: "G", x: 14, y: 62, target: false },
  { id: 4, ch: "M", x: 70, y: 55, target: true  },
  { id: 5, ch: "T", x: 46, y: 72, target: false },
  { id: 6, ch: "G", x: 78, y: 25, target: false },
];
const totalTargets = letters.filter(l => l.target).length;

export default function Discriminacion() {
  const [found, setFound]         = useState<number[]>([]);
  const [wrong, setWrong]         = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[] | null>(null);
  const speak = useStitchAudio();

  useEffect(() => {
    const fire = () => speak("Tocá todas las M que veas");
    if (window.speechSynthesis.getVoices().length > 0) fire();
    else window.speechSynthesis.onvoiceschanged = fire;
  }, [speak]);

  const tap = (id: number, target: boolean) => {
    if (found.includes(id)) return;
    if (target) {
      speak("¡Bien!");
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
      <div className="max-w-3xl mx-auto text-center pt-4">

        {/* Target letter reminder */}
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-300 text-[#1E5F8C] font-kid text-5xl w-20 h-20 rounded-2xl flex items-center justify-center btn-shadow">
            M
          </div>
        </div>

        {/* Letter board */}
        <div className="relative bg-white rounded-3xl mx-auto shadow-lg" style={{ height: 380 }}>
          {letters.map((l) => (
            <button key={l.id} onClick={() => tap(l.id, l.target)}
              className={`absolute font-kid text-7xl transition select-none ${
                found.includes(l.id)
                  ? "text-emerald-500 ring-4 ring-emerald-400 ring-offset-2 rounded-full animate-pop"
                  : wrong === l.id
                    ? "text-rose-400 animate-shake"
                    : l.target
                      ? "text-[#1E5F8C] hover:scale-110"
                      : "text-[#1E5F8C]/70 hover:scale-110"
              }`}
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
              aria-label={`Letra ${l.ch}`}
            >{l.ch}</button>
          ))}
        </div>

        {/* Stitch */}
        <div className="mt-6 flex justify-center">
          <Stitch size={150} mood={found.length === totalTargets ? "cheer" : "think"} />
        </div>
      </div>
    </KidShell>
  );
}
