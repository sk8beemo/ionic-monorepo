import { Injectable, signal } from '@angular/core';
import { Marker } from '../models/marker.model';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root',
})
export class RhythmService {
  private activeMarkers = signal<Marker[]>([]);

  constructor() {}

  /**
   * Получить активные маркеры (signal)
   */
  getActiveMarkersSignal() {
    return this.activeMarkers.asReadonly();
  }

  /**
   * Генерировать маркеры для трека на основе BPM
   */
  generateMarkers(track: Track): Marker[] {
    const markers: Marker[] = [];
    const durationMs = track.duration * 1000;
    const beatInterval = (60 / track.bpm) * 1000; // интервал между битами в миллисекундах

    // Генерируем маркеры на каждый бит
    for (let time = 0; time < durationMs; time += beatInterval) {
      // Случайный угол для каждого маркера (0-360 градусов)
      const angle = Math.random() * 360;

      markers.push({
        id: `marker-${time}`,
        angle,
        timestamp: time,
        color: this.getColorForDifficulty(track.difficulty),
      });
    }

    this.activeMarkers.set(markers);
    return markers;
  }

  /**
   * Получить активные маркеры для текущего времени
   */
  getActiveMarkers(currentTime: number, windowMs: number = 2000): Marker[] {
    const allMarkers = this.activeMarkers();
    // Возвращаем маркеры, которые должны быть видны в ближайшие windowMs миллисекунд
    // Также показываем маркеры, которые уже прошли, но не более чем на windowMs назад
    return allMarkers.filter(
      (marker) =>
        marker.timestamp >= currentTime - windowMs / 2 &&
        marker.timestamp <= currentTime + windowMs &&
        !marker.hitType // только не попадавшие маркеры
    );
  }

  /**
   * Отметить маркер как попадавший
   */
  markAsHit(markerId: string, hitType: 'perfect' | 'good' | 'miss'): void {
    const markers = this.activeMarkers();
    const updatedMarkers = markers.map((marker) =>
      marker.id === markerId ? { ...marker, hitType } : marker
    );
    this.activeMarkers.set(updatedMarkers);
  }

  /**
   * Получить цвет маркера в зависимости от сложности
   */
  private getColorForDifficulty(
    difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  ): string {
    switch (difficulty) {
      case 'easy':
        return '#4ade80'; // зеленый
      case 'medium':
        return '#fbbf24'; // желтый
      case 'hard':
        return '#f87171'; // красный
      case 'expert':
        return '#a78bfa'; // фиолетовый
      default:
        return '#60a5fa'; // синий
    }
  }

  /**
   * Сброс маркеров
   */
  reset(): void {
    this.activeMarkers.set([]);
  }
}
