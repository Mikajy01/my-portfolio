import React, { useEffect, useRef, useState } from "react";

export const ProfileImage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const animFrameRef = useRef<number>(0);
  const [glitching, setGlitching] = useState(false);

  // ── Glitch canvas effect ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 400;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let frameCount = 0;
    let isGlitching = false;
    let glitchIntensity = 0;
    let glitchTimer = 0;

    const drawBase = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
    };

    const applyGlitch = () => {
      const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
      const data = imageData.data;

      // RGB channel shift
      const shiftX = Math.floor((Math.random() - 0.5) * 20 * glitchIntensity);
      const shiftY = Math.floor((Math.random() - 0.5) * 6 * glitchIntensity);

      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          const i = (y * SIZE + x) * 4;
          const ri = ((y + shiftY) * SIZE + (x + shiftX)) * 4;
          const bi = ((y - shiftY) * SIZE + (x - shiftX)) * 4;

          if (ri >= 0 && ri < data.length) data[i] = data[ri];         // R shifted
          if (bi >= 0 && bi < data.length) data[i + 2] = data[bi + 2]; // B shifted
        }
      }

      // Horizontal scan lines
      const numSlices = Math.floor(Math.random() * 6 * glitchIntensity) + 1;
      for (let s = 0; s < numSlices; s++) {
        const sliceY = Math.floor(Math.random() * SIZE);
        const sliceH = Math.floor(Math.random() * 8) + 1;
        const sliceShift = Math.floor((Math.random() - 0.5) * 40 * glitchIntensity);

        for (let y = sliceY; y < Math.min(sliceY + sliceH, SIZE); y++) {
          for (let x = 0; x < SIZE; x++) {
            const i = (y * SIZE + x) * 4;
            const si = (y * SIZE + ((x + sliceShift + SIZE) % SIZE)) * 4;
            data[i]     = data[si];
            data[i + 1] = data[si + 1];
            data[i + 2] = data[si + 2];
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Overlay rouge/cyan semi-transparent
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = `rgba(255, 0, 40, ${0.04 * glitchIntensity})`;
      ctx.fillRect(shiftX, 0, SIZE, SIZE);
      ctx.fillStyle = `rgba(0, 255, 200, ${0.04 * glitchIntensity})`;
      ctx.fillRect(-shiftX, 0, SIZE, SIZE);
      ctx.globalCompositeOperation = "source-over";
    };

    const animate = () => {
      frameCount++;
      glitchTimer++;

      // Déclencher un glitch aléatoirement
      if (!isGlitching && glitchTimer > 60 && Math.random() < 0.015) {
        isGlitching = true;
        glitchIntensity = Math.random() * 0.7 + 0.3;
        glitchTimer = 0;
        setGlitching(true);
        setTimeout(() => {
          isGlitching = false;
          glitchIntensity = 0;
          setGlitching(false);
        }, 150 + Math.random() * 250);
      }

      drawBase();
      if (isGlitching) applyGlitch();

      animFrameRef.current = requestAnimationFrame(animate);
    };

    if (img.complete) {
      animate();
    } else {
      img.onload = animate;
    }

    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto select-none">

      {/* ── Anneaux décoratifs glitch ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Anneau principal animé */}
        <div
          className="absolute w-full h-full rounded-full border-2 opacity-30"
          style={{
            borderColor: "var(--color-primary)",
            animation: "spin 12s linear infinite",
            borderStyle: "dashed",
          }}
        />
        <div
          className="absolute w-[85%] h-[85%] rounded-full border opacity-20"
          style={{
            borderColor: "var(--color-accent)",
            animation: "spin 8s linear infinite reverse",
            borderStyle: "dotted",
          }}
        />
        {/* Coins glitch */}
        {[
          "top-0 left-0 border-t-2 border-l-2 w-6 h-6",
          "top-0 right-0 border-t-2 border-r-2 w-6 h-6",
          "bottom-0 left-0 border-b-2 border-l-2 w-6 h-6",
          "bottom-0 right-0 border-b-2 border-r-2 w-6 h-6",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute ${cls} opacity-60`}
            style={{
              borderColor: "var(--color-primary)",
              animation: `glitch-corner ${1.5 + i * 0.3}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── Image container ── */}
      <div className="relative z-10 aspect-square">
        {/* Image cachée pour le canvas */}
        <img
          ref={imgRef}
          src="images/profile_picture.png"
          alt="RATSIMBAZAFY Mikajisoa Selly-Rafaj"
          className="hidden"
          crossOrigin="anonymous"
        />

        {/* Canvas glitch */}
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-full object-cover"
          style={{
            border: "2px solid var(--color-primary)",
            boxShadow: glitching
              ? "0 0 0 2px #ff0028, 4px 0 0 2px #00ffc8, -4px 0 0 2px #ff0028, 0 0 40px var(--color-glow)"
              : "0 0 30px var(--color-glow)",
            transition: "box-shadow 0.05s",
          }}
        />

        {/* Overlay scanlines subtil */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          }}
        />

        {/* Badge "MR.BUG" */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold font-mono tracking-widest z-20 border"
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
            boxShadow: "0 0 10px var(--color-glow)",
          }}
        >
          MR.BUG
        </div>
      </div>

      {/* ── Lueur de fond ── */}
      <div
        className="absolute inset-0 rounded-full -z-10 blur-3xl opacity-30"
        style={{ background: "var(--color-primary)" }}
      />

      {/* Styles keyframes inline */}
      <style>{`
        @keyframes glitch-corner {
          0%   { opacity: 0.6; transform: translate(0, 0); }
          50%  { opacity: 1;   transform: translate(${Math.random() > 0.5 ? "2px" : "-2px"}, 1px); }
          100% { opacity: 0.4; transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};