import { Injectable, signal } from '@angular/core';
import { Score, SCORE_VALUES, COMBO_MULTIPLIERS } from '../models/score.model';
import { HitType } from '../models/marker.model';

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  private score = signal<Score>(this.createInitialScore());

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * Получить текущий счет (signal)
   */
  getScore() {
    return this.score.asReadonly();
  }

  /**
   * Обработать попадание
   */
  recordHit(hitType: HitType): void {
    const currentScore = this.score();
    const newScore: Score = { ...currentScore };

    if (hitType === 'miss') {
      // Промах сбрасывает комбо
      newScore.combo = 0;
      newScore.miss++;
      newScore.multiplier = 1;
    } else {
      // Попадание увеличивает комбо
      newScore.combo++;
      if (hitType === 'perfect') {
        newScore.perfect++;
      } else {
        newScore.good++;
      }

      // Обновляем максимальное комбо
      if (newScore.combo > newScore.maxCombo) {
        newScore.maxCombo = newScore.combo;
      }

      // Вычисляем множитель на основе комбо
      newScore.multiplier = this.calculateMultiplier(newScore.combo);

      // Добавляем очки с учетом множителя
      const basePoints = SCORE_VALUES[hitType];
      newScore.total += basePoints * newScore.multiplier;
    }

    this.score.set(newScore);
  }

  /**
   * Вычислить множитель на основе комбо
   */
  private calculateMultiplier(combo: number): number {
    if (combo >= 100) return COMBO_MULTIPLIERS[100];
    if (combo >= 50) return COMBO_MULTIPLIERS[50];
    if (combo >= 25) return COMBO_MULTIPLIERS[25];
    if (combo >= 10) return COMBO_MULTIPLIERS[10];
    return COMBO_MULTIPLIERS[1];
  }

  /**
   * Сброс счета
   */
  reset(): void {
    this.score.set(this.createInitialScore());
  }

  /**
   * Создать начальный счет
   */
  private createInitialScore(): Score {
    return {
      total: 0,
      perfect: 0,
      good: 0,
      miss: 0,
      combo: 0,
      maxCombo: 0,
      multiplier: 1,
    };
  }
}
