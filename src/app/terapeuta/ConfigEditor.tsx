"use client";
import { useState, useEffect } from "react";
import { AppConfig, getConfig, saveConfig, getDefaults, resetConfig } from "@/lib/config";

const tabs = ["sonidoInicial", "discriminacion", "trazado", "silabas", "palabras"] as const;
type Tab = (typeof tabs)[number];

const tabLabels: Record<Tab, string> = {
  sonidoInicial: "🔊 Sonido inicial",
  discriminacion: "👁️ Discriminación",
  trazado: "✏️ Trazado",
  silabas: "🧩 Sílabas",
  palabras: "🖼️ Palabras",
};

export function ConfigEditor() {
  const [config, setConfig] = useState<AppConfig>(getConfig());
  const [activeTab, setActiveTab] = useState<Tab>("sonidoInicial");

  // persist on every change
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const update = (patch: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...patch }));
  };

  const restoreDefaults = () => {
    if (window.confirm("¿Restaurar valores originales de todas las actividades?")) {
      resetConfig();
      setConfig(getDefaults());
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition ${
              activeTab === t
                ? "border-b-2 border-purple-600 text-purple-700 bg-purple-50"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tabLabels[t]}
          </button>
        ))}
        <div className="ml-auto flex items-center pr-2">
          <button
            onClick={restoreDefaults}
            className="text-xs text-rose-500 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
          >
            Restaurar defaults
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {activeTab === "sonidoInicial" && (
          <SonidoInicialEditor config={config} update={update} />
        )}
        {activeTab === "discriminacion" && (
          <DiscriminacionEditor config={config} update={update} />
        )}
        {activeTab === "trazado" && (
          <TrazadoEditor config={config} update={update} />
        )}
        {activeTab === "silabas" && (
          <SilabasEditor config={config} update={update} />
        )}
        {activeTab === "palabras" && (
          <PalabrasEditor config={config} update={update} />
        )}
      </div>
    </div>
  );
}

// ─── Sonido Inicial Editor ────────────────────────────────────────────────

function SonidoInicialEditor({ config, update }: { config: AppConfig; update: (p: Partial<AppConfig>) => void }) {
  const rounds = config.sonidoInicial.rounds;

  const setRounds = (newRounds: typeof rounds) => {
    update({ sonidoInicial: { ...config.sonidoInicial, rounds: newRounds } });
  };

  const addRound = () => {
    setRounds([...rounds, { letter: "", correct: "", options: [{ emoji: "❓", name: "" }, { emoji: "❓", name: "" }, { emoji: "❓", name: "" }] }]);
  };

  const removeRound = (i: number) => {
    if (rounds.length <= 1) return;
    setRounds(rounds.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">Configurá las rondas de sonido inicial. Cada ronda muestra una letra y 3 opciones.</p>
      {rounds.map((r, i) => (
        <fieldset key={i} className="border border-slate-200 rounded-xl p-4 space-y-3">
          <legend className="text-sm font-semibold text-slate-700 px-2">Ronda {i + 1}</legend>
          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-xs text-slate-500">Letra</span>
              <input
                value={r.letter}
                onChange={e => {
                  const copy = [...rounds];
                  copy[i] = { ...copy[i], letter: e.target.value };
                  setRounds(copy);
                }}
                className="w-full border rounded-lg px-3 py-2 text-lg font-kid"
                maxLength={2}
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">Correcta</span>
              <input
                value={r.correct}
                onChange={e => {
                  const copy = [...rounds];
                  copy[i] = { ...copy[i], correct: e.target.value };
                  setRounds(copy);
                }}
                className="w-full border rounded-lg px-3 py-2 text-lg font-kid"
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">Audio prompt (opcional)</span>
              <input
                value={r.audioPrompt ?? ""}
                onChange={e => {
                  const copy = [...rounds];
                  copy[i] = { ...copy[i], audioPrompt: e.target.value || undefined };
                  setRounds(copy);
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Ej: ¿Cuál empieza con A?"
              />
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {r.options.map((opt, oi) => (
              <div key={oi} className="border border-dashed border-slate-300 rounded-lg p-2 space-y-1">
                <span className="text-xs text-slate-400">Opción {oi + 1}</span>
                <div className="flex gap-2">
                  <input
                    value={opt.emoji}
                    onChange={e => {
                      const copy = [...rounds];
                      copy[i].options[oi] = { ...copy[i].options[oi], emoji: e.target.value };
                      setRounds(copy);
                    }}
                    className="w-14 border rounded-lg px-2 py-1 text-center text-xl"
                    maxLength={4}
                  />
                  <input
                    value={opt.name}
                    onChange={e => {
                      const copy = [...rounds];
                      copy[i].options[oi] = { ...copy[i].options[oi], name: e.target.value };
                      setRounds(copy);
                    }}
                    className="flex-1 border rounded-lg px-2 py-1 text-sm font-kid"
                  />
                </div>
              </div>
            ))}
          </div>
          {rounds.length > 1 && (
            <button onClick={() => removeRound(i)} className="text-xs text-rose-500 hover:text-rose-700">
              Eliminar ronda
            </button>
          )}
        </fieldset>
      ))}
      <button onClick={addRound} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
        + Agregar ronda
      </button>
    </div>
  );
}

// ─── Discriminación Editor ────────────────────────────────────────────────

function DiscriminacionEditor({ config, update }: { config: AppConfig; update: (p: Partial<AppConfig>) => void }) {
  const disc = config.discriminacion;

  const setDisc = (patch: Partial<typeof disc>) => {
    update({ discriminacion: { ...disc, ...patch } });
  };

  const setLetter = (id: number, patch: Partial<typeof disc.letters[0]>) => {
    setDisc({
      letters: disc.letters.map(l => l.id === id ? { ...l, ...patch } : l),
    });
  };

  const addLetter = () => {
    const maxId = Math.max(...disc.letters.map(l => l.id), -1) + 1;
    setDisc({
      letters: [...disc.letters, { id: maxId, ch: "", x: 10, y: 10, target: false }],
    });
  };

  const removeLetter = (id: number) => {
    if (disc.letters.length <= 1) return;
    setDisc({ letters: disc.letters.filter(l => l.id !== id) });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">Configurá la letra objetivo y las letras a mostrar en el tablero.</p>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <label className="block">
          <span className="text-xs text-slate-500">Letra objetivo</span>
          <input
            value={disc.targetLetter}
            onChange={e => setDisc({ targetLetter: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-2xl font-kid"
            maxLength={2}
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-500">Audio prompt (opcional)</span>
          <input
            value={disc.audioPrompt ?? ""}
            onChange={e => setDisc({ audioPrompt: e.target.value || undefined })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder='Ej: "Tocá todas las M"'
          />
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Letras en el tablero</span>
          <button onClick={addLetter} className="text-xs text-purple-600 hover:text-purple-800">
            + Agregar letra
          </button>
        </div>
        {disc.letters.map((l) => (
          <div key={l.id} className="flex items-center gap-2 border border-slate-200 rounded-lg p-2">
            <input
              value={l.ch}
              onChange={e => setLetter(l.id, { ch: e.target.value })}
              className="w-12 border rounded-lg px-2 py-1 text-center font-kid text-xl"
              maxLength={2}
            />
            <label className="flex items-center gap-1 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={l.target}
                onChange={e => setLetter(l.id, { target: e.target.checked })}
              />
              Target
            </label>
            <label className="text-xs text-slate-500">X:
              <input
                type="number"
                value={l.x}
                onChange={e => setLetter(l.id, { x: Number(e.target.value) })}
                className="w-14 border rounded px-1 py-0.5 text-xs ml-1"
                min={0} max={100}
              />
            </label>
            <label className="text-xs text-slate-500">Y:
              <input
                type="number"
                value={l.y}
                onChange={e => setLetter(l.id, { y: Number(e.target.value) })}
                className="w-14 border rounded px-1 py-0.5 text-xs ml-1"
                min={0} max={100}
              />
            </label>
            <button onClick={() => removeLetter(l.id)} className="text-xs text-rose-500 ml-auto">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Trazado Editor ───────────────────────────────────────────────────────

function TrazadoEditor({ config, update }: { config: AppConfig; update: (p: Partial<AppConfig>) => void }) {
  const t = config.trazado;

  const setT = (patch: Partial<typeof t>) => {
    update({ trazado: { ...t, ...patch } });
  };

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-slate-500">Configurá la letra a trazar y el path SVG de la guía.</p>
      <label className="block">
        <span className="text-xs text-slate-500">Letra a trazar</span>
        <input
          value={t.guideLetter}
          onChange={e => setT({ guideLetter: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-2xl font-kid"
          maxLength={2}
        />
      </label>
      <label className="block">
        <span className="text-xs text-slate-500">Path SVG guía (comando d)</span>
        <textarea
          value={t.guidePath}
          onChange={e => setT({ guidePath: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-xs font-mono h-20"
        />
      </label>
      <label className="block">
        <span className="text-xs text-slate-500">Audio prompt (opcional)</span>
        <input
          value={t.audioPrompt ?? ""}
          onChange={e => setT({ audioPrompt: e.target.value || undefined })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </label>
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
        <span className="text-xs text-slate-500 mb-2 block">Vista previa del path:</span>
        <svg viewBox="0 0 400 400" className="w-full max-w-xs mx-auto h-48">
          <path d={t.guidePath} stroke="#FFD93D" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </div>
  );
}

// ─── Sílabas Editor ───────────────────────────────────────────────────────

function SilabasEditor({ config, update }: { config: AppConfig; update: (p: Partial<AppConfig>) => void }) {
  const s = config.silabas;

  const setS = (patch: Partial<typeof s>) => {
    update({ silabas: { ...s, ...patch } });
  };

  const addVowel = () => setS({ vowels: [...s.vowels, ""] });
  const removeVowel = (i: number) => {
    if (s.vowels.length <= 1) return;
    setS({ vowels: s.vowels.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-slate-500">Configurá la consonante y las vocales para formar sílabas.</p>
      <label className="block max-w-xs">
        <span className="text-xs text-slate-500">Consonante</span>
        <input
          value={s.consonant}
          onChange={e => setS({ consonant: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-2xl font-kid"
          maxLength={3}
        />
      </label>
      <label className="block">
        <span className="text-xs text-slate-500">Audio prompt (opcional)</span>
        <input
          value={s.audioPrompt ?? ""}
          onChange={e => setS({ audioPrompt: e.target.value || undefined })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </label>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Vocales</span>
          <button onClick={addVowel} className="text-xs text-purple-600 hover:text-purple-800">
            + Agregar vocal
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {s.vowels.map((v, i) => (
            <div key={i} className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1">
              <input
                value={v}
                onChange={e => {
                  const copy = [...s.vowels];
                  copy[i] = e.target.value;
                  setS({ vowels: copy });
                }}
                className="w-10 border-none text-center font-kid text-xl px-0 py-0"
                maxLength={3}
              />
              {s.vowels.length > 1 && (
                <button onClick={() => removeVowel(i)} className="text-xs text-rose-400">✕</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Palabras Editor ──────────────────────────────────────────────────────

function PalabrasEditor({ config, update }: { config: AppConfig; update: (p: Partial<AppConfig>) => void }) {
  const p = config.palabras;

  const setP = (patch: Partial<typeof p>) => {
    update({ palabras: { ...p, ...patch } });
  };

  const words = p.words;

  const setWords = (newWords: typeof words) => {
    setP({ words: newWords });
  };

  const addWord = () => {
    setWords([...words, { word: "", emoji: "❓", syllables: ["", ""], optionsPerBox: [["", ""], ["", ""]] }]);
  };

  const removeWord = (i: number) => {
    if (words.length <= 1) return;
    setWords(words.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">Configurá las palabras que Lucía debe formar.</p>
      {words.map((w, i) => (
        <fieldset key={i} className="border border-slate-200 rounded-xl p-4 space-y-3">
          <legend className="text-sm font-semibold text-slate-700 px-2">Palabra {i + 1}</legend>
          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-xs text-slate-500">Palabra</span>
              <input value={w.word} onChange={e => {
                const copy = [...words];
                copy[i] = { ...copy[i], word: e.target.value };
                setWords(copy);
              }} className="w-full border rounded-lg px-3 py-2 font-kid" />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">Emoji</span>
              <input value={w.emoji} onChange={e => {
                const copy = [...words];
                copy[i] = { ...copy[i], emoji: e.target.value };
                setWords(copy);
              }} className="w-full border rounded-lg px-3 py-2 text-xl" maxLength={4} />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">URL imagen (opcional)</span>
              <input value={w.imageUrl ?? ""} onChange={e => {
                const copy = [...words];
                copy[i] = { ...copy[i], imageUrl: e.target.value || undefined };
                setWords(copy);
              }} className="w-full border rounded-lg px-3 py-2 text-xs" placeholder="https://..." />
            </label>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-slate-500">Sílabas y opciones</span>
            {w.syllables.map((syll, si) => (
              <div key={si} className="flex items-center gap-2">
                <input
                  value={syll}
                  onChange={e => {
                    const copy = [...words];
                    copy[i].syllables[si] = e.target.value;
                    copy[i].optionsPerBox[si] = copy[i].optionsPerBox[si] ?? [e.target.value, ""];
                    setWords(copy);
                  }}
                  className="w-16 border rounded-lg px-2 py-1 text-center font-kid"
                  placeholder={`Sílaba ${si + 1}`}
                />
                <span className="text-xs text-slate-400">opciones:</span>
                {w.optionsPerBox[si]?.map((opt, oi) => (
                  <input
                    key={oi}
                    value={opt}
                    onChange={e => {
                      const copy = [...words];
                      copy[i].optionsPerBox[si][oi] = e.target.value;
                      setWords(copy);
                    }}
                    className="w-16 border rounded-lg px-2 py-1 text-center font-kid text-sm"
                    placeholder={`Op ${oi + 1}`}
                  />
                ))}
              </div>
            ))}
          </div>
          {words.length > 1 && (
            <button onClick={() => removeWord(i)} className="text-xs text-rose-500">Eliminar palabra</button>
          )}
        </fieldset>
      ))}
      <button onClick={addWord} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
        + Agregar palabra
      </button>
    </div>
  );
}