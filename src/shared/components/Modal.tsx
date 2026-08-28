import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import Corner from "./Corner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  reducedMotion?: boolean;
}

// Modal léger : portail sur <body>, fondu + léger scale, sans effets superflus.
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  reducedMotion = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const transition = { duration: reducedMotion ? 0.15 : 0.25, ease: "easeOut" as const };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9999 }}
          className="flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            onClick={onClose}
            style={{ position: "fixed", inset: 0 }}
            className={`bg-black/70 cursor-pointer ${reducedMotion ? "" : "backdrop-blur-sm"}`}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={transition}
            className={twMerge(
              "blueprint relative w-full max-w-lg z-10 border p-8 text-text-primary",
              className
            )}
            style={{ background: "var(--color-surface-elevated)", borderColor: "var(--color-border)" }}
          >
            <Corner />
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="blueprint absolute top-4 right-4 w-8 h-8 grid place-items-center border border-border bg-surface-elevated text-text-muted hover:text-primary hover:border-primary transition-colors"
            >
              <Corner />
              <X size={16} />
            </button>

            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
