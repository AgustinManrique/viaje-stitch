"use client";
import { useRef, useCallback, useState } from "react";
import { ActivityPuzzle } from "./ActivityPuzzle";
import { DescansoScreen } from "./DescansoScreen";

const ACTIVITY_KEYS: [string, string][] = [
  ["sonido-inicial", "sonido-inicial"],
  ["sonido",         "sonido-inicial"],
  ["discriminacion", "discriminacion"],
  ["buscar",         "discriminacion"],
  ["trazado",        "trazado"],
  ["trazar",         "trazado"],
  ["silabas",        "silabas"],
  ["sílabas",        "silabas"],
  ["palabras",       "palabras"],
];

function resolveKey(title: string): string {
  const t = title.toLowerCase();
  return ACTIVITY_KEYS.find(([k]) => t.includes(k))?.[1] ?? "";
}

const ACTIVITY_ICONS: Record<string, string> = {
  "sonido-inicial": "🔤",
  discriminacion:   "👁️",
  trazado:          "✏️",
  silabas:          "🧩",
  palabras:         "🖼️",
};

export function KidShell({
  children,
  pieces = 0,
  title,
}: {
  children: React.ReactNode;
  pieces?: number;
  total?: number;   // kept for backwards compat, ActivityPuzzle derives its own total
  title: string;
}) {
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [resting, setResting] = useState(false);
  const key  = resolveKey(title);
  const icon = ACTIVITY_ICONS[key] ?? "⭐";

  const handleExit = useCallback(() => {
    tapCount.current++;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      setResting(true);
      return;
    }
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 800);
  }, []);

  if (resting) return <DescansoScreen />;

  return (
    <div className="min-h-screen" style={{ background: "#FFF8E7" }}>
      <header className="flex items-center justify-between p-4 md:px-8 border-b-2 border-[#1E5F8C]/10">
        {/* exit — intentionally subtle, triple tap */}
        <button
          onClick={handleExit}
          className="bg-white text-[#1E5F8C]/30 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold select-none shadow"
          aria-label="Salir (triple tap)"
        >
          ←
        </button>

        {/* activity icon */}
        <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-md">
          {icon}
        </div>

        {/* per-activity puzzle */}
        <ActivityPuzzle activityKey={key} filled={pieces} />
      </header>
      <main className="px-4 pb-12">{children}</main>
    </div>
  );
}
