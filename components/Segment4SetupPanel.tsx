
import React from 'react';
import { Gavel, Play, AlertCircle } from 'lucide-react';
import { SEGMENT4_CATEGORIES } from '../constants';

interface Segment4SetupPanelProps {
  onStartSegment: () => void;
}

export const Segment4SetupPanel: React.FC<Segment4SetupPanelProps> = ({ onStartSegment }) => {
  const categoriesCount = SEGMENT4_CATEGORIES.length;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-surface rounded-xl shadow-2xl border border-white/10 animate-fade-in">
      <div className="text-center mb-8">
        <Gavel className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
          Segment 4: Licytacja
        </h1>
        <p className="text-gray-300">
          W tej części drużyny licytują, ile poprawnych odpowiedzi są w stanie wymienić w danej kategorii.
        </p>
      </div>

      <div className="bg-dark/50 p-6 rounded-lg mb-8 border-l-4 border-yellow-500">
        <h3 className="font-bold text-lg mb-2">Zasady:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>Dostępne są <strong>{categoriesCount}</strong> kategorie (rundy).</li>
          <li>Najpierw wyświetlana jest kategoria i max. liczba odpowiedzi.</li>
          <li>Czas na naradę: 30 sekund.</li>
          <li>Drużyny deklarują liczbę haseł. Wygrywa najwyższa deklaracja.</li>
          <li>Zwycięska drużyna wymienia hasła.</li>
          <li><strong>Sukces:</strong> Wymienienie zadeklarowanej liczby (+10 pkt).</li>
          <li><strong>Porażka:</strong> Przekroczenie limitu błędów (-10 pkt).</li>
        </ul>
      </div>

      <button
        onClick={onStartSegment}
        disabled={categoriesCount === 0}
        className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
          categoriesCount === 0
          ? 'bg-gray-700 cursor-not-allowed text-gray-400'
          : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:brightness-110 hover:shadow-yellow-500/25'
        }`}
      >
        {categoriesCount === 0 ? <AlertCircle /> : <Play className="w-6 h-6 fill-current" />} 
        Rozpocznij Segment 4
      </button>
    </div>
  );
};
