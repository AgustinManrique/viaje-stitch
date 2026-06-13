"use client";
import { useEffect, useRef, useState } from "react";
import { KidShell } from "@/components/KidShell";
import { Stitch } from "@/components/Stitch";
import { CompletionScreen } from "@/components/CompletionScreen";
import { markCompleted } from "@/lib/progress";
import { useStitchAudio } from "@/hooks/useStitchAudio";
import { getConfig } from "@/lib/config";

type Line = { x1: number; y1: number; x2: number; y2: number };

export default function Silabas() {
  const config = getConfig();
  const { consonant, vowels, audioPrompt } = config.silabas;

  const [formed, setFormed]       = useState<string[]>([]);
  const [completed, setCompleted] = useState<number[] | null>(null);
  const speak = useStitchAudio();

  // drag-to-connect state
  const containerRef  = useRef<HTMLDivElement>(null);
  const pButtonRef    = useRef<HTMLButtonElement>(null);
  const vowelRefs     = useRef<(HTMLButtonElement | null)[]>([]);
  const isDraggingRef = useRef(false);
  const [isDragging,   setIsDragging]   = useState(false);
  const [pCenter,      setPCenter]      = useState<{ x: number; y: number } | null>(null);
  const [dragEnd,      setDragEnd]      = useState<{ x: number; y: number } | null>(null);
  const [hoverIdx,     setHoverIdx]     = useState<number | null>(null);
  const [connectedLines, setConnectedLines] = useState<Map<string, Line>>(new Map());

  useEffect(() => {
    const fire = () => speak(audioPrompt ?? "Arrastrá la P hasta cada vocal");
    if (window.speechSynthesis.getVoices().length > 0) fire();
    else window.speechSynthesis.onvoiceschanged = fire;
  }, [speak]);

  const connect = (v: string) => {
    if (formed.includes(v)) return;
    speak(consonant + v);
    const next = [...formed, v];
    setFormed(next);
    if (next.length === vowels.length) {
      setTimeout(() => setCompleted(markCompleted(3)), 700);
    }
  };

  const cr = () => containerRef.current?.getBoundingClientRect();

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = cr();
    const pb  = pButtonRef.current?.getBoundingClientRect();
    if (!box || !pb) return;
    setPCenter({ x: pb.left + pb.width / 2 - box.left, y: pb.top + pb.height / 2 - box.top });
    setIsDragging(true);
    isDraggingRef.current = true;
    setDragEnd({ x: e.clientX - box.left, y: e.clientY - box.top });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    const box = cr();
    if (!box) return;
    setDragEnd({ x: e.clientX - box.left, y: e.clientY - box.top });

    let over: number | null = null;
    vowels.forEach((_, i) => {
      const vb = vowelRefs.current[i];
      if (!vb) return;
      const r = vb.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom)
        over = i;
    });
    setHoverIdx(over);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragEnd(null);
    setPCenter(null);

    if (hoverIdx !== null) {
      const v  = vowels[hoverIdx];
      const box = cr();
      const vb  = vowelRefs.current[hoverIdx];
      if (!formed.includes(v) && box && vb) {
        const vr = vb.getBoundingClientRect();
        const pb = pButtonRef.current!.getBoundingClientRect();
        const line: Line = {
          x1: pb.left + pb.width / 2 - box.left,
          y1: pb.top  + pb.height / 2 - box.top,
          x2: vr.left + vr.width  / 2 - box.left,
          y2: vr.top  + vr.height / 2 - box.top,
        };
        setConnectedLines(prev => new Map(prev).set(v, line));
        connect(v);
      }
    }
    setHoverIdx(null);
  };

  if (completed) return <CompletionScreen completed={completed} />;

  return (
    <KidShell title="🧩 Armar sílabas" pieces={formed.length} total={vowels.length}>
      <div className="max-w-sm mx-auto pt-6 px-4">
        <div
          ref={containerRef}
          className="relative select-none"
          style={{ touchAction: "none" }}
        >
          {/* SVG overlay — lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <defs>
              <marker id="arr-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
              </marker>
              <marker id="arr-yellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#eab308" />
              </marker>
            </defs>

            {/* Permanent connected arrows */}
            {Array.from(connectedLines.entries()).map(([v, l]) => (
              <line key={v}
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="#10b981" strokeWidth="3" strokeLinecap="round"
                markerEnd="url(#arr-green)"
              />
            ))}

            {/* Live drag arrow */}
            {isDragging && pCenter && dragEnd && (
              <line
                x1={pCenter.x} y1={pCenter.y} x2={dragEnd.x} y2={dragEnd.y}
                stroke="#eab308" strokeWidth="3" strokeLinecap="round"
                strokeDasharray="10 5"
                markerEnd="url(#arr-yellow)"
              />
            )}
          </svg>

          {/* 3-column layout */}
          <div className="grid grid-cols-3 gap-x-12 items-stretch">

            {/* Col 1 — drag source */}
            <div className="flex items-center justify-center">
              <button
                ref={pButtonRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`bg-pink-400 text-white font-kid text-6xl w-24 h-24 rounded-3xl btn-shadow cursor-grab select-none ${
                  isDragging ? "scale-110 ring-4 ring-yellow-300" : "hover:scale-105"
                }`}
                style={{ touchAction: "none" }}
              >
                {consonant}
              </button>
            </div>

            {/* Col 2 — Vowels */}
            <div className="flex flex-col gap-5">
              {vowels.map((v, i) => {
                const connected = formed.includes(v);
                const hovered   = hoverIdx === i && isDragging;
                return (
                  <button
                    key={v}
                    ref={el => { vowelRefs.current[i] = el; }}
                    className={`font-kid text-4xl h-14 rounded-2xl transition select-none ${
                      connected
                        ? "bg-emerald-400 text-white shadow"
                        : hovered
                          ? "bg-yellow-200 text-[#1E5F8C] ring-4 ring-yellow-400 scale-110"
                          : "bg-white text-[#1E5F8C] shadow-md"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>

            {/* Col 3 — Result boxes */}
            <div className="flex flex-col gap-5">
              {vowels.map((v) => {
                const ok = formed.includes(v);
                return (
                  <div key={v}
                    className={`font-kid text-3xl h-14 rounded-2xl border-4 flex items-center justify-center transition ${
                      ok
                        ? "bg-emerald-400 text-white border-emerald-400 animate-pop"
                        : "border-dashed border-[#1E5F8C]/25 bg-white/60"
                    }`}
                  >
                    {ok ? `${consonant}${v}` : ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stitch */}
        <div className="mt-8 flex justify-center">
          <Stitch size={160} mood={formed.length === vowels.length ? "cheer" : "happy"} />
        </div>
      </div>
    </KidShell>
  );
}