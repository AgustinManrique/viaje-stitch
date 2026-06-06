import Link from "next/link";
import { Stitch } from "@/components/Stitch";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-600 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ top: `${(i * 37) % 100}%`, left: `${(i * 53) % 100}%`, opacity: 0.4 + (i % 3) * 0.2 }}
          />
        ))}
      </div>

      <div className="relative text-center px-6 flex flex-col items-center">
        <div className="animate-float mb-2">
          <Stitch size={220} mood="cheer" />
        </div>
        <h1 className="font-kid text-5xl md:text-6xl text-white drop-shadow-lg mb-2">
          Un Viaje con Stitch
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/sesion"
            className="bg-yellow-300 hover:bg-yellow-400 text-[#1E5F8C] px-10 py-4 rounded-2xl font-kid text-2xl btn-shadow transition"
          >
            ¡Jugar! 🚀
          </Link>
          <Link
            href="/terapeuta"
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 px-8 py-4 rounded-2xl font-semibold transition"
          >
            Panel del terapeuta
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 text-white/30 text-xs text-center">
        Grupo Púrpura · DISCENTUSUD 2026 · UTN FRLP
      </footer>
    </main>
  );
}
