"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { resetProgress, getCompleted } from "@/lib/progress";

const activityOrder = [
  "/lucia/sonido-inicial",
  "/lucia/discriminacion",
  "/lucia/trazado",
  "/lucia/silabas",
  "/lucia/palabras",
];

export default function Sesion() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const start = () => {
    setStarting(true);
    let c = 3;
    const interval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(interval);
        const completed = getCompleted();
        const next = activityOrder[completed.length] ?? "/sesion";
        router.push(next);
      }
    }, 1000);
  };

  if (starting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 to-blue-300 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="flex justify-center mb-6">
            <Image src="/stitch/think.png" alt="Stitch" width={200} height={200} className="object-contain" priority />
          </div>
          <h1 className="font-kid text-4xl text-[#1E5F8C] mb-3">¡Pasale el dispositivo a Lucía!</h1>
          <p className="text-slate-600 text-lg mb-8">Las misiones están por comenzar</p>
          <div className="text-8xl font-kid text-[#1E5F8C] animate-pop">{countdown > 0 ? countdown : "🚀"}</div>
          <p className="text-slate-500 mt-6 text-sm">Sin temporizador · Sin penalizaciones · Registro en segundo plano</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-clean flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">← Inicio</Link>
          <h1 className="font-semibold text-slate-900">Viaje de Rescate con Stitch</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center py-12">
          <div className="flex justify-center mb-6">
            <Image src="/stitch/think.png" alt="Stitch" width={160} height={160} className="object-contain" />
          </div>

          <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-slate-200 mb-8 text-left">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold text-lg shrink-0">L</div>
            <div>
              <div className="font-semibold text-slate-900">Lucía Fernández</div>
              <div className="text-sm text-slate-500">6 años · 1° grado · TDAH</div>
            </div>
          </div>

          <button
            onClick={start}
            className="w-full bg-[#1E5F8C] hover:bg-[#164a6e] text-white px-8 py-4 rounded-2xl font-bold text-xl btn-shadow transition mb-4"
          >
            Iniciar sesión →
          </button>

          <button
            onClick={() => { resetProgress(); }}
            className="text-sm text-slate-400 hover:text-slate-600 mb-6"
          >
            Reiniciar progreso
          </button>

          <div className="flex gap-3 justify-center">
            <Link href="/terapeuta" className="text-sm text-purple-600 font-medium hover:text-purple-800">
              Ver métricas →
            </Link>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-left flex gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-amber-800">
              Lucía podrá elegir libremente qué actividad hacer. Para volver a esta pantalla, hacé <strong>triple tap en la flecha ←</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
