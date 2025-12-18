import React, { useState } from 'react';
import { Film, Play, AlertCircle } from 'lucide-react';
import { MOVIE_FRAMES } from '../constants';

interface Segment2SetupPanelProps {
  onStartSegment: (rounds: number) => void;
}

export const Segment2SetupPanel: React.FC<Segment2SetupPanelProps> = ({ onStartSegment }) => {
  const maxAvailable = MOVIE_FRAMES.length;
  const [rounds, setRounds] = useState<number>(Math.min(3, maxAvailable));

  const handleStart = () => {
    if (maxAvailable === 0) {
      alert("Brak zdefiniowanych klatek filmowych w kodzie!");
      return;
    }
    onStartSegment(rounds);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-surface rounded-xl shadow-2xl border border-white/10 animate-fade-in">
      <div className="text-center mb-8">
        <Film className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-pink-500 bg-clip-text text-transparent mb-2">
          Segment 2: Kadry Filmowe
        </h1>
        <p className="text-gray-300">
          W tej części gry uczestnicy muszą rozpoznać film na podstawie jednej klatki.
          Wygrywa ta drużyna (lub gracz), która pierwsza zgłosi się i poda poprawny tytuł.
        </p>
      </div>

      <div className="bg-dark/50 p-6 rounded-lg mb-8 border-l-4 border-secondary">
        <h3 className="font-bold text-lg mb-2">Zasady:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>Wyświetlana jest losowa klatka z filmu.</li>
          <li>Prowadzący klika nazwę drużyny, która odgadła poprawnie.</li>
          <li>Za poprawną odpowiedź przyznawane jest <strong>10 punktów</strong>.</li>
          <li>Punkty sumują się z wynikiem z poprzedniego segmentu.</li>
        </ul>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <label className="text-lg font-medium">Liczba rund:</label>
          <input 
            type="number" 
            min="1" 
            max={maxAvailable}
            value={rounds}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 1 && val <= maxAvailable) setRounds(val);
            }}
            className="w-24 bg-dark border border-white/20 rounded-lg px-3 py-2 text-center text-xl font-bold focus:border-secondary focus:outline-none"
          />
          <span className="text-sm text-gray-500">(Max: {maxAvailable})</span>
        </div>

        <button
          onClick={handleStart}
          disabled={maxAvailable === 0}
          className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
            maxAvailable === 0
            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
            : 'bg-gradient-to-r from-secondary to-pink-600 hover:brightness-110 hover:shadow-secondary/25'
          }`}
        >
          {maxAvailable === 0 ? <AlertCircle /> : <Play className="w-6 h-6 fill-current" />} 
          Rozpocznij Segment 2
        </button>
      </div>
    </div>
  );
};