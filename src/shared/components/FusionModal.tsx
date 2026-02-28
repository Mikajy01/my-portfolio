import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface FusionModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  reducedMotion?: boolean;
}

const FusionModal: React.FC<FusionModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  reducedMotion = false,
}) => {
  const shards = [
    {
      id: "top-left",
      initial: { x: "-200%", y: "-100%", rotate: -45, opacity: 0, scale: 0 },
      clipPath: "polygon(0 0, 100% 0, 50% 50%, 0 100%)",
      className:
        "bg-surface border-b border-r border-primary/30 rounded-tl-[var(--radius-card)]",
    },
    {
      id: "top-right",
      initial: { x: "200%", y: "-100%", rotate: 45, opacity: 0, scale: 0 },
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 50%)",
      className:
        "bg-surface border-b border-l border-primary/30 rounded-tr-[var(--radius-card)]",
    },
    {
      id: "bottom-left",
      initial: { x: "-200%", y: "100%", rotate: 45, opacity: 0, scale: 0 },
      clipPath: "polygon(0 0, 50% 50%, 100% 100%, 0 100%)",
      className:
        "bg-surface border-t border-r border-primary/30 rounded-bl-[var(--radius-card)]",
    },
    {
      id: "bottom-right",
      initial: { x: "200%", y: "100%", rotate: -45, opacity: 0, scale: 0 },
      clipPath: "polygon(50% 50%, 100% 0, 100% 100%, 0 100%)",
      className:
        "bg-surface border-t border-l border-primary/30 rounded-br-[var(--radius-card)]",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.2 : 0.3 }}
            onClick={onClose}
            className={`fixed inset-0 bg-black/80 cursor-pointer ${
              reducedMotion ? '' : 'backdrop-blur-sm'
            }`}
          />

          {/* Conteneur Principal */}
          <div
            className={twMerge(
              "relative w-full max-w-lg max-h-full z-30",
              className
            )}
          >
            {/* 1. LUMIÈRE D'AMBIANCE - Simplifiée pour appareils lents */}
            {!reducedMotion && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.5] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-2/3 h-2/3 rounded-full bg-primary blur-[80px] pointer-events-none opacity-40"
              />
            )}

            {/* 2. FLASH D'IMPACT - Désactivé pour appareils lents */}
            {!reducedMotion && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 2, 0] }}
                transition={{ duration: 1.6 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-4 h-4 bg-white rounded-full shadow-[0_0_50px_20px_var(--color-glow)] pointer-events-none"
              />
            )}

            {/* 3. LES 4 BLOCS (SHARDS) + OMBRE CORRECTIVE */}
            <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
              
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }} 
                className="absolute inset-0 w-full h-full rounded-(--radius-card) shadow-2xl"
              />

              {shards.map((shard) => (
                <motion.div
                  key={shard.id}
                  initial={reducedMotion ? { opacity: 0 } : shard.initial}
                  animate={reducedMotion ?
                    { opacity: 1 } :
                    { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }
                  }
                  exit={reducedMotion ?
                    { opacity: 0, transition: { duration: 0.2 } } :
                    { ...shard.initial, transition: { duration: 1.5 } }
                  }
                  transition={reducedMotion ? {
                    duration: 0.2
                  } : {
                    type: "spring",
                    stiffness: 40,
                    damping: 14,
                    mass: 1.2,
                    delay: 0.1,
                  }}
                  style={{ clipPath: shard.clipPath }}
                  className={`absolute inset-0 w-full h-full ${shard.className}`}
                />
              ))}
            </div>

            {/* 4. CONTENU DU MODAL */}
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={reducedMotion ? {
                duration: 0.2
              } : {
                delay: 1.6, duration: 0.4
              }}
              className="relative z-30 w-full p-8 text-text-primary flex flex-col"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary transition-colors bg-surface-elevated/50 rounded-full hover:bg-surface-elevated"
              >
                <X size={20} />
              </button>

              <div className="mt-4">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FusionModal;