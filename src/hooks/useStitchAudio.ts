"use client";
import { useCallback } from "react";

export function useStitchAudio() {
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-AR";
    utt.rate = 0.82;
    utt.pitch = 1.15;
    // prefer a local Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanish = voices.find((v) => v.lang.startsWith("es"));
    if (spanish) utt.voice = spanish;
    window.speechSynthesis.speak(utt);
  }, []);

  return speak;
}
