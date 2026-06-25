"use client";
import { useEffect, useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";
import { useStitchAudio } from "@/hooks/useStitchAudio";
import { getConfig } from "@/lib/config";

export default function SonidoInicial() {
  const config = getConfig();
  const rounds = config.sonidoInicial.rounds;
  const roundAudios = rounds.map(r => r.audioPrompt ?? `¿Cuál empieza con ${r.letter}?`);

  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "ok" | "nope">("idle");
  const [completed, setCompleted] = useState<number[] | null>(null);
  const speak = useStitchAudio();

  const round = rounds[idx];
  const allDone = correct >= rounds.length;
  const playRoundAudio = () => {
  if (roundAudios[idx].includes("¿Cuál empieza con M?")) {
    const audio = new Audio("/sonido-m.mp3");
    audio.play();
  } else {
    speak(roundAudios[idx]);
  }
};
  useEffect(() => {
    const fire = playRoundAudio;
    if (window.speechSynthesis.getVoices().length > 0) fire();
    else window.speechSynthesis.onvoiceschanged = fire;
  }, [idx, speak]);

  const choose = (name: string) => {
    if (allDone || feedback !== "idle") return;
    if (name.toLowerCase() === round.correct.toLowerCase()) {
      speak("¡Muy bien!");
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
      speak("¡Vos podés!");
      setFeedback("nope");
      setTimeout(() => setFeedback("idle"), 900);
    }
  };

  if (completed) return <CompletionScreen completed={completed} />;

  return (
    <KidShell title="🔊 Sonido inicial" pieces={correct} total={rounds.length}>
      <div className="max-w-3xl mx-auto text-center pt-4">

        {/* Letter to identify — tap to repeat audio */}
        <button
          onClick={playRoundAudio}
          className="bg-yellow-300 text-[#1E5F8C] font-kid w-44 h-44 mx-auto rounded-full text-9xl btn-shadow flex items-center justify-center mb-2"
          aria-label={`Sonido ${round.letter}`}
        >
          {round.letter}
        </button>
        <div className="flex justify-center mb-6">
          <span className="text-3xl">🔊</span>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-4">
          {round.options.map((o) => (
            <button key={o.name} onClick={() => choose(o.name)}
              className="bg-white rounded-3xl p-4 btn-shadow hover:scale-105 active:scale-95 transition aspect-square flex flex-col items-center justify-center gap-2 shadow-md">
              <div className="text-6xl">{o.emoji}</div>
              <div className="font-kid text-[#1E5F8C] text-2xl leading-tight">{o.name}</div>
            </button>
          ))}
        </div>

        {/* Stitch feedback */}
        <div className="mt-6 flex justify-center min-h-[160px] items-center">
          {feedback === "ok" && (
            <div className="flex flex-col items-center animate-pop">
              <Stitch size={160} mood="cheer" />
            </div>
          )}
          {feedback === "nope" && (
            <div className="flex flex-col items-center animate-wiggle">
              <Stitch size={160} mood="happy" />
            </div>
          )}
          {feedback === "idle" && <Stitch size={160} mood="think" />}
        </div>
      </div>
    </KidShell>
  );
}
