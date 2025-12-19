import React from 'react';
import { GameMode } from '../types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface RulesPanelProps {
  mode: GameMode;
  rounds: number;
  categories: string[];
  onConfirm: () => void;
  onBack: () => void;
}

const RulesPanel: React.FC<RulesPanelProps> = ({ mode, rounds, categories, onConfirm, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-surface rounded-xl border border-white/10 shadow-2xl">
      <h2 className="text-2xl font-bold mb-4">Zasady - Część 1 (Quiz Tekstowy)</h2>
      <p className="text-gray-300 mb-3">Przed rozpoczęciem poniżej znajdziesz krótkie zasady pierwszej części gry.</p>

      <ul className="list-disc list-inside space-y-2 text-gray-200 mb-6">
        <li>Każdy uczestnik / drużyna odpowiada po kolei na pytania.</li>
        <li>Masz <strong>30 sekund</strong> na udzielenie odpowiedzi każdorazowo.</li>
        <li>Poprawna odpowiedź daje <strong>+10 punktów</strong>.</li>
        <li>Do dyspozycji są koła ratunkowe: <strong>50/50</strong>, <strong>Podpowiedź</strong>, <strong>Wymiana</strong>.</li>
        <li>Jeżeli skończą się pytania w aktywnych kategoriach, gra zakończy się automatycznie.</li>
      </ul>

      <div className="mb-4 text-sm text-gray-300">
        <div><strong>Tryb:</strong> {mode === 'INDIVIDUAL' ? 'Indywidualny' : 'Drużynowy'}</div>
        <div><strong>Liczba rund:</strong> {rounds}</div>
        <div><strong>Wybrane kategorie ({categories.length}):</strong> {categories.slice(0,6).join(', ')}{categories.length>6? ' ...' : ''}</div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10">Powrót</button>
        <button onClick={onConfirm} className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold flex items-center justify-center gap-2">Rozpocznij część 1 <ArrowRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export default RulesPanel;
