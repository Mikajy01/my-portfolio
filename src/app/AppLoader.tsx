import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Corner from "../shared/components/Corner";

const LOAD_DURATION = 1100;

export const AppLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const p = Math.min((Date.now() - start) / LOAD_DURATION, 1);
      setProgress(Math.floor(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          onComplete();
        }, 300);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-6 bg-background"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="blueprint relative w-14 h-14 grid place-items-center border font-heading font-semibold text-lg text-primary"
            style={{ borderColor: "var(--color-border)" }}
          >
            <Corner />
            MSR
          </motion.div>

          <div className="w-40 sm:w-48 h-px overflow-hidden" style={{ background: "var(--color-border)" }}>
            <div
              className="h-full"
              style={{ width: `${progress}%`, background: "var(--color-primary)", transition: "width 0.1s linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppLoader;
