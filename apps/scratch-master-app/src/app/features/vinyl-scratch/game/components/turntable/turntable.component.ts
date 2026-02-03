import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  effect,
} from '@angular/core';
import { TurntableService } from '../../services/turntable.service';
import { RhythmService } from '../../services/rhythm.service';
import { ScoringService } from '../../services/scoring.service';
import { Marker } from '../../models/marker.model';

/* eslint-disable @angular-eslint/prefer-standalone */
@Component({
  selector: 'app-turntable',
  standalone: false,
  templateUrl: './turntable.component.html',
  styleUrl: './turntable.component.scss',
})
/* eslint-enable @angular-eslint/prefer-standalone */
export class TurntableComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private turntableService = inject(TurntableService);
  private rhythmService = inject(RhythmService);
  private scoringService = inject(ScoringService);

  private animationFrameId?: number;

  // Состояние компонента
  rotationAngle = 0;
  needleAngle = 0;
  markers: Marker[] = [];
  currentTime = 0;

  // Параметры отрисовки
  private readonly PLATTER_RADIUS = 150; // радиус пластинки в пикселях
  private readonly NEEDLE_LENGTH = 20; // длина иглы в пикселях
  private readonly MARKER_SIZE = 8; // размер маркера

  private lastTouchAngle = 0;
  private isDragging = false;

  constructor() {
    // Эффект для отслеживания изменений угла вращения
    effect(() => {
      this.rotationAngle = this.turntableService.rotationAngle();
    });

    // Эффект для отслеживания маркеров
    effect(() => {
      this.markers = this.rhythmService.getActiveMarkersSignal()();
    });
  }

  ngOnInit(): void {
    this.setupCanvas();
    this.setupEventListeners();
    this.startRenderLoop();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.removeEventListeners();
  }

  /**
   * Настройка canvas
   */
  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  /**
   * Настройка обработчиков событий для свайпа
   */
  private setupEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    // Touch события
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this), {
      passive: false,
    });
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this), {
      passive: false,
    });
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this), {
      passive: false,
    });

    // Mouse события (для тестирования на десктопе)
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
  }

  /**
   * Удаление обработчиков событий
   */
  private removeEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
    canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
    canvas.removeEventListener('touchend', this.onTouchEnd.bind(this));
    canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
    canvas.removeEventListener('mouseleave', this.onMouseUp.bind(this));
  }

  /**
   * Обработка начала касания
   */
  private onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length > 0) {
      this.isDragging = true;
      this.updateAngleFromTouch(event.touches[0]);
    }
  }

  /**
   * Обработка движения касания
   */
  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (this.isDragging && event.touches.length > 0) {
      this.updateAngleFromTouch(event.touches[0]);
    }
  }

  /**
   * Обработка окончания касания
   */
  private onTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  /**
   * Обработка начала клика мыши
   */
  private onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.updateAngleFromMouse(event);
  }

  /**
   * Обработка движения мыши
   */
  private onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.updateAngleFromMouse(event);
    }
  }

  /**
   * Обработка окончания клика мыши
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onMouseUp(_event: MouseEvent): void {
    this.isDragging = false;
  }

  /**
   * Обновление угла из touch события
   */
  private updateAngleFromTouch(touch: Touch): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = touch.clientX - rect.left - centerX;
    const y = touch.clientY - rect.top - centerY;

    this.updateAngle(x, y);
  }

  /**
   * Обновление угла из mouse события
   */
  private updateAngleFromMouse(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    this.updateAngle(x, y);
  }

  /**
   * Обновление угла вращения
   */
  private updateAngle(x: number, y: number): void {
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const normalizedAngle = angle < 0 ? angle + 360 : angle;

    // Вычисляем дельту угла и скорость
    let deltaAngle = normalizedAngle - this.lastTouchAngle;

    // Обработка перехода через 0/360
    if (deltaAngle > 180) {
      deltaAngle -= 360;
    } else if (deltaAngle < -180) {
      deltaAngle += 360;
    }

    // Вычисляем скорость на основе дельты
    const velocity = deltaAngle * 15; // коэффициент скорости

    this.turntableService.rotate(deltaAngle, velocity);
    this.needleAngle = normalizedAngle;
    this.lastTouchAngle = normalizedAngle;
  }

  /**
   * Проверка попаданий на маркеры
   */
  private checkHits(): void {
    const activeMarkers = this.rhythmService.getActiveMarkers(
      this.currentTime,
      1000
    );

    activeMarkers.forEach((marker) => {
      if (!marker.hitType) {
        // Проверяем, находится ли маркер в окне времени для попадания (±300ms)
        const timeDiff = Math.abs(marker.timestamp - this.currentTime);
        if (timeDiff <= 300) {
          // Учитываем вращение пластинки: маркер вращается вместе с пластинкой
          // Реальный угол маркера = исходный угол + угол вращения пластинки
          const markerRealAngle = (marker.angle + this.rotationAngle) % 360;
          
          const hitType = this.turntableService.checkCollision(
            this.needleAngle,
            markerRealAngle
          );

          if (hitType !== 'miss') {
            this.rhythmService.markAsHit(marker.id, hitType);
            this.scoringService.recordHit(hitType);
            // Визуальная обратная связь (можно добавить эффект)
            this.showHitFeedback(hitType);
          }
        }
      }
    });
  }

  /**
   * Показать визуальную обратную связь при попадании
   */
  private showHitFeedback(hitType: 'perfect' | 'good'): void {
    // Простая визуальная обратная связь через console (можно заменить на визуальные эффекты)
    console.log(`Hit: ${hitType}`);
  }

  /**
   * Цикл отрисовки
   */
  private startRenderLoop(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      this.checkHits();
      this.draw(
        ctx,
        canvas.width / window.devicePixelRatio,
        canvas.height / window.devicePixelRatio
      );
      this.animationFrameId = requestAnimationFrame(render);
    };

    this.animationFrameId = requestAnimationFrame(render);
  }

  /**
   * Отрисовка игрового поля
   */
  private draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const centerX = width / 2;
    const centerY = height / 2;

    // Очистка canvas
    ctx.clearRect(0, 0, width, height);

    // Сохранение контекста
    ctx.save();

    // Перемещение в центр
    ctx.translate(centerX, centerY);

    // Вращение пластинки
    ctx.rotate((this.rotationAngle * Math.PI) / 180);

    // Отрисовка пластинки
    this.drawPlatter(ctx);

    // Отрисовка маркеров
    this.drawMarkers(ctx);

    // Восстановление контекста
    ctx.restore();

    // Отрисовка иглы (не вращается вместе с пластинкой)
    this.drawNeedle(ctx, centerX, centerY);
  }

  /**
   * Отрисовка виниловой пластинки
   */
  private drawPlatter(ctx: CanvasRenderingContext2D): void {
    const radius = this.PLATTER_RADIUS;

    // Внешний круг (основа пластинки)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Внутренний круг (центр)
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Бороздки (концентрические круги)
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    for (let i = 0.4; i < 1; i += 0.1) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * i, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  /**
   * Отрисовка маркеров
   */
  private drawMarkers(ctx: CanvasRenderingContext2D): void {
    const radius = this.PLATTER_RADIUS;
    const activeMarkers = this.rhythmService.getActiveMarkers(
      this.currentTime,
      2000
    );

    activeMarkers.forEach((marker) => {
      // Маркеры вращаются вместе с пластинкой, поэтому используем исходный угол
      const angle = (marker.angle * Math.PI) / 180;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Если маркер уже попадал, делаем его полупрозрачным и меняем цвет
      if (marker.hitType) {
        ctx.globalAlpha = 0.3;
        // Зеленый для попаданий
        ctx.fillStyle = marker.hitType === 'perfect' ? '#4ade80' : '#fbbf24';
      } else {
        ctx.globalAlpha = 1;
        ctx.fillStyle = marker.color;
        
        // Пульсация для активных маркеров в зоне попадания
        const timeDiff = Math.abs(marker.timestamp - this.currentTime);
        if (timeDiff <= 300) {
          const pulse = Math.sin((Date.now() / 100) % (Math.PI * 2));
          const pulseSize = this.MARKER_SIZE + pulse * 2;
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.arc(x, y, this.MARKER_SIZE, 0, Math.PI * 2);
      ctx.fill();

      // Обводка маркера
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = marker.hitType ? 2 : 1;
      ctx.stroke();

      ctx.globalAlpha = 1;
    });
  }

  /**
   * Отрисовка иглы
   */
  private drawNeedle(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number
  ): void {
    const angle = (this.needleAngle * Math.PI) / 180;
    const radius = this.PLATTER_RADIUS;
    const endX = centerX + Math.cos(angle) * radius;
    const endY = centerY + Math.sin(angle) * radius;

    // Линия иглы
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Конец иглы (точка)
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Установить текущее время (для синхронизации с музыкой)
   */
  setCurrentTime(time: number): void {
    this.currentTime = time;
  }
}
