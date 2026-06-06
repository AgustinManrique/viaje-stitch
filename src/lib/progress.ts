"use client";

const KEY = "stitch-progress";

export function getCompleted(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function markCompleted(pieceId: number) {
  const current = getCompleted();
  if (!current.includes(pieceId)) {
    const next = [...current, pieceId];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }
  return current;
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}
