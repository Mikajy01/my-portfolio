// Géométrie partagée entre le canvas d'étoiles (HyperspaceCanvas) et le
// "hublot" qui révèle le vrai site (App.tsx) — les deux doivent utiliser
// exactement les mêmes formules et le même point de départ pour rester
// parfaitement synchronisés, sans dupliquer la logique.

// ⚠️ TEMPORAIRE — ralenti pour permettre une capture d'écran de chaque
// phase. Remettre à 1 une fois le réglage validé.
export const DEBUG_SLOWMO = 1;

export const MAX_DEPTH = 1.8;
export const IDLE_SPEED = 0.0035 / DEBUG_SLOWMO;
export const JUMP_SPEED = 0.1 / DEBUG_SLOWMO;

// Trois temps, en ms depuis le clic :
// 1. ACCEL    — on engage le saut, le champ d'étoiles s'étire à pleine vitesse
// 2. DECEL    — sortie d'hyperespace, ralentissement net ; l'étoile de
//    destination, elle, reste stable et devient visible
// 3. APPROACH — poussée finale droit sur cette étoile, qui grossit jusqu'à
//    remplir l'écran (et devient la fenêtre sur le vrai site)
export const BEAT_ACCEL_END = 500 * DEBUG_SLOWMO;
export const BEAT_DECEL_END = 780 * DEBUG_SLOWMO;
export const BEAT_APPROACH_END = 1300 * DEBUG_SLOWMO;
// Durée totale à couvrir avant de considérer le saut terminé (léger tampon
// après la fin de la poussée finale).
export const JUMP_DURATION_MS = BEAT_APPROACH_END + 180 * DEBUG_SLOWMO;

const DEST_Z_FAR = MAX_DEPTH * 1.1;
const DEST_Z_HOLD = MAX_DEPTH * 0.92;
const DEST_Z_ARRIVED = 0.05;
// Léger décalage du hors-centre, comme le point de fuite de la référence.
const DEST_OFFSET = { x: 0.06, y: -0.04 };

const easeInCubic = (t: number) => t * t * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function genericSpeed(elapsed: number | null): number {
  if (elapsed === null) return IDLE_SPEED;
  if (elapsed < BEAT_ACCEL_END) {
    return IDLE_SPEED + (JUMP_SPEED - IDLE_SPEED) * easeInCubic(elapsed / BEAT_ACCEL_END);
  }
  if (elapsed < BEAT_DECEL_END) {
    const t = (elapsed - BEAT_ACCEL_END) / (BEAT_DECEL_END - BEAT_ACCEL_END);
    return JUMP_SPEED + (IDLE_SPEED - JUMP_SPEED) * easeOutCubic(t);
  }
  return IDLE_SPEED;
}

function destinationZ(elapsed: number | null): number {
  if (elapsed === null) return DEST_Z_FAR;
  if (elapsed < BEAT_DECEL_END) {
    const t = elapsed / BEAT_DECEL_END;
    return DEST_Z_FAR + (DEST_Z_HOLD - DEST_Z_FAR) * t;
  }
  const t = Math.min((elapsed - BEAT_DECEL_END) / (BEAT_APPROACH_END - BEAT_DECEL_END), 1);
  return DEST_Z_HOLD + (DEST_Z_ARRIVED - DEST_Z_HOLD) * easeInCubic(t);
}

export interface DestinationGeometry {
  /** Position écran (px) de l'étoile de destination — fixe, ne dérive pas. */
  dx: number;
  dy: number;
  /** 0 (loin) → 1 (arrivé). */
  proximity: number;
}

export function getDestinationGeometry(elapsed: number | null, width: number, height: number): DestinationGeometry {
  const cx = width / 2;
  const cy = height / 2;
  const focal = Math.min(width, height) * 0.55;
  // Décalage écran calculé une fois pour toutes sur la profondeur de
  // départ : diviser par une profondeur qui tend vers 0 ferait dériver le
  // point vers un coin au lieu de simplement grossir sur place.
  const dx = cx + (DEST_OFFSET.x / DEST_Z_FAR) * focal;
  const dy = cy + (DEST_OFFSET.y / DEST_Z_FAR) * focal;
  const destZ = destinationZ(elapsed);
  const proximity = Math.min(1, Math.max(0, 1 - destZ / DEST_Z_FAR));
  return { dx, dy, proximity };
}
