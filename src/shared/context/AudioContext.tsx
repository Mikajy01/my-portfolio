import React, { createContext, useContext, useRef } from "react";

type AudioRef = React.RefObject<HTMLAudioElement | null>;

const AudioRefContext = createContext<AudioRef | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <AudioRefContext.Provider value={audioRef}>
      {children}
      <audio ref={audioRef} src="/sounds/keyboard-typing.mp3" preload="auto" />
    </AudioRefContext.Provider>
  );
};

export const useSharedAudio = (): AudioRef => {
  const ctx = useContext(AudioRefContext);
  if (!ctx) throw new Error("useSharedAudio must be used within an AudioProvider");
  return ctx;
};
