export type HitType = 'perfect' | 'good' | 'miss';

export interface Marker {
  id: string;
  angle: number; // угол на пластинке (0-360 градусов)
  timestamp: number; // время появления в миллисекундах от начала трека
  hitType?: HitType; // результат попадания (если уже попадали)
  color: string; // цвет маркера
}
