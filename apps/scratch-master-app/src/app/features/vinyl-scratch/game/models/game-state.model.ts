export type GameState = 'idle' | 'playing' | 'paused' | 'finished';

export interface GameStateModel {
  state: GameState;
  currentTime: number; // текущее время трека в миллисекундах
  isPaused: boolean;
}
