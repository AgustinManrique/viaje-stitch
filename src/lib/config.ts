"use client";

// ─── Schema ────────────────────────────────────────────────────────────────

export interface SonidoInicialRound {
  letter: string;
  correct: string;
  options: { emoji: string; name: string }[];
  audioPrompt?: string;
}

export interface SonidoInicialConfig {
  rounds: SonidoInicialRound[];
}

export interface DiscriminacionLetter {
  id: number;
  ch: string;
  x: number;
  y: number;
  target: boolean;
}

export interface DiscriminacionConfig {
  targetLetter: string;
  letters: DiscriminacionLetter[];
  audioPrompt?: string;
}

export interface TrazadoConfig {
  guideLetter: string;
  guidePath: string;
  audioPrompt?: string;
}

export interface SilabasConfig {
  consonant: string;
  vowels: string[];
  audioPrompt?: string;
}

export interface PalabraWord {
  word: string;
  emoji: string;
  imageUrl?: string;
  syllables: string[];
  optionsPerBox: string[][];
}

export interface PalabrasConfig {
  words: PalabraWord[];
  audioPrompt?: string;
}

export interface AppConfig {
  sonidoInicial: SonidoInicialConfig;
  discriminacion: DiscriminacionConfig;
  trazado: TrazadoConfig;
  silabas: SilabasConfig;
  palabras: PalabrasConfig;
}

// ─── Defaults (original hardcoded values) ──────────────────────────────────

const DEFAULTS: AppConfig = {
  sonidoInicial: {
    rounds: [
      { letter: "A", correct: "Auto",     options: [{ emoji: "🌞", name: "SOL"   }, { emoji: "🚗", name: "AUTO"  }, { emoji: "🌙", name: "LUNA"  }] },
      { letter: "M", correct: "Mono",     options: [{ emoji: "🐒", name: "MONO"  }, { emoji: "🐶", name: "PERRO" }, { emoji: "🐟", name: "PEZ"   }] },
      { letter: "P", correct: "Pato",     options: [{ emoji: "🍎", name: "MANZANA" }, { emoji: "🌻", name: "FLOR" }, { emoji: "🦆", name: "PATO" }] },
    ],
  },
  discriminacion: {
    targetLetter: "M",
    letters: [
      { id: 0, ch: "M", x: 12, y: 12, target: true  },
      { id: 1, ch: "T", x: 62, y: 8,  target: false },
      { id: 2, ch: "M", x: 38, y: 38, target: true  },
      { id: 3, ch: "G", x: 14, y: 62, target: false },
      { id: 4, ch: "M", x: 70, y: 55, target: true  },
      { id: 5, ch: "T", x: 46, y: 72, target: false },
      { id: 6, ch: "G", x: 78, y: 25, target: false },
    ],
  },
  trazado: {
    guideLetter: "M",
    guidePath: "M 80 320 L 120 80 L 200 240 L 280 80 L 320 320",
    audioPrompt: "Mirá cómo lo hace Stitch y dibujá vos",
  },
  silabas: {
    consonant: "P",
    vowels: ["A", "E", "I", "O", "U"],
    audioPrompt: "Arrastrá la P hasta cada vocal",
  },
  palabras: {
    words: [
      { word: "PATO", emoji: "🦆", syllables: ["PA", "TO"], optionsPerBox: [["PA", "CE"], ["TO", "MA"]] },
      { word: "MESA", emoji: "🍽️", syllables: ["ME", "SA"], optionsPerBox: [["ME", "PA"], ["SA", "TO"]] },
      { word: "LUNA", emoji: "🌙", syllables: ["LU", "NA"], optionsPerBox: [["LU", "PA"], ["NA", "MA"]] },
      { word: "MAPA", emoji: "🗺️", syllables: ["MA", "PA"], optionsPerBox: [["MA", "CE"], ["PA", "TO"]] },
    ],
  },
};

// ─── Persistence helpers ───────────────────────────────────────────────────

const CONFIG_KEY = "stitch-config";

export function getConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULTS;
    return JSON.parse(raw) as AppConfig;
  } catch {
    return DEFAULTS;
  }
}

export function saveConfig(config: AppConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function resetConfig() {
  localStorage.removeItem(CONFIG_KEY);
}

export function getDefaults(): AppConfig {
  return JSON.parse(JSON.stringify(DEFAULTS));
}