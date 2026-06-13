"use client";
import { useEffect, useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";
import { useStitchAudio } from "@/hooks/useStitchAudio";
import { getConfig } from "@/lib/config";

export default function Palabras() {
  const config = getConfig();
  const { words, audioPrompt } = config.palabras;
  const [wordIdx, setWordIdx]   = useState(0);
  const [filled, setFilled]     = useState<(string | null)[]>(words[0].syllables.map(() => null));
  const [activeBox, setActiveBox] = useState(0);
  const [wrongOpt, setWrongOpt] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [completed, setCompleted] = useState<number[] | null>(null);
  const speak = useStitchAudio();

  const word  = words[wordIdx];

  useEffect(() => {
    const fire = () => speak(audioPrompt ?? "¿Qué palabra es?");
    if (window.speechSynthesis.getVoices().length > 0) fire();
    else window.speechSynthesis.onvoiceschanged = fire;
  }, [wordIdx, speak]);

  const tryOption = (boxIdx: number, opt: string) => {
    if (boxIdx !== activeBox || filled[boxIdx] !== null) return;

    if (opt === word.syllables[boxIdx]) {
      speak(opt);
      const newFilled = [...filled];
      newFilled[boxIdx] = opt;
      setFilled(newFilled);

      const nextBox = boxIdx + 1;
      if (nextBox >= word.syllables.length) {
        // word complete
        setCelebrating(true);
        speak(word.word);
        setTimeout(() => {
          setCelebrating(false);
          const nextWord = wordIdx + 1;
          if (nextWord >= words.length) {
            setCompleted(markCompleted(4));
          } else {
            setWordIdx(nextWord);
            setFilled(words[nextWord].syllables.map(() => null));
            setActiveBox(0);
          }
        }, 1400);
      } else {
        setActiveBox(nextBox);
      }
    } else {
      setWrongOpt(opt);
      setTimeout(() => setWrongOpt(null), 600);
    }
  };

  if (completed) return <CompletionScreen completed={completed} />;

  const cols = word.syllables.length;

  return (
    <KidShell title="🖼️ Palabras" pieces={wordIdx} total={words.length}>
      <div className="max-w-sm mx-auto pt-4">

        {/* Row 1: Big image — NO word shown, Lucía forms it */}
        <div className="text-center mb-6">
          <button
            onClick={() => speak("¿Qué ves en la imagen?")}
            className="text-9xl focus:outline-none hover:scale-105 transition"
            aria-label="Imagen"
          >
            {word.imageUrl ? (
              <img
                src={word.imageUrl}
                alt={word.word}
                className="mx-auto w-48 h-48 object-contain"
              />
            ) : (
              word.emoji
            )}
          </button>
        </div>

        {/* Rows 2+3: one column per syllable */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {word.syllables.map((_, i) => (
            <div key={i} className="flex flex-col gap-3">

              {/* Box to fill */}
              <div className={`h-20 rounded-2xl border-4 flex items-center justify-center font-kid text-3xl transition ${
                filled[i]
                  ? "bg-emerald-400 text-white border-emerald-400 animate-pop"
                  : activeBox === i
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-dashed border-[#1E5F8C]/25 bg-white"
              }`}>
                {filled[i] ?? ""}
              </div>

              {/* Syllable options */}
              {word.optionsPerBox[i].map((opt) => (
                <button key={opt}
                  onClick={() => tryOption(i, opt)}
                  disabled={!!filled[i]}
                  className={`h-14 rounded-2xl font-kid text-2xl btn-shadow transition ${
                    wrongOpt === opt
                      ? "bg-rose-300 text-white animate-shake"
                      : filled[i]
                        ? "bg-white/40 text-[#1E5F8C]/30"
                        : activeBox === i
                          ? "bg-white text-[#1E5F8C] hover:scale-105 active:scale-95 shadow-md"
                          : "bg-white/60 text-[#1E5F8C]/50"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Stitch */}
        <div className="mt-8 flex justify-center">
          <Stitch size={160} mood={celebrating ? "cheer" : "happy"} />
        </div>
      </div>
    </KidShell>
  );
}
