"use client";
import Link from "next/link";
import { useState } from "react";
import { ConfigEditor } from "./ConfigEditor";

const activities = [
  { id: "1", name: "Sonido inicial", time: 142, errors: 3, impulsive: 2, avgGap: 4.2, sessions: 8 },
  { id: "2", name: "Discriminación visual", time: 215, errors: 5, impulsive: 4, avgGap: 5.8, sessions: 6 },
  { id: "3", name: "Trazado guiado", time: 198, errors: 2, impulsive: 1, avgGap: 6.1, sessions: 7 },
  { id: "4", name: "Formación de sílabas", time: 168, errors: 4, impulsive: 3, avgGap: 3.9, sessions: 5 },
  { id: "5", name: "Reconocimiento de palabras", time: 254, errors: 6, impulsive: 2, avgGap: 7.3, sessions: 4 },
];

const trend = [8, 7, 6, 5, 4, 4, 3]; // errores por sesión

type View = "metricas" | "config";

export default function Terapeuta() {
  const [view, setView] = useState<View>("metricas");
  const [sel, setSel] = useState(activities[0]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">← Inicio</Link>
          <h1 className="font-bold text-slate-900">Panel del terapeuta</h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Conectado</div>
              <div className="text-sm font-semibold">Lic. M. González</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">MG</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* View toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setView("metricas")}
              className={`px-5 py-2.5 text-sm font-medium transition ${
                view === "metricas" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              📊 Métricas
            </button>
            <button
              onClick={() => setView("config")}
              className={`px-5 py-2.5 text-sm font-medium transition ${
                view === "config" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              ⚙️ Configurar actividades
            </button>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg font-medium">Esta semana</button>
            <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg font-medium">Mes</button>
            <button className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg font-medium">Trimestre</button>
          </div>
        </div>

        {view === "metricas" ? (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { l: "Tiempo total registrado", v: "47:32", s: "min·seg acumulados", c: "text-blue-600" },
                { l: "Tasa de aciertos", v: "78%", s: "+12% vs mes anterior", c: "text-emerald-600" },
                { l: "Interacciones impulsivas", v: "12", s: "tendencia ↓", c: "text-amber-600" },
                { l: "Piezas conseguidas", v: "84", s: "esta semana", c: "text-purple-600" },
              ].map((k) => (
                <div key={k.l} className="bg-white rounded-2xl p-5 border border-slate-100">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{k.l}</div>
                  <div className={`text-3xl font-bold ${k.c}`}>{k.v}</div>
                  <div className="text-xs text-slate-500 mt-1">{k.s}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Métricas por actividad</h3>
                  <span className="text-xs text-slate-500">Registrados en segundo plano</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="py-2 pr-4">Actividad</th>
                        <th className="py-2 pr-4">⏱ Tiempo prom.</th>
                        <th className="py-2 pr-4">❌ Fallos prom.</th>
                        <th className="py-2 pr-4">⚡ Impulsivos</th>
                        <th className="py-2 pr-4">⌛ Gap prom.</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((a) => (
                        <tr
                          key={a.id}
                          onClick={() => setSel(a)}
                          className={`border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${sel.id === a.id ? "bg-purple-50" : ""}`}
                        >
                          <td className="py-3 pr-4">
                            <div className="font-medium text-slate-900">{a.name}</div>
                            <div className="text-xs text-slate-500">{a.sessions} sesiones</div>
                          </td>
                          <td className="py-3 pr-4 font-mono">{Math.floor(a.time/60)}:{String(a.time%60).padStart(2,"0")}</td>
                          <td className="py-3 pr-4">{a.errors}</td>
                          <td className="py-3 pr-4">{a.impulsive}</td>
                          <td className="py-3 pr-4">{a.avgGap}s</td>
                          <td className="py-3 text-right">
                            <span className="text-purple-600 font-medium">Ver →</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-1">{sel.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">Detalle de la actividad seleccionada</p>
                  <div className="space-y-3 text-sm">
                    <Row label="Tiempo total promedio" value={`${Math.floor(sel.time/60)}m ${sel.time%60}s`} />
                    <Row label="Fallos invisibles" value={`${sel.errors} por sesión`} />
                    <Row label="Interacciones impulsivas" value={`${sel.impulsive} por sesión`} />
                    <Row label="Tiempo prom. entre toques" value={`${sel.avgGap}s`} />
                    <Row label="Sesiones registradas" value={`${sel.sessions}`} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-1">Tendencia de fallos</h3>
                  <p className="text-xs text-slate-500 mb-4">Últimas 7 sesiones</p>
                  <div className="flex items-end gap-2 h-32">
                    {trend.map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-300"
                          style={{ height: `${(v / 8) * 100}%` }}
                        />
                        <span className="text-[10px] text-slate-400 mt-1">S{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-emerald-600 mt-3 font-medium">↓ 62% menos fallos vs sesión 1</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <div className="flex gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h4 className="font-semibold text-amber-900 text-sm">Sugerencia clínica</h4>
                      <p className="text-xs text-amber-800 mt-1">
                        Atención sostenida estable en HU3 (trazado). Considerar ampliar tiempo en HU2 — gap promedio elevado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Exportar informe</h3>
                <p className="text-sm text-slate-400">PDF con métricas y observaciones — sin exposición de datos al usuario</p>
              </div>
              <button className="bg-white text-slate-900 px-5 py-2.5 rounded-lg font-semibold text-sm">Generar PDF</button>
            </div>
          </>
        ) : (
          <ConfigEditor />
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
