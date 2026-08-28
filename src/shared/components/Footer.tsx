import React from "react";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ borderColor: "var(--color-border)" }}>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-wrap gap-4 justify-between font-mono text-[10px] tracking-[.16em] uppercase text-text-muted">
          <span>© {currentYear} Mikajisoa Selly-Rafaj — {t("footer.copyright")}</span>
          <span>Fianarantsoa, Madagascar</span>
        </div>
      </div>
    </footer>
  );
};
