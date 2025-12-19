
import React, { useState } from 'react';
import { Player, Team, GameMode } from '../types';
import { Trophy, Edit2, Save, X, ArrowRight, RotateCcw, Users } from 'lucide-react';

interface SummaryPanelProps {
  mode: GameMode;
  players: Player[];
  teams: Team[];
  onRestart: () => void;
  onUpdateScore: (id: string, newScore: number) => void;
  onNextSegment: () => void;
  nextSegmentLabel?: string;
  isFinalStage?: boolean;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  mode, 
  players, 
  teams, 
  onRestart, 
  onUpdateScore, 
  onNextSegment,
  nextSegmentLabel = "Następny Segment",
  isFinalStage = false
}) => {
  const [editingEntity, setEditingEntity] = useState<{ id: string, name: string, score: number } | null>(null);
  
  const getRanking = () => {
    if (mode === 'INDIVIDUAL') {
      return [...players].sort((a, b) => b.score - a.score);
    } else {
      return [...teams].sort((a, b) => b.score - a.score);
    }
  };

  const ranking = getRanking();
  const winner = ranking.length > 0 ? ranking[0] : null;

  const isEndGame = isFinalStage || nextSegmentLabel.includes("Brak") || nextSegmentLabel.includes("Zakończ");

  const openEditModal = (entity: any) => {
    setEditingEntity({
      id: entity.id,
      name: entity.name,
      score: entity.score
    });
  };

  const saveScore = () => {
    if (editingEntity) {
      onUpdateScore(editingEntity.id, editingEntity.score);
      setEditingEntity(null);
    }
  };

  const renderAvatar = (entity: any, size: string = "w-10 h-10") => {
    if (mode === 'TEAM') {
      if (entity.image) {
        return <img src={entity.image} alt={entity.name} className={`${size} rounded-md object-cover border-2 border-white/20`} />;
      }
      return <div className={`${size} rounded-lg bg-secondary flex items-center justify-center text-white`}><Users className="w-1/2 h-1/2" /></div>;
    }
    if (entity.avatar) {
      return <img src={entity.avatar} alt={entity.name} className={`${size} rounded-full object-cover border-2 border-white/20`} />;
    }
    return (
      <div className={`${size} rounded-full flex items-center justify-center font-bold text-white border-2 border-white/20 ${entity.gender === 'M' ? 'bg-blue-600' : 'bg-pink-600'}`}>
        {entity.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-center animate-fade-in relative">
      
      <div className="mb-8">
        <Trophy className={`w-24 h-24 mx-auto mb-4 ${isEndGame ? 'text-yellow-500 animate-bounce' : 'text-primary'}`} />
        <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
          {isEndGame ? "WIELKI FINAŁ" : "Koniec Etapu!"}
        </h1>
        <p className="text-gray-400">
          {isEndGame ? "Gratulacje dla zwycięzców! Gra dobiegła końca." : "Podsumowanie punktacji segmentu"}
        </p>
      </div>

      {winner && (
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 p-6 rounded-2xl mb-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-yellow-200 mb-4">AKTUALNY LIDER</h2>
          {renderAvatar(winner, "w-24 h-24 mb-4 border-4 border-yellow-500")}
          <div className="text-3xl font-black text-white">{winner.name}</div>
          <div className="text-yellow-400 font-bold mt-1">{winner.score} pkt</div>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-white/10 overflow-hidden mb-8">
        <div className="p-4 bg-white/5 font-bold border-b border-white/10">Ranking</div>
        <div className="divide-y divide-white/10">
          {ranking.map((entity: any, index) => (
            <div key={entity.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-orange-700 text-white' :
                  'bg-white/10 text-gray-400'
                }`}>
                  {index + 1}
                </span>
                {renderAvatar(entity, "w-10 h-10")}
                <span className="font-medium text-lg">{entity.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-secondary">{entity.score} pkt</span>
                <button 
                  onClick={() => openEditModal(entity)}
                  className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Edytuj punkty"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {!isEndGame && (
            <button 
            onClick={onNextSegment}
            className="bg-gradient-to-r from-primary to-indigo-600 hover:brightness-110 text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 text-lg"
            >
                {nextSegmentLabel} <ArrowRight className="w-5 h-5" />
            </button>
        )}

        <button 
          onClick={onRestart}
          className={`flex items-center justify-center gap-2 transition-colors py-2 mt-4 ${
              isEndGame 
              ? 'bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-600/20' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> {isEndGame ? "Zakończ Grę i Wróć do Menu" : "Wróć do menu głównego (Reset)"}
        </button>
      </div>

      {editingEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-surface border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" /> Edycja punktów
              </h3>
              <button 
                onClick={() => setEditingEntity(null)} 
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-1">Uczestnik/Drużyna:</p>
              <p className="font-bold text-lg text-white">{editingEntity.name}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Nowa liczba punktów:</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingEntity({ ...editingEntity, score: editingEntity.score - 1 })}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded border border-white/10 flex items-center justify-center font-bold"
                >
                  -1
                </button>
                <input 
                  type="number"
                  value={editingEntity.score}
                  onChange={(e) => setEditingEntity({ ...editingEntity, score: parseInt(e.target.value) || 0 })}
                  className="flex-1 bg-black/20 border border-white/10 rounded h-10 px-3 text-center focus:border-primary focus:outline-none"
                />
                <button 
                  onClick={() => setEditingEntity({ ...editingEntity, score: editingEntity.score + 1 })}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded border border-white/10 flex items-center justify-center font-bold"
                >
                  +1
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setEditingEntity(null)}
                className="flex-1 py-2 px-4 rounded bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 transition-colors"
              >
                Anuluj
              </button>
              <button 
                onClick={saveScore}
                className="flex-1 py-2 px-4 rounded bg-primary hover:bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
              >
                <Save className="w-4 h-4" /> Zapisz
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
