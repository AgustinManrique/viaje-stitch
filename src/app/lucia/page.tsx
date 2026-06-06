"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCompleted } from "@/lib/progress";

const activityOrder = [
  "/lucia/sonido-inicial",
  "/lucia/discriminacion",
  "/lucia/trazado",
  "/lucia/silabas",
  "/lucia/palabras",
];

export default function LuciaHome() {
  const router = useRouter();
  useEffect(() => {
    const completed = getCompleted();
    const next = activityOrder[completed.length] ?? "/sesion";
    router.replace(next);
  }, [router]);
  return null;
}
