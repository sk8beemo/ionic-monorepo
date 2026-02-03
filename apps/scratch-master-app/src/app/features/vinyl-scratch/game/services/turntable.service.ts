import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TurntableService {
  // Signals для состояния вертушки
  rotationAngle = signal<number>(0);
  rotationVelocity = signal<number>(0);

  // Максимальная скорость вращения (градусов в секунду)
  private readonly MAX_VELOCITY = 720;
  // Коэффициент трения (замедление)
  private readonly FRICTION = 0.95;

  private animationFrameId?: number;
  private lastUpdateTime = 0;

  constructor() {
    this.startAnimationLoop();
  }

  /**
   * Применить вращение (вызывается при свайпе)
   */
  rotate(deltaAngle: number, velocity: number): void {
    const currentAngle = this.rotationAngle();
    const newAngle = (currentAngle + deltaAngle) % 360;
    this.rotationAngle.set(newAngle < 0 ? newAngle + 360 : newAngle);

    // Ограничиваем скорость максимальным значением
    const clampedVelocity = Math.max(
      -this.MAX_VELOCITY,
      Math.min(this.MAX_VELOCITY, velocity)
    );
    this.rotationVelocity.set(clampedVelocity);
  }

  /**
   * Проверка попадания иглы на маркер
   */
  checkCollision(needleAngle: number, markerAngle: number): 'perfect' | 'good' | 'miss' {
    const angleDiff = Math.abs(needleAngle - markerAngle);
    const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);

    // Perfect: отклонение менее 5 градусов
    if (normalizedDiff <= 5) {
      return 'perfect';
    }
    // Good: отклонение менее 15 градусов
    if (normalizedDiff <= 15) {
      return 'good';
    }
    // Miss: больше 15 градусов
    return 'miss';
  }

  /**
   * Запуск анимационного цикла для плавного вращения с инерцией
   */
  private startAnimationLoop(): void {
    const update = (timestamp: number) => {
      if (this.lastUpdateTime === 0) {
        this.lastUpdateTime = timestamp;
      }

      const deltaTime = (timestamp - this.lastUpdateTime) / 1000; // в секундах
      this.lastUpdateTime = timestamp;

      // Применяем инерцию и трение
      let currentVelocity = this.rotationVelocity();
      if (Math.abs(currentVelocity) > 0.1) {
        currentVelocity *= this.FRICTION;
        const currentAngle = this.rotationAngle();
        const newAngle = (currentAngle + currentVelocity * deltaTime) % 360;
        this.rotationAngle.set(newAngle < 0 ? newAngle + 360 : newAngle);
        this.rotationVelocity.set(currentVelocity);
      } else {
        this.rotationVelocity.set(0);
      }

      this.animationFrameId = requestAnimationFrame(update);
    };

    this.animationFrameId = requestAnimationFrame(update);
  }

  /**
   * Остановка анимации (для очистки при уничтожении сервиса)
   */
  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Сброс состояния вертушки
   */
  reset(): void {
    this.rotationAngle.set(0);
    this.rotationVelocity.set(0);
  }
}
