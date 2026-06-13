"use client";
import { useRef, useState, useEffect } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";
import { useStitchAudio } from "@/hooks/useStitchAudio";
import { getConfig } from "@/lib/config";

export default function Trazado() {
  const config = getConfig();
  const { guideLetter, guidePath, audioPrompt } = config.trazado;
  const svgRef    = useRef<SVGSVGElement>(null);
  const [paths, setPaths]     = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const drawing   = useRef(false);
  const [showGuide, setShowGuide] = useState(true);
  const [completed, setCompleted] = useState<number[] | null>(null);
  const done = paths.length >= 1;
  const speak = useStitchAudio();

  useEffect(() => {
    const fire = () => speak(audioPrompt ?? "Mirá cómo lo hace Stitch y dibujá vos");
    if (window.speechSynthesis.getVoices().length > 0) fire();
    else window.speechSynthesis.onvoiceschanged = fire;
  }, [speak]);

  const toLocal = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 400, y: ((e.clientY - r.top) / r.height) * 400 };
  };
  const start = (e: React.PointerEvent) => { drawing.current = true; const p = toLocal(e); setCurrent(`M ${p.x} ${p.y}`); };
  const move  = (e: React.PointerEvent) => { if (!drawing.current) return; const p = toLocal(e); setCurrent(c => `${c} L ${p.x} ${p.y}`); };
  const end   = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setPaths(ps => {
      const next = [...ps, current];
      if (next.length === 1) {
        speak("¡Muy bien!");
        setTimeout(() => setCompleted(markCompleted(2)), 1200);
      }
      return next;
    });
    setCurrent("");
  };

  if (completed) return <CompletionScreen completed={completed} />;

  return (
    <KidShell title={`✏️ Trazar la ${guideLetter}`} pieces={done ? 1 : 0} total={1}>
      <div className="max-w-2xl mx-auto text-center pt-4">

        {/* Repeat guide button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => { setShowGuide(false); setTimeout(() => setShowGuide(true), 50); }}
            className="bg-yellow-300 text-[#1E5F8C] font-kid px-6 py-3 rounded-2xl btn-shadow text-2xl"
          >
            🔁
          </button>
        </div>

        {/* Drawing canvas */}
        <div className="bg-white rounded-3xl p-2 shadow-lg">
          <svg ref={svgRef} viewBox="0 0 400 400" className="w-full touch-none cursor-crosshair"
            onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end}>
            {showGuide && <path d={guidePath} stroke="#E2E8F0" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
            {showGuide && <path d={guidePath} stroke="#FFD93D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"
              strokeDasharray="1500" style={{ strokeDashoffset: 1500, animation: "draw 2.5s ease-in-out forwards" }} />}
            <style>{`@keyframes draw{to{stroke-dashoffset:0;}}`}</style>
            {paths.map((p, i) => <path key={i} d={p} stroke="#1E5F8C" strokeWidth="10" strokeLinecap="round" fill="none" />)}
            {current && <path d={current} stroke="#1E5F8C" strokeWidth="10" strokeLinecap="round" fill="none" />}
          </svg>
        </div>

        {/* Stitch */}
        <div className="mt-6 flex justify-center">
          <Stitch size={150} mood={done ? "cheer" : "happy"} />
        </div>
      </div>
    </KidShell>
  );
}
