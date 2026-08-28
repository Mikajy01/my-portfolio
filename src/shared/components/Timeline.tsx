interface TimelineEntry {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
}

interface TimelineProps {
  id: string;
  eyebrow: string;
  rangeLabel: string;
  entries: TimelineEntry[];
}

// Frise chronologique réutilisée par Experience et Education : repère année
// à gauche, ligne verticale, contenu à droite.
export const Timeline: React.FC<TimelineProps> = ({ id, eyebrow, rangeLabel, entries }) => (
  <section id={id} className="relative z-1 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-24 lg:py-32">
    <div data-reveal className="flex items-baseline gap-5 mb-16">
      <span className="font-mono text-[11px] tracking-[.18em] text-primary">{eyebrow}</span>
      <span className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
      <span className="font-mono text-[11px] tracking-[.14em] text-text-muted hidden sm:inline">{rangeLabel}</span>
    </div>

    <div className="grid grid-cols-[80px_1px_minmax(0,1fr)] sm:grid-cols-[120px_1px_minmax(0,1fr)]">
      <div className="col-start-2" style={{ background: "var(--color-border)", gridRow: `1 / span ${entries.length}` }} />

      {entries.map((entry, idx) => {
        const isLast = idx === entries.length - 1;
        return (
          <div key={entry.id} data-reveal className="contents">
            <div
              className="col-start-1 text-right font-mono text-xs tracking-[.12em] text-primary pr-4 sm:pr-6"
              style={{ paddingBottom: isLast ? 0 : 56 }}
            >
              {entry.period.split(" - ")[0]}
            </div>
            <div className="col-start-3 relative pl-8" style={{ paddingBottom: isLast ? 0 : 56 }}>
              <span
                className="absolute -left-1 top-[7px] w-2 h-2"
                style={
                  isLast
                    ? { background: "var(--color-primary)", animation: "pulseDot 2.6s ease-in-out infinite" }
                    : { background: "var(--color-background)", border: "1px solid var(--color-primary)" }
                }
              />
              <div className="font-heading font-semibold text-[1.6rem] leading-tight tracking-[-.01em] mb-1 text-text-primary">
                {entry.title}
              </div>
              <div className="font-mono text-[10.5px] tracking-[.14em] uppercase text-text-muted mb-3">
                {entry.organization} · {entry.period}
              </div>
              <p className="text-[14.5px] leading-relaxed text-text-secondary max-w-[60ch] m-0">{entry.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default Timeline;
