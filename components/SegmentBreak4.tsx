import React from 'react';
import { Play } from 'lucide-react';

interface SegmentBreak4Props {
  onContinue: () => void;
}

const SegmentBreak4: React.FC<SegmentBreak4Props> = ({ onContinue }) => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-surface rounded-xl shadow-2xl border border-white/10 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
          SEGMENT 4 ZAKOŃCZONY!
        </h1>
        <p className="text-gray-300">Licytacja — gratulacje za dobrą taktykę!</p>
        <p className="text-gray-300 mt-2">
          W tej części drużyny licytowały, ile poprawnych odpowiedzi są w stanie wymienić w danej kategorii. Zwycięzca licytacji próbował wymienić zadeklarowaną liczbę haseł — sukces daje punkty, porażka odejmuje.
        </p>
      </div>

      <div className="bg-dark/50 p-6 rounded-lg mb-8 border-l-4 border-yellow-500">
        <h3 className="font-bold text-lg mb-2">Zasady:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>Dostępne były różne kategorie (rundy).</li>
          <li>Drużyny deklarowały liczbę haseł — najwyższa deklaracja wygrywała licytację.</li>
          <li>Za poprawne wymienienie deklarowanej liczby przyznawane było <strong>10 punktów</strong>.</li>
          <li>Przekroczenie limitu błędów skutkowało utratą <strong>10 punktów</strong>.</li>
          <li>Punkty dodawane są do bieżącego wyniku.</li>
        </ul>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:brightness-110"
        >
          <Play className="w-6 h-6 fill-current" />
          Dalej
        </button>
      </div>
    </div>
  );
};

export default SegmentBreak4;
