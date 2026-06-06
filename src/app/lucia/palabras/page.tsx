"use client";
import { useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";

const words = [
  { word: "PATO", emoji: "🦆" },
  { word: "MESA", emoji: "🪑" },
  { word: "PAN",  emoji: "🍞" },
  { word: "MAPA", emoji: "🗺️" },
];
const images = [...words].reverse();

export default function Palabras() {
  const [matched,  setMatched]  = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong,    setWrong]    = useState<string | null>(null);
  const [completed, setCompleted] = useState<number[] | null>(null);

  const tapWord = (w: string) => { if (matched.includes(w)) return; setSelected(w); };
  const tapImage = (w: string) => {
    if (matched.includes(w)) return;
    if (selected === w) {
      const next = [...matched, w];
      setMatched(next);
      setSelected(null);
      if (next.length === words.length) setTimeout(() => setCompleted(markCompleted(4)), 800);
    } else if (selected) {
      setWrong(w);
      setTimeout(() => setWrong(null), 500);
    }
  };

  if (completed) return <CompletionScreen completed={completed} />;

  return (
    <KidShell title="📖 Unir con el dibujo" pieces={matched.length} total={words.length}>
      <div className="max-w-lg mx-auto text-center">
        <p className="font-kid text-white text-xl drop-shadow mb-6">Tocá una palabra y después su dibujo</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="space-y-3">
            {words.map((w) => (
              <button key={w.word} onClick={() => tapWord(w.word)}
                className={`w-full font-kid text-2xl py-4 rounded-2xl btn-shadow transition ${
                  matched.includes(w.word)  ? "bg-emerald-400 text-white"
                  : selected === w.word     ? "bg-yellow-300 text-[#1E5F8C] scale-105"
                  : "bg-white text-[#1E5F8C] hover:scale-105"
                }`}>
                {w.word}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {images.map((w) => (
              <button key={w.word} onClick={() => tapImage(w.word)}
                className={`w-full text-5xl py-3 rounded-2xl btn-shadow transition ${
                  matched.includes(w.word) ? "bg-emerald-400"
                  : wrong === w.word       ? "bg-white animate-shake"
                  : "bg-white hover:scale-105"
                }`}>
                {w.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Stitch size={110} mood={matched.length === words.length ? "cheer" : "happy"} />
        </div>
      </div>
    </KidShell>
  );
}
