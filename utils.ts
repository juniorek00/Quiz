import { Player, Team, Question } from './types';

/**
 * Losuje drużyny starając się zachować balans płci.
 */
export const generateBalancedTeams = (players: Player[], numberOfTeams: number): Team[] => {
  if (numberOfTeams <= 0) return [];

  const teams: Team[] = Array.from({ length: numberOfTeams }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `Drużyna ${i + 1}`,
    members: [],
    score: 0,
    lifelinesUsed: []
  }));

  const men = players.filter(p => p.gender === 'M');
  const women = players.filter(p => p.gender === 'F');

  // Shuffle arrays (Fisher-Yates)
  const shuffle = <T,>(array: T[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  shuffle(men);
  shuffle(women);

  let currentTeamIndex = 0;

  // Distribute men
  men.forEach(man => {
    teams[currentTeamIndex].members.push(man);
    currentTeamIndex = (currentTeamIndex + 1) % numberOfTeams;
  });

  // Distribute women (continue index rotation to balance total numbers if possible)
  women.forEach(woman => {
    teams[currentTeamIndex].members.push(woman);
    currentTeamIndex = (currentTeamIndex + 1) % numberOfTeams;
  });

  return teams;
};

/**
 * Ładuje pytania z pliku CSV.
 * pytania.csv to statyczny plik z pytaniami trzymany przy aplikacji.
 */
export async function loadQuestionsFromCsv(): Promise<Question[]> {
  try {
    // 1. Pobranie pliku
    const response = await fetch('pytania.csv');
    
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const text = await response.text();
    
    // 2. Podział na linie (obsługa różnych znaków nowej linii)
    const lines = text.split(/\r?\n/);

    const questions: Question[] = [];

    // 3. Parsowanie linii (pomijamy pierwszą linię nagłówkową)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Ignoruj puste linie
      if (!line) continue;

      // Podział po separatorze (zakładamy średnik ;)
      const cols = line.split(';');

      // Walidacja liczby kolumn (oczekujemy minimum 8 kolumn)
      // ID;kategoria;pytanie;A;B;C;D;poprawna;[podpowiedz]
      if (cols.length < 8) {
        console.warn(`Pominięto linię ${i + 1}: nieprawidłowa liczba kolumn.`);
        continue;
      }

      const id = cols[0].trim();
      const category = cols[1].trim();
      const questionText = cols[2].trim();
      const answers = [
        cols[3].trim(),
        cols[4].trim(),
        cols[5].trim(),
        cols[6].trim()
      ];
      const correctLetter = cols[7].trim().toUpperCase();
      
      // Opcjonalna podpowiedź w 9. kolumnie
      const hint = cols[8] ? cols[8].trim() : undefined;

      // Konwersja litery na indeks
      let correctIndex = 0;
      if (correctLetter === 'B') correctIndex = 1;
      else if (correctLetter === 'C') correctIndex = 2;
      else if (correctLetter === 'D') correctIndex = 3;
      // else 'A' -> 0

      questions.push({
        id,
        category,
        text: questionText,
        answers,
        correctIndex,
        correctLetter,
        hint
      });
    }

    return questions;

  } catch (error) {
    console.error("Błąd podczas ładowania pytań:", error);
    throw error;
  }
}
