import React from 'react';
import { Play } from 'lucide-react';

interface SegmentBreak4Props {
  onContinue: () => void;
}

const SegmentBreak4: React.FC<SegmentBreak4Props> = ({ onContinue }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-400 to-primary animate-pulse">
          KONIEC GRY!
        </h1>
        <p className="text-2xl text-gray-300">Licytacja - Wspaniały finał!</p>
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all shadow-lg"
        >
          <Play className="w-6 h-6 fill-current" />
          Podsumowanie
        </button>
      </div>
    </div>
  );
};

export default SegmentBreak4;
