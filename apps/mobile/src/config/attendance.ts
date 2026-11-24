/**
 * Umbrales de faltas del reglamento institucional.
 * Al llegar a 10 faltas corresponde la 1° reincorporación y a las 20 la 2°.
 */
export const REINCORPORATION_THRESHOLDS = [10, 20] as const;

/** Próximo umbral a alcanzar (o el último si ya se superaron todos). */
export const nextThreshold = (faltas: number) => {
  const idx = REINCORPORATION_THRESHOLDS.findIndex((t) => faltas < t);
  const i = idx === -1 ? REINCORPORATION_THRESHOLDS.length - 1 : idx;
  return { value: REINCORPORATION_THRESHOLDS[i], label: `${i + 1}° reincorporación` };
};

export const THRESHOLDS_TEXT = '1° reincorporación a las 10 faltas · 2° a las 20';
