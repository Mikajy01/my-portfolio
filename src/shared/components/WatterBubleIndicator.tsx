import { useEffect, useRef, useState } from "react";

const WaterBubbleIndicator: React.FC<{
    targetRect: DOMRect | null;
    containerRect: DOMRect | null;
    isVisible: boolean;
  }> = ({ targetRect, containerRect, isVisible }) => {
    const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0, top: 0, height: 0 });
    const [isAnimating, setIsAnimating] = useState(false);
    const animFrameRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const DURATION = 480;
  
    const easeSlime = (t: number) => {
      const c4 = (2 * Math.PI) / 3.2;
      if (t === 0) return 0;
      if (t === 1) return 1;
      return Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.5) * c4) + 1;
    };
  
    useEffect(() => {
      if (!targetRect || !containerRect || !isVisible) return;
      const next = {
        left: targetRect.left - containerRect.left,
        width: targetRect.width,
        top: targetRect.top - containerRect.top,
        height: targetRect.height,
      };
      if (bubbleStyle.width === 0) { setBubbleStyle(next); return; }
      const from = { ...bubbleStyle };
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      startTimeRef.current = 0;
      setIsAnimating(true);
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const t = Math.min(elapsed / DURATION, 1);
        const eased = easeSlime(t);
        setBubbleStyle({
          left: from.left + (next.left - from.left) * eased,
          width: from.width + (next.width - from.width) * eased,
          top: from.top + (next.top - from.top) * eased,
          height: from.height + (next.height - from.height) * eased,
        });
        if (t < 1) { animFrameRef.current = requestAnimationFrame(animate); }
        else { setBubbleStyle(next); setIsAnimating(false); }
      };
      animFrameRef.current = requestAnimationFrame(animate);
      return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetRect, containerRect, isVisible]);
  
    if (!isVisible || bubbleStyle.width === 0) return null;
    const scaleX = isAnimating ? 1.08 : 1;
    const scaleY = isAnimating ? 0.85 : 1;
  
    return (
      <div
        style={{
          position: "absolute",
          left: bubbleStyle.left,
          top: bubbleStyle.top,
          width: bubbleStyle.width,
          height: bubbleStyle.height,
          pointerEvents: "none",
          zIndex: 10,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "center center",
          background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.0) 100%)",
          boxShadow: `
            inset 2px 3px 6px rgba(255,255,255,0.6),
            inset -3px -4px 8px rgba(0,0,0,0.15),
            inset 0 0 10px rgba(0,150,255,0.1),
            0 6px 15px rgba(0,0,0,0.1)
          `,
          border: "1px solid rgba(255,255,255,0.3)",
          animation: "waterWobble 4s ease-in-out infinite",
        }}
      >
        <div style={{ position:"absolute", top:"12%", left:"15%", width:"30%", height:"20%", background:"radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)", borderRadius:"50%", transform:"rotate(-15deg)" }} />
        <div style={{ position:"absolute", bottom:"15%", right:"15%", width:"20%", height:"15%", background:"radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)", borderRadius:"50%", transform:"rotate(-15deg)" }} />
        <style>{`@keyframes waterWobble { 0%,100%{border-radius:40px 50px 40px 50px} 33%{border-radius:50px 40px 50px 40px} 66%{border-radius:45px 45px 45px 45px} }`}</style>
      </div>
    );
  };

export default WaterBubbleIndicator;