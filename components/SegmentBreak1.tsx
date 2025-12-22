import React from 'react';
import { Play } from 'lucide-react';

interface SegmentBreak1Props {
  onContinue: () => void;
}

const SegmentBreak1: React.FC<SegmentBreak1Props> = ({ onContinue }) => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-surface rounded-xl shadow-2xl border border-white/10 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Postaw kubek, nie wymówkę!
        </h1>
        <p className="text-gray-300">
          Kółko i krzyżyk flipy, jak zrobisz flipa to możesz położyć albo zmienić położenie swojego kubka. Każdy z drużyny podchodzi po koleji i próbuje do skutku, potem szybko wchodzi kolejna osoba. Półfinał i finał na 4 drużyny
        </p>
      </div>

      {/* <div className="bg-dark/50 p-6 rounded-lg mb-8 border-l-4 border-secondary">
        <h3 className="font-bold text-lg mb-2">Zasady:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>Wyświetlana jest losowa klatka z filmu.</li>
          <li>Prowadzący klika nazwę drużyny, która odgadła poprawnie.</li>
          <li>Za poprawną odpowiedź przyznawane jest <strong>10 punktów</strong>.</li>
          <li>Punkty sumują się z wynikiem z poprzedniego segmentu.</li>
        </ul>
      </div> */}

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary hover:brightness-110"
        >
          <Play className="w-6 h-6 fill-current" />
          Dalej
        </button>
      </div>
    </div>
  );
};

export default SegmentBreak1;
