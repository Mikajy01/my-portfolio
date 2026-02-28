import { useState, useEffect } from "react";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";
const BOOT_LINES = [
  "SEGMENTATION FAULT (core dumped).",
  "ERR_STACK_OVERFLOW detected......",
  "PATCHING CORRUPTED MEMORY.......",
  "NULL POINTER EXCEPTION bypassed.",
  "INJECTING CHAOS INTO RUNTIME....",
  "DEADLOCK RESOLVED...somehow.....",
  "UNDEFINED BEHAVIOR enabled......",
  "BUFFER OVERFLOW — it's a feature",
  "MR. BUG has entered the system..",
  "READY TO BREAK THINGS",
];

interface FragmentStyle {
  size: string;
  x: string;
  y: string;
  rot: number;
  opacity: number;
  duration: number;
  delay: number;
  clip: string;
}

function useGlitchText(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((char: string, i: number) =>
          i < iteration ? char :
          char === " " ? " " :
          GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1.5;
    }, 30);
    return () => clearInterval(interval);
  }, [text, active]);

  return display;
}

const Fragment = ({ style, color }: { style: FragmentStyle; color: string }) => (
  <div
    style={{
      position: "absolute",
      width: style.size,
      height: style.size,
      left: style.x,
      top: style.y,
      background: color,
      transform: `rotate(${style.rot}deg)`,
      opacity: style.opacity,
      animation: `fragment-fly ${style.duration}s ${style.delay}s ease-out forwards`,
      clipPath: style.clip,
      mixBlendMode: "screen",
    }}
  />
);

export const AppLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [phase, setPhase] = useState("boot"); // boot | explode | done
  const [fragments, setFragments] = useState<FragmentStyle[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const titleGlitch = useGlitchText("MR. BUG", phase === "boot");

  const COLORS = ["#ff3c00", "#ff003c", "#ffe600", "#ff6b00", "#ff1a6e"];

  // Generate fragments once
  useEffect(() => {
    const frags = Array.from({ length: 48 }, (_, i) => ({
      size: `${4 + Math.random() * 18}px`,
      x: `${5 + Math.random() * 90}%`,
      y: `${5 + Math.random() * 90}%`,
      rot: Math.random() * 360,
      opacity: 0.6 + Math.random() * 0.4,
      duration: 0.4 + Math.random() * 0.8,
      delay: Math.random() * 0.4,
      clip: ["polygon(50% 0%,100% 100%,0% 100%)", "none", "polygon(0 0,100% 50%,0 100%)", "polygon(50% 0%,100% 100%,0% 100%)"][i % 4],
    }));
    setFragments(frags);
  }, []);

  // Progress ticker
  useEffect(() => {
    const duration = 3800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setProgress(Math.floor(p * 100));
      if (p < 1) requestAnimationFrame(tick);
      else {
        setPhase("explode");
        setTimeout(() => { setIsVisible(false); onComplete(); }, 900);
      }
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  // Boot lines ticker
  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length) return;
    const delay = lineIndex === 0 ? 100 : 280 + Math.random() * 120;
    const t = setTimeout(() => {
      setVisibleLines(l => [...l, BOOT_LINES[lineIndex]]);
      setLineIndex(i => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [lineIndex]);

  if (!isVisible) return null;

  const isExploding = phase === "explode";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@900&display=swap');

        @keyframes fragment-fly {
          0% { transform: scale(1) rotate(var(--r, 0deg)); opacity: 1; }
          100% { transform: scale(3) translate(var(--tx, 100px), var(--ty, -100px)) rotate(calc(var(--r, 0deg) + 720deg)); opacity: 0; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%,100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.4; } 94% { opacity: 1; } 96% { opacity: 0.6; } 97% { opacity: 1; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%,-50%) scale(0.6); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
        @keyframes glitch-h {
          0%,100% { clip-path: inset(0 0 98% 0); transform: translate(-4px,0); }
          20% { clip-path: inset(30% 0 60% 0); transform: translate(4px,0); }
          40% { clip-path: inset(60% 0 30% 0); transform: translate(-2px,0); }
          60% { clip-path: inset(10% 0 80% 0); transform: translate(3px,0); }
          80% { clip-path: inset(80% 0 10% 0); transform: translate(-3px,0); }
        }
        @keyframes explode-scale {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(0.92); opacity: 0; }
        }
        .loader-root {
          font-family: 'Share Tech Mono', monospace;
          animation: flicker 4s infinite;
        }
        .loader-root.exploding {
          animation: explode-scale 0.8s ease-in-out forwards;
        }
        .scanline {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 10;
        }
        .scanline::after {
          content: '';
          position: absolute; left: 0; width: 100%; height: 40px;
          background: linear-gradient(transparent, rgba(255,60,0,0.04) 50%, transparent);
          animation: scanline 3s linear infinite;
        }
        .grid-bg {
          animation: grid-scroll 2s linear infinite;
        }
        .cursor {
          display: inline-block;
          width: 8px; height: 1em;
          background: #ff3c00;
          animation: blink 1s step-end infinite;
          vertical-align: text-bottom;
          margin-left: 2px;
        }
        .glitch-layer {
          position: absolute; top: 0; left: 0; width: 100%; color: #ff003c;
          animation: glitch-h 2s steps(1) infinite;
          pointer-events: none;
        }
        .pulse-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid #ff3c00;
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      <div
        className={`loader-root fixed inset-0 z-[9999] overflow-hidden ${isExploding ? "exploding" : ""}`}
        style={{ background: "#0e0300" }}
      >
        {/* Animated grid background */}
        <div
          className="grid-bg absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,60,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,60,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Noise overlay */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            opacity: 0.4,
          }}
        />

        {/* Scanline */}
        <div className="scanline" />

        {/* Center glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(255,60,0,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Pulse rings */}
        {[0, 0.7, 1.4].map((delay, i) => (
          <div
            key={i}
            className="pulse-ring"
            style={{
              left: "50%", top: "50%",
              width: 260, height: 260,
              animationDelay: `${delay}s`,
            }}
          />
        ))}

        {/* Fragments (shown on explode) */}
        {isExploding && fragments.map((f, i) => (
          <Fragment key={i} style={f} color={COLORS[i % COLORS.length]} />
        ))}

        {/* Main content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 40,
        }}>

          {/* Title */}
          <div style={{ position: "relative", userSelect: "none" }}>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "0.25em",
              color: "#ff3c00",
              textShadow: "0 0 20px #ff3c0088, 0 0 60px #ff3c0033",
              position: "relative",
            }}>
              {titleGlitch}
              <div className="glitch-layer" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, letterSpacing: "0.25em" }}>
                {titleGlitch}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ width: "min(480px, 80vw)", position: "relative" }}>
            {/* Label */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              color: "rgba(255,60,0,0.6)", fontSize: 11, letterSpacing: "0.2em",
              marginBottom: 8,
            }}>
              <span>PROGRESS</span>
              <span style={{ color: "#ff3c00", fontWeight: "bold" }}>{progress}%</span>
            </div>

            {/* Track */}
            <div style={{
              height: 6, background: "rgba(255,60,0,0.08)",
              border: "1px solid rgba(255,60,0,0.2)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Fill */}
              <div style={{
                position: "absolute", top: 0, left: 0, bottom: 0,
                width: `${progress}%`,
                background: "linear-gradient(90deg, #ff3c00, #ff6b00)",
                boxShadow: "0 0 12px #ff3c00, 0 0 24px #ff6b0088",
                transition: "width 0.1s linear",
              }} />
              {/* Shimmer */}
              <div style={{
                position: "absolute", top: 0, bottom: 0,
                left: `${progress}%`,
                width: 40,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                transform: "translateX(-100%)",
                transition: "left 0.1s linear",
              }} />
            </div>

            {/* Tick marks */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {[0, 25, 50, 75, 100].map(t => (
                <div key={t} style={{
                  fontSize: 9, color: progress >= t ? "#ff3c0066" : "#ffffff11",
                  letterSpacing: "0.1em", transition: "color 0.3s",
                }}>
                  {t.toString().padStart(3, "0")}
                </div>
              ))}
            </div>
          </div>

          {/* Terminal log */}
          <div style={{
            width: "min(520px, 85vw)",
            height: 200,
            background: "rgba(10,2,0,0.6)",
            border: "1px solid rgba(255,60,0,0.12)",
            padding: "12px 16px",
            overflowY: "hidden",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            position: "relative",
          }}>
            {/* Top bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: 22, background: "rgba(255,60,0,0.05)",
              borderBottom: "1px solid rgba(255,60,0,0.1)",
              display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
            }}>
              {["#ff003c","#ffe600","#ff3c00"].map((c,i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />
              ))}
              <span style={{ fontSize: 9, color: "rgba(255,60,0,0.4)", letterSpacing: "0.15em", marginLeft: 4 }}>BUG.LOG</span>
            </div>

            <div style={{ marginTop: 14 }}>
              {visibleLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 11,
                    lineHeight: "1.7",
                    color: i === visibleLines.length - 1 && line === "READY TO BREAK THINGS" ? "#ff3c00" : "rgba(255,60,0,0.55)",
                    letterSpacing: "0.08em",
                    textShadow: i === visibleLines.length - 1 ? "0 0 8px #ff3c0088" : "none",
                  }}
                >
                  <span style={{ color: "rgba(255,60,0,0.3)", marginRight: 8 }}>{">"}</span>
                  {line}
                  {i === visibleLines.length - 1 && <span className="cursor" />}
                </div>
              ))}
            </div>
          </div>

          {/* Corner decorations */}
          {[
            { top: "calc(50% - 180px)", left: "calc(50% - 280px)" },
            { top: "calc(50% - 180px)", right: "calc(50% - 280px)" },
            { bottom: "calc(50% - 180px)", left: "calc(50% - 280px)" },
            { bottom: "calc(50% - 180px)", right: "calc(50% - 280px)" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 16, height: 16,
                borderTop: i < 2 ? "1px solid #ff3c0055" : "none",
                borderBottom: i >= 2 ? "1px solid #ff3c0055" : "none",
                borderLeft: i % 2 === 0 ? "1px solid #ff3c0055" : "none",
                borderRight: i % 2 === 1 ? "1px solid #ff3c0055" : "none",
                ...pos,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AppLoader;