"use client";

const pieces = [
  { id: 0, label: "Motor", d: "M 160 260 Q 200 300 240 260 L 230 220 Q 200 240 170 220 Z", color: "#FF6B9D" },
  { id: 1, label: "Cuerpo", d: "M 140 220 L 170 220 Q 200 240 230 220 L 260 220 L 270 160 Q 200 140 130 160 Z", color: "#5BC0EB" },
  { id: 2, label: "Cabina", d: "M 160 160 Q 200 100 240 160 Q 200 140 160 160 Z", color: "#FFD93D" },
  { id: 3, label: "Ala izq", d: "M 130 160 L 60 200 L 80 160 L 140 180 Z", color: "#8B5FBF" },
  { id: 4, label: "Ala der", d: "M 270 160 L 340 200 L 320 160 L 260 180 Z", color: "#FF9DC6" },
];

export function SpaceshipPuzzle({ completed }: { completed: number[] }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="40 80 320 240" width="280" height="200" className="drop-shadow-lg">
        {pieces.map((p) => {
          const unlocked = completed.includes(p.id);
          return (
            <g key={p.id}>
              <path
                d={p.d}
                fill={unlocked ? p.color : "#1E5F8C"}
                opacity={unlocked ? 1 : 0.15}
                stroke={unlocked ? "#fff" : "#1E5F8C"}
                strokeWidth="2"
                className={unlocked ? "animate-pop" : ""}
              />
              {unlocked && (
                <path d={p.d} fill="white" opacity="0.15" />
              )}
            </g>
          );
        })}
        {completed.length === 5 && (
          <>
            <circle cx="200" cy="140" r="8" fill="#FFD93D" opacity="0.9">
              <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="140" r="4" fill="white" />
          </>
        )}
      </svg>
      <p className="font-kid text-white text-sm mt-2 drop-shadow">
        {completed.length === 0 && "¡La nave de Stitch necesita reparación!"}
        {completed.length > 0 && completed.length < 5 && `${completed.length}/5 piezas encontradas`}
        {completed.length === 5 && "¡La nave está lista para despegar! 🚀"}
      </p>
    </div>
  );
}
