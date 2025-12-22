
export type Gender = 'M' | 'F';

export type GameMode = 'INDIVIDUAL' | 'TEAM';

export type LifelineType = 'FIFTY_FIFTY' | 'HINT' | 'SWAP';

export interface Player {
  id: string;
  name: string;
  gender: Gender;
  avatar?: string; // URL do obrazka (blob lub ścieżka)
  score: number;
  // Used in individual mode
  lifelinesUsed: LifelineType[];
}

export interface Team {
  id: string;
  name: string;
  members: Player[];
  image?: string; // opcjonalne zdjęcie drużyny (ścieżka)
  score: number;
  lifelinesUsed: LifelineType[];
}

export interface Question {
  id: string;
  text: string;
  answers: string[]; // Always 4 answers
  correctIndex: number; // 0-3 derived from letter
  correctLetter?: string; // Original letter from CSV
  category: string;
  hint?: string; // Treść podpowiedzi z CSV
}

export interface GameConfig {
  mode: GameMode;
  rounds: number;
  currentRound: number;
  activeCategories: string[]; // Kategorie wybrane do gry
}

// Struktura pary obrazków dla Segmentu 2
export interface MovieFramePair {
  id: string;
  key: string;      // Ścieżka do klatki (pytanie)
  answer: string;   // Ścieżka do odpowiedzi
  title: string;    // Tytuł filmu (opcjonalnie do wyświetlenia)
}

// Struktura pary audio dla Segmentu 3
export interface MusicPair {
  id: string;           // np. "track01"
  questionSrc: string;  // ścieżka do fragmentu pytającego
  answerSrc: string;    // ścieżka do fragmentu z odpowiedzią
  title?: string;       // Opcjonalny tytuł utworu (dla prowadzącego)
}

// Struktura kategorii dla Segmentu 4 (Licytacja)
export interface Segment4Category {
  id: string;
  name: string;
  maxValue: number;
  errorThreshold: number;
  validValues: string[];
}

// Dodano stany dla wszystkich segmentów
export type AppState = 'SETUP' | 'RULES' | 'GAME' | 'SUMMARY' | 'SEGMENT_BREAK' | 'SEGMENT2_SETUP' | 'SEGMENT2_GAME' | 'SEGMENT3_SETUP' | 'SEGMENT3_GAME' | 'SEGMENT4_SETUP' | 'SEGMENT4_GAME';
