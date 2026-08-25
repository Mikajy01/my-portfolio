import React from "react";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaGitAlt } from "react-icons/fa";
import { SiTypescript, SiNestjs, SiTailwindcss, SiDocker, SiPostgresql } from "react-icons/si";

interface FloatingIcon {
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  label: string;
  top: string;
  left: string;
  size: string;
  duration: number;
  delay: number;
}

const FLOATING_ICONS: FloatingIcon[] = [
  { Icon: FaReact,       color: "#61DAFB", label: "React",      top: "2%",  left: "50%", size: "w-11 h-11", duration: 4.2, delay: 0 },
  { Icon: SiTypescript,  color: "#3178C6", label: "TypeScript", top: "18%", left: "88%", size: "w-10 h-10", duration: 4.8, delay: 0.4 },
  { Icon: SiNestjs,      color: "#E0234E", label: "NestJS",     top: "50%", left: "97%", size: "w-11 h-11", duration: 3.8, delay: 0.2 },
  { Icon: FaNodeJs,      color: "#339933", label: "Node.js",    top: "82%", left: "88%", size: "w-10 h-10", duration: 5.2, delay: 0.6 },
  { Icon: SiTailwindcss, color: "#38BDF8", label: "Tailwind",   top: "98%", left: "50%", size: "w-11 h-11", duration: 4.4, delay: 0.3 },
  { Icon: SiDocker,      color: "#2496ED", label: "Docker",     top: "82%", left: "12%", size: "w-10 h-10", duration: 4.9, delay: 0.5 },
  { Icon: SiPostgresql,  color: "#4169E1", label: "PostgreSQL", top: "50%", left: "3%",  size: "w-11 h-11", duration: 3.6, delay: 0.1 },
  { Icon: FaGitAlt,      color: "#F05032", label: "Git",        top: "18%", left: "12%", size: "w-10 h-10", duration: 4.6, delay: 0.7 },
];

export const ProfileImage: React.FC = () => {
  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto aspect-square select-none">
      {/* Lueur d'ambiance */}
      <div
        className="absolute inset-[15%] rounded-full blur-3xl opacity-25"
        style={{ background: "var(--color-primary)" }}
      />

      {/* Photo de profil, fond transparent, sans découpe circulaire */}
      <img
        src="/images/profile_picture_2.png"
        alt="RATSIMBAZAFY Mikajisoa Selly-Rafaj"
        className="absolute left-1/2 top-1/2 h-[60%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
        style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.18))" }}
      />

      {/* Icônes de stack flottantes autour de la photo */}
      {FLOATING_ICONS.map(({ Icon, color, label, top, left, size, duration, delay }) => (
        <motion.div
          key={label}
          className={`absolute -translate-x-1/2 -translate-y-1/2 ${size} rounded-2xl bg-surface-elevated border border-border shadow-lg flex items-center justify-center`}
          style={{ top, left }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
          title={label}
        >
          <Icon className="w-1/2 h-1/2" style={{ color }} />
        </motion.div>
      ))}
    </div>
  );
};
