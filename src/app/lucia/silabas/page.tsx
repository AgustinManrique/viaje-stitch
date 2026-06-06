"use client";
import { useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";

const vowels = ["A", "E", "I", "O", "U"];
const consonant = "P";

export default function Silabas() {
  const [formed, setFormed]     = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [completed, setCompleted] = useState<number[] | null>(null);

  const drop = (v: string) => {
    if (formed.includes(v)) return;
    const syl = consonant + v;
    const next = [...formed, v];
    setFormed(next);
    setFeedback(syl);
    setTimeout(() => {
      setFeedback(null);
      if (next.length === vowels.length) setTimeout(() => setCompleted(markCompleted(3)), 400);
    }, 1100);
  };

  if (completed) return <CompletionScreen completed={completed} />;

  return (
    <KidShell title="🧩 Armar sílabas" pieces={formed.length} total={vowels.length}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-kid text-white text-xl drop-shadow mb-6">
          Arrastrá la <span className="bg-yellow-300 text-[#1E5F8C] px-3 py-1 rounded-xl">{consonant}</span> a cada vocal
        </p>

        <div className="flex justify-center mb-8">
          <button draggable onDragStart={() => setDragging(true)}
            onClick={() => setDragging(d => !d)}
            className={`bg-pink-400 text-white font-kid text-6xl w-28 h-28 rounded-3xl btn-shadow cursor-grab ${dragging ? "ring-4 ring-yellow-300 scale-110" : ""}`}>
            {consonant}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
          {vowels.map((v) => {
            const ok = formed.includes(v);
            return (
              <button key={v}
                onDragOver={e => e.preventDefault()} onDrop={() => drop(v)}
                onClick={() => drop(v)}
                className={`font-kid text-3xl rounded-2xl aspect-square flex items-center justify-center btn-shadow ${
                  ok ? "bg-emerald-400 text-white" : "bg-white text-[#1E5F8C] border-4 border-dashed border-white/50"
                }`}>
                {ok ? `${consonant}${v}` : v}
              </button>
            );
          })}
        </div>

        <div className="mt-8 min-h-[140px] flex justify-center">
          {feedback
            ? <div className="flex flex-col items-center animate-pop"><Stitch size={120} mood="cheer" /><p className="font-kid text-4xl text-yellow-300 drop-shadow mt-1">🔊 ¡{feedback}!</p></div>
            : <Stitch size={110} mood="happy" />
          }
        </div>
      </div>
    </KidShell>
  );
}
