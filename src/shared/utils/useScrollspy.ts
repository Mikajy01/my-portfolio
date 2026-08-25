import { useState, useEffect } from 'react';

export const useScrollspy = (sectionIds: string[], offset: number = 100) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const idsKey = sectionIds.join(',');

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : [];
    if (ids.length === 0) return;

    // getBoundingClientRect() est toujours relatif au viewport, contrairement à
    // offsetTop qui dépend du plus proche ancêtre positionné (peut casser si un
    // wrapper "relative" est inséré entre la section et son parent d'origine).
    const handleScroll = () => {
      let current = '';

      for (const sectionId of ids) {
        const section = document.getElementById(sectionId);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          current = sectionId;
          break;
        }
      }

      // Si on a dépassé la dernière section (ex: dans le footer), on garde
      // celle-ci active plutôt que de figer l'état sur une valeur périmée.
      if (!current) {
        const lastId = ids[ids.length - 1];
        const lastSection = document.getElementById(lastId);
        if (lastSection && lastSection.getBoundingClientRect().top <= offset) {
          current = lastId;
        }
      }

      if (current) setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [idsKey, offset]);

  return activeSection;
};
