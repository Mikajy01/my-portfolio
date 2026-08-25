import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface GateRevealProps {
  children: React.ReactNode;
  className?: string;
}

// Ouvre deux portes (gauche/droite) à l'arrivée de la section dans le viewport,
// pour révéler son contenu — déclenché une seule fois.
export const GateReveal: React.FC<GateRevealProps> = ({ children, className }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const gateTransition = { duration: 0.9, ease: [0.83, 0, 0.17, 1] as const };

  return (
    <div className={`relative ${className ?? ""}`}>
      {children}

      <motion.div
        aria-hidden
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, amount: "some", margin: "-15% 0px -15% 0px" }}
        transition={gateTransition}
        className="absolute inset-y-0 left-0 w-1/2 bg-background pointer-events-none origin-left z-20"
      />
      <motion.div
        aria-hidden
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, amount: "some", margin: "-15% 0px -15% 0px" }}
        transition={gateTransition}
        className="absolute inset-y-0 right-0 w-1/2 bg-background pointer-events-none origin-right z-20"
      />
    </div>
  );
};

export default GateReveal;
