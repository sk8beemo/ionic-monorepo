import { HitType } from './marker.model';

export interface Score {
  total: number;
  perfect: number;
  good: number;
  miss: number;
  combo: number;
  maxCombo: number;
  multiplier: number; // множитель комбо (1x, 2x, 3x, etc.)
}

export const SCORE_VALUES: Record<HitType, number> = {
  perfect: 100,
  good: 50,
  miss: 0,
};

export const COMBO_MULTIPLIERS = {
  1: 1, // базовый
  10: 2, // после 10 комбо
  25: 3, // после 25 комбо
  50: 4, // после 50 комбо
  100: 5, // после 100 комбо
};
