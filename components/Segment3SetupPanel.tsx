
import React, { useState } from 'react';
import { Music, Play, AlertCircle } from 'lucide-react';
import { MUSIC_PAIRS } from '../constants';

interface Segment3SetupPanelProps {
  onStartSegment: (rounds: number) => void;
}

export const Segment3SetupPanel: React.FC<Segment3SetupPanelProps> = ({ onStartSegment }) => {
  // Sprawdzenie ile mamy dostępnych par w bazie
  const maxAvailable = MUSIC_PAIRS.length;
  const [rounds, setRounds] = useState<number>(Math.min(3, maxAvailable));

  const handleStart = () => {
    if (maxAvailable === 0) {
      alert("Brak zdefiniowanych par muzycznych w kodzie (MUSIC_PAIRS)!");
      return;
    }
    onStartSegment(rounds);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-surface rounded-xl shadow-2xl border border-white/10 animate-fade-in">
      <div className="text-center mb-8">
        <Music className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
          Segment 3: Jaka to melodia?
        </h1>
        <p className="text-gray-300">
          W tej części odgadujemy tytuł piosenki na podstawie krótkiego fragmentu utworu.
        </p>
      </div>

      <div className="bg-dark/50 p-6 rounded-lg mb-8 border-l-4 border-purple-500">
        <h3 className="font-bold text-lg mb-2">Zasady:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>Aplikacja automatycznie odtwarza fragment pytający.</li>
          <li>Uczestnicy zgłaszają się do odpowiedzi.</li>
          <li>Prowadzący przyznaje <strong>10 punktów</strong> drużynie, która odgadła.</li>
          <li>Można odsłuchać poprawną odpowiedź (pełny fragment) po zakończeniu pytania.</li>
        </ul>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <label className="text-lg font-medium">Liczba rund:</label>
          <input 
            type="number" 
            min="1" 
            max={maxAvailable > 0 ? maxAvailable : 1}
            value={rounds}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 1 && val <= maxAvailable) setRounds(val);
            }}
            className="w-24 bg-dark border border-white/20 rounded-lg px-3 py-2 text-center text-xl font-bold focus:border-purple-500 focus:outline-none"
          />
          <span className="text-sm text-gray-500">(Max: {maxAvailable})</span>
        </div>

        <button
          onClick={handleStart}
          disabled={maxAvailable === 0}
          className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
            maxAvailable === 0
            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 hover:shadow-purple-500/25'
          }`}
        >
          {maxAvailable === 0 ? <AlertCircle /> : <Play className="w-6 h-6 fill-current" />} 
          Rozpocznij Segment 3
        </button>
      </div>
    </div>
  );
};
