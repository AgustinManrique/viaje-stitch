"use client";
import { useEffect, useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";
import { useStitchAudio } from "@/hooks/useStitchAudio";
import { getConfig } from "@/lib/config";

export default function Discriminacion() {
  const config = getConfig();
  const { targetLetter, letters, audioPrompt } = config.discriminacion;
  const totalTargets = letters.filter(l => l.target).length;

  const [found, setFound]         = useState<number[]>([]);
  const [wrong, setWrong]         = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[] | null>(null);
  const speak = useStitchAudio();

  useEffect(() => {
    const fire = () => speak(audioPrompt ?? `Tocá todas las ${targetLetter} que veas`);
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
    <KidShell title={`🔍 Buscar la ${targetLetter}`} pieces={found.length} total={totalTargets}>
      <div className="max-w-3xl mx-auto text-center pt-4">

        {/* Target letter reminder */}
        <div className="flex justify-center mb-10">
          <div className="bg-yellow-300 text-[#1E5F8C] font-kid text-9xl w-40 h-40 rounded-2xl flex items-center justify-center btn-shadow">
            {targetLetter}
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
