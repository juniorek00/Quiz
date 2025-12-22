import React from 'react';
import { Play } from 'lucide-react';

interface SegmentBreak0Props {
  onContinue: () => void;
}

const SegmentBreak0: React.FC<SegmentBreak0Props> = ({ onContinue }) => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-surface rounded-xl shadow-2xl border border-white/10 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Dwóch trzyma, jeden wchodzi
        </h1>
        <p className="text-gray-300">Drużyna ma włożyć laskę cukrową do butelki, sterując nią tylko za pomocą sznurka.</p>
        
      </div>
{/* 
      <div className="bg-dark/50 p-6 rounded-lg mb-8 border-l-4 border-secondary">
        <h3 className="font-bold text-lg mb-2">Zasady:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
          <li>1.Tylko dwie osoby sterują laską – trzymając końce sznurka.</li>
          <li>2.Nie wolno dotykać laski ani butelki rękami, stopami, kolanami itp. (Tylko sznuerk w rękach)</li>
          <li>3.Laska na starcie musi być w powietrzu (nie może leżeć na podłodze).</li>
          <li>4.Zadanie: włożyć laskę do butelki tak, żeby, część laski znalazła się w środku,

            laska utrzymała się w butelce min. 2 sekundy bez podtrzymywania czymkolwiek innym.</li>
          <li>5.Jeśli laska spadnie lub wypadnie – próbujesz dalej, czas leci</li>
          <li>6.Jeśli butelka się przewróci, ustawiasz butelkę od nowa.</li>
        </ul>
      </div> */}

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary hover:brightness-110"
        >
          <Play className="w-6 h-6 fill-current" />
          Rozpocznij Część 1
        </button>
      </div>
    </div>
  );
};

export default SegmentBreak0;
