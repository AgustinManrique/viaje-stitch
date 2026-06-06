"use client";
import { useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted, getCompleted } from "@/lib/progress";

const rounds = [
  { letter: "A", correct: "Auto",   options: [{ emoji: "🌞", name: "Sol"  }, { emoji: "🚗", name: "Auto"  }, { emoji: "🌙", name: "Luna"  }] },
  { letter: "M", correct: "Mono",   options: [{ emoji: "🐒", name: "Mono" }, { emoji: "🐶", name: "Perro" }, { emoji: "🐟", name: "Pez"   }] },
  { letter: "P", correct: "Pato",   options: [{ emoji: "🍎", name: "Manzana" }, { emoji: "🌻", name: "Flor" }, { emoji: "🦆", name: "Pato" }] },
];

export default function SonidoInicial() {
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "ok" | "nope">("idle");
  const [completed, setCompleted] = useState<number[] | null>(null);

  const round = rounds[idx];
  const allDone = correct >= rounds.length;

  const choose = (name: string) => {
    if (allDone || feedback !== "idle") return;
    if (name === round.correct) {
      setFeedback("ok");
      setTimeout(() => {
        const next = correct + 1;
        setCorrect(next);
        setFeedback("idle");
        if (next >= rounds.length) {
          const updated = markCompleted(0);
          setCompleted(updated);
        } else {
          setIdx(i => i + 1);
        }
      }, 1200);
    } else {
      setFeedback("nope");
      setTimeout(() => setFeedback("idle"), 900);
    }
  };

  if (completed) return <CompletionScreen completed={completed} />;

  return (
    <KidShell title="🔊 Sonido inicial" pieces={correct} total={rounds.length}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-kid text-white text-xl drop-shadow mb-4">¿Cuál empieza con este sonido?</p>

        <button
          className="bg-yellow-300 text-[#1E5F8C] font-kid w-40 h-40 mx-auto rounded-full text-8xl btn-shadow flex items-center justify-center"
          aria-label={`Sonido ${round.letter}`}
        >
          {round.letter}
        </button>
        <p className="text-white/80 text-sm mt-2">🔉 Tocá la letra para escuchar</p>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {round.options.map((o) => (
            <button key={o.name} onClick={() => choose(o.name)}
              className="bg-white rounded-3xl p-5 btn-shadow hover:scale-105 transition aspect-square flex flex-col items-center justify-center">
              <div className="text-6xl mb-1">{o.emoji}</div>
              <div className="font-kid text-[#1E5F8C] text-sm">{o.name}</div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center min-h-[140px]">
          {feedback === "ok"   && <div className="flex flex-col items-center animate-pop"><Stitch size={120} mood="cheer" /><p className="font-kid text-xl text-yellow-300 mt-1">¡Genial! 🧩</p></div>}
          {feedback === "nope" && <div className="flex flex-col items-center animate-wiggle"><Stitch size={120} mood="happy" /><p className="font-kid text-lg text-white mt-1">¡Vos podés! 💪</p></div>}
          {feedback === "idle" && <Stitch size={120} mood="happy" />}
        </div>
      </div>
    </KidShell>
  );
}
