import React, { createContext, useContext, useEffect, useRef } from "react";

type AudioRef = React.RefObject<HTMLAudioElement | null>;

const AudioRefContext = createContext<AudioRef | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Filet de sécurité : le clic sur "Entrer" du loader tente déjà de
  // déverrouiller le son, mais sur certains navigateurs/réseaux (le fichier
  // n'a pas fini de charger au moment du clic, notamment en prod où le
  // téléchargement n'est pas quasi instantané comme en local) cette
  // tentative peut échouer silencieusement — et sans filet, plus aucun son
  // ne se déclenche jamais tant que le navigateur ne décide pas de
  // lui-même d'assouplir sa politique d'autoplay. On retente donc à chaque
  // interaction jusqu'à ce qu'une tentative aboutisse réellement (play()
  // qui résout), puis on arrête — pour ne pas couper un son en train de
  // jouer légitimement plus tard (le typing du terminal, par ex.).
  useEffect(() => {
    let unlocked = false;

    const cleanup = () => {
      window.removeEventListener("pointerdown", tryUnlock);
      window.removeEventListener("keydown", tryUnlock);
    };
    const tryUnlock = () => {
      if (unlocked) return;
      const audio = audioRef.current;
      audio
        ?.play()
        .then(() => {
          unlocked = true;
          audio.pause();
          cleanup();
        })
        .catch(() => {});
    };

    window.addEventListener("pointerdown", tryUnlock, { passive: true });
    window.addEventListener("keydown", tryUnlock);
    return cleanup;
  }, []);

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
