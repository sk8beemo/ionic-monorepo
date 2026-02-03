import { Component, OnInit, OnDestroy, inject, ViewChild, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TurntableComponent } from './components/turntable/turntable.component';
import { TurntableService } from './services/turntable.service';
import { RhythmService } from './services/rhythm.service';
import { ScoringService } from './services/scoring.service';
import { Track } from './models/track.model';
import { GameState } from './models/game-state.model';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild(TurntableComponent) turntableComponent!: TurntableComponent;

  private router = inject(Router);
  private turntableService = inject(TurntableService);
  private rhythmService = inject(RhythmService);
  private scoringService = inject(ScoringService);

  private gameInterval?: number;

  // Signals для состояния игры
  gameState = signal<GameState>('idle');
  currentTrack = signal<Track | null>(null);
  currentTime = signal<number>(0);
  isPaused = signal<boolean>(false);

  // Computed signals
  score = computed(() => this.scoringService.getScore()());
  formattedTime = computed(() => {
    const seconds = Math.floor(this.currentTime() / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  });

  ngOnInit(): void {
    // TODO: Загрузить трек из параметров роута или сервиса
    this.initializeTestTrack();
  }

  ngOnDestroy(): void {
    this.stopGame();
  }

  /**
   * Инициализация тестового трека
   */
  private initializeTestTrack(): void {
    // Временный тестовый трек
    const testTrack: Track = {
      id: 'test-1',
      name: 'Test Track',
      artist: 'Test Artist',
      duration: 60, // 1 минута
      bpm: 120,
      audioUrl: '', // TODO: добавить реальный трек
      difficulty: 'medium',
    };

    this.currentTrack.set(testTrack);

    // Генерируем маркеры для трека
    this.rhythmService.generateMarkers(testTrack);
  }

  /**
   * Начать игру
   */
  startGame(): void {
    if (this.gameState() === 'playing') return;

    this.gameState.set('playing');
    this.isPaused.set(false);
    this.currentTime.set(0);

    // Запускаем игровой цикл
    this.startGameLoop();

    // TODO: Воспроизвести музыку
  }

  /**
   * Пауза игры
   */
  pauseGame(): void {
    if (this.gameState() !== 'playing') return;

    this.isPaused.set(true);
    this.gameState.set('paused');
    this.stopGameLoop();

    // TODO: Приостановить музыку
  }

  /**
   * Продолжить игру
   */
  resumeGame(): void {
    if (this.gameState() !== 'paused') return;

    this.isPaused.set(false);
    this.gameState.set('playing');
    this.startGameLoop();

    // TODO: Возобновить музыку
  }

  /**
   * Остановить игру
   */
  stopGame(): void {
    this.gameState.set('idle');
    this.isPaused.set(false);
    this.stopGameLoop();
    this.resetGame();

    // TODO: Остановить музыку
  }

  /**
   * Запуск игрового цикла
   */
  private startGameLoop(): void {
    const startTime = Date.now() - this.currentTime();

    this.gameInterval = window.setInterval(() => {
      if (!this.isPaused()) {
        const newTime = Date.now() - startTime;
        this.currentTime.set(newTime);

        // Обновляем время в компоненте вертушки
        if (this.turntableComponent) {
          this.turntableComponent.setCurrentTime(newTime);
        }

        // Проверяем окончание трека
        const track = this.currentTrack();
        if (track && newTime >= track.duration * 1000) {
          this.finishGame();
        }
      }
    }, 16); // ~60 FPS
  }

  /**
   * Остановка игрового цикла
   */
  private stopGameLoop(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = undefined;
    }
  }

  /**
   * Завершить игру
   */
  private finishGame(): void {
    this.stopGame();
    this.gameState.set('finished');

    // TODO: Перейти на экран результатов
    console.log('Game finished! Score:', this.score());
  }

  /**
   * Сброс игры
   */
  private resetGame(): void {
    this.currentTime.set(0);
    this.turntableService.reset();
    this.scoringService.reset();
    this.rhythmService.reset();
  }

  /**
   * Вернуться в меню
   */
  goToMenu(): void {
    this.stopGame();
    this.router.navigate(['/home']);
  }
}
