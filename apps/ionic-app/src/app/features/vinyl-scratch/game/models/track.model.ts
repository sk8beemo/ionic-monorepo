export interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number; // в секундах
  bpm: number; // beats per minute
  audioUrl: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}
