
import React, { useState, useEffect } from 'react';
import { GameMode, Player, Team, MovieFramePair } from '../types';
import { MOVIE_FRAMES } from '../constants';
import { Trophy, ArrowRight, XCircle, Film, Edit2, Save, X, Users, LifeBuoy, Star, CheckCircle2 } from 'lucide-react';
import AvatarModal from './AvatarModal';

interface Segment2GamePanelProps {
  mode: GameMode;
  players: Player[];
  teams: Team[];
  totalRounds: number;
  onEndSegment: () => void;
  onUpdateScore: (id: string, newScore: number) => void;
  onResetLifelines: (id: string) => void;
}

export const Segment2GamePanel: React.FC<Segment2GamePanelProps> = ({
  mode,
  players,
  teams,
  totalRounds,
  onEndSegment,
  onUpdateScore,
  onResetLifelines
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [activeFrame, setActiveFrame] = useState<MovieFramePair | null>(null);
  const [usedFrameIds, setUsedFrameIds] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [winningEntityName, setWinningEntityName] = useState<string | null>(null);
  const [winningEntityId, setWinningEntityId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<{ id: string, name: string, score: number } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Wielokrotny wybór zwycięzców (np. dwie drużyny odpowiedziały jednocześnie)
  const [selectedEntities, setSelectedEntities] = useState<{ id: string, name: string }[]>([]);
  const [pointsAwarded, setPointsAwarded] = useState<number>(0);

  const loadNextFrame = () => {
    const availableFrames = MOVIE_FRAMES.filter(f => !usedFrameIds.includes(f.id));

    if (availableFrames.length === 0) {
      onEndSegment();
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableFrames.length);
    const selected = availableFrames[randomIndex];

    setActiveFrame(selected);
    setUsedFrameIds(prev => [...prev, selected.id]);
    setIsAnswered(false);
    setWinningEntityName(null);
    setWinningEntityId(null);
    setPointsAwarded(0);
    setSelectedEntities([]);
  };

  useEffect(() => {
    loadNextFrame();
  }, []);

  // Zaznacz/usun zaznaczenie uczestnika/drużyny — umożliwia wybór wielu zwycięzców (limit = liczba uczestników)
  const handleAwardPoints = (entityId: string, entityName: string) => {
    setSelectedEntities(prev => {
      const exists = prev.find(p => p.id === entityId);
      if (exists) return prev.filter(p => p.id !== entityId);
      // limit równy liczbie uczestników (drużyn/indywidualnych graczy)
      const maxSelectable = mode === 'INDIVIDUAL' ? players.length : teams.length;
      if (prev.length >= maxSelectable) return prev;
      return [...prev, { id: entityId, name: entityName }];
    });
  };

  const confirmPoints = (points: number) => {
    if (selectedEntities.length === 0) return;
    // Przyznaj punkty każdemu wybranemu
    selectedEntities.forEach(ent => {
      let currentScore = 0;
      if (mode === 'INDIVIDUAL') {
        const p = players.find(p => p.id === ent.id);
        if (p) currentScore = p.score;
      } else {
        const t = teams.find(t => t.id === ent.id);
        if (t) currentScore = t.score;
      }
      onUpdateScore(ent.id, currentScore + points);
    });
    setIsAnswered(true);
    setWinningEntityName(selectedEntities.map(s => s.name).join(' i '));
    setWinningEntityId(selectedEntities.length === 1 ? selectedEntities[0].id : null);
    setPointsAwarded(points);
    setSelectedEntities([]);
  };

  const cancelScoring = () => {
    setSelectedEntities([]);
  };

  const handleNoWinner = () => {
    setIsAnswered(true);
    setWinningEntityName(null);
    setWinningEntityId(null);
    setPointsAwarded(0);
    setSelectedEntities([]);
  };

  const handleNextRound = () => {
    if (currentRound >= totalRounds) {
      onEndSegment();
    } else {
      setCurrentRound(prev => prev + 1);
      loadNextFrame();
    }
  };

  const openScoreEditor = (id: string) => {
    const entity = mode === 'INDIVIDUAL' 
      ? players.find(p => p.id === id) 
      : teams.find(t => t.id === id);
    if (entity) setEditingScore({ id: entity.id, name: entity.name, score: entity.score });
  };

  const saveScore = () => {
    if (!editingScore) return;
    onUpdateScore(editingScore.id, editingScore.score);
    setEditingScore(null);
  };

  const renderAvatar = (entity: any, size: string = "w-8 h-8") => {
    if (mode === 'TEAM') {
      if (entity.image) {
        return (
          <img
            src={entity.image}
            alt={entity.name}
            className={`${size} rounded-md object-cover border border-white/20 cursor-pointer`}
            onClick={() => setSelectedImage(entity.image)}
          />
        );
      }
      return <div className={`${size} rounded-lg bg-secondary flex items-center justify-center text-white`}><Users className="w-1/2 h-1/2" /></div>;
    }
    if (entity.avatar) return <img src={entity.avatar} alt={entity.name} className={`${size} rounded-full object-cover border border-white/20`} />;
    return <div className={`${size} rounded-full flex items-center justify-center font-bold text-white border border-white/20 ${entity.gender === 'M' ? 'bg-blue-600' : 'bg-pink-600'}`}>{entity.name.charAt(0).toUpperCase()}</div>;
  };

  const entities = mode === 'INDIVIDUAL' ? players : teams;
  const leaderboard = [...entities].sort((a, b) => b.score - a.score);

  if (!activeFrame) return <div className="text-center p-10">Ładowanie segmentu...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 max-w-6xl mx-auto">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between bg-dark/50 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
             <div className="bg-secondary p-2 rounded-lg">
                <Film className="w-6 h-6 text-white" />
             </div>
             <div>
               <h2 className="text-xl font-bold">Segment 2: Kadry</h2>
               <p className="text-sm text-gray-400">Runda {currentRound} z {totalRounds}</p>
             </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-white/10 shadow-2xl text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
          <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden border border-white/20 mb-6 group">
            {!isAnswered ? (
               <>
                 <img src={activeFrame.key} alt="Klatka" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/1e293b/FFF?text=Klatka+Filmowa+(Brak+pliku)'; }} />
                 <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded text-xs">ZAGADKA</div>
               </>
            ) : (
               <>
                  <img src={activeFrame.answer} alt="Odpowiedź" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/1e293b/FFF?text=Odpowied%C5%BA+(Brak+pliku)'; }} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-6">
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg">{activeFrame.title}</h3>
                 </div>
                 <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">ODPOWIEDŹ</div>
               </>
            )}
          </div>

          {!isAnswered ? (
            <div className="w-full animate-fade-in">
              <p className="text-gray-400 mb-4 uppercase tracking-widest text-sm">Kto odgadł? Kliknij 1–{entities.length} drużyny, następnie wybierz liczbę punktów</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {entities.map(entity => (
                  <button
                    key={entity.id}
                    onClick={() => handleAwardPoints(entity.id, entity.name)}
                    aria-pressed={Boolean(selectedEntities.find(s => s.id === entity.id))}
                    className={`py-3 px-4 ${selectedEntities.find(s => s.id === entity.id) ? 'bg-green-600/30 border-green-500' : 'bg-white/5 hover:bg-secondary hover:text-white'} border border-white/10 rounded-xl font-bold transition-all truncate flex items-center gap-3`}
                  >
                    {mode === 'TEAM' ? (
                      entity.image ? (
                        <img
                          src={entity.image}
                          alt={entity.name}
                          className="w-10 h-10 rounded-md object-cover border border-white/10 cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); setSelectedImage(entity.image); }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-white"><Users className="w-1/2 h-1/2" /></div>
                      )
                    ) : (
                      entity.avatar ? (
                        <img
                          src={entity.avatar}
                          alt={entity.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10 cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); setSelectedImage(entity.avatar); }}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white border border-white/10 ${entity.gender === 'M' ? 'bg-blue-600' : 'bg-pink-600'}`}>{entity.name.charAt(0).toUpperCase()}</div>
                      )
                    )}

                    <span className="truncate">{entity.name}</span>
                  </button>
                ))}
              </div>
              {selectedEntities.length > 0 && (
                <div className="mt-4 flex flex-col items-center gap-3">
                  <div className="text-sm text-gray-400 mb-2">Wybrane: {selectedEntities.map(s => s.name).join(', ')}</div>
                  <div className="flex gap-3">
                    <button onClick={() => confirmPoints(10)} className="bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500 p-3 rounded-xl font-bold">+10 pkt</button>
                    <button onClick={() => confirmPoints(5)} className="bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500 p-3 rounded-xl font-bold">+5 pkt</button>
                    <button onClick={cancelScoring} className="bg-transparent border border-white/10 p-3 rounded-xl text-gray-400 hover:bg-white/5">Anuluj</button>
                  </div>
                </div>
              )}
              <div className="mt-4 border-t border-white/10 pt-4">
                 <button onClick={handleNoWinner} className="text-gray-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto">
                   <XCircle className="w-4 h-4" /> Nikt nie odgadł
                 </button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
               <div className="text-left">
                  {winningEntityName ? (
                    <>
                      <div className="text-sm text-gray-400">Punkty przyznane dla:</div>
                      <div className="flex items-center gap-3">
                        {winningEntityId && (() => {
                          const ent = (mode === 'INDIVIDUAL' ? players : teams).find(e => e.id === winningEntityId);
                          if (ent && (mode === 'TEAM' ? ent.image : ent.avatar)) {
                            const src = mode === 'TEAM' ? ent.image : ent.avatar;
                            return <img src={src} alt={ent.name} className="w-12 h-12 rounded-md object-cover border border-white/20 cursor-pointer" onClick={() => setSelectedImage(src ?? null)} />;
                          }
                          return null;
                        })()}
                        <div className="text-2xl font-bold text-green-400">{winningEntityName} (+{pointsAwarded} pkt)</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-xl font-bold text-gray-400">Brak punktów w tej rundzie.</div>
                  )}
               </div>
               <button onClick={handleNextRound} className="bg-white text-dark hover:bg-gray-200 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg">
                 {currentRound >= totalRounds ? "Zakończ Segment" : "Następna Runda"} <ArrowRight className="w-5 h-5" />
               </button>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-surface p-4 rounded-xl border border-white/10 h-fit sticky top-4">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Ranking
          </h3>
          <ul className="space-y-2">
            {leaderboard.map((entity: any, idx) => (
              <li key={entity.id} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`font-mono text-sm ${idx === 0 ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>#{idx + 1}</span>
                  {renderAvatar(entity)}
                  <span className="truncate max-w-[100px] text-sm">{entity.name}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="font-bold text-secondary text-sm">{entity.score}</span>
                   <button onClick={() => openScoreEditor(entity.id)} className="text-gray-500 hover:text-white transition-colors p-1"><Edit2 className="w-3 h-3" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>



       {editingScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Edit2 className="w-5 h-5 text-primary" /> Edycja punktów</h3>
              <button onClick={() => setEditingScore(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-4"><p className="text-sm text-gray-400 mb-1">Uczestnik/Drużyna:</p><p className="font-bold text-lg text-white">{editingScore.name}</p></div>
            <div className="mb-6"><label className="block text-sm text-gray-400 mb-2">Nowa liczba punktów:</label><div className="flex items-center gap-2"><button onClick={() => setEditingScore({ ...editingScore, score: editingScore.score - 1 })} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded border border-white/10 font-bold">-1</button><input type="number" value={editingScore.score} onChange={(e) => setEditingScore({ ...editingScore, score: parseInt(e.target.value) || 0 })} className="flex-1 bg-black/20 border border-white/10 rounded h-10 px-3 text-center focus:border-primary focus:outline-none" /><button onClick={() => setEditingScore({ ...editingScore, score: editingScore.score + 1 })} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded border border-white/10 font-bold">+1</button></div></div>
            
            <div className="mb-6 pt-4 border-t border-white/10">
                <button 
                  onClick={() => {
                    onResetLifelines(editingScore.id);
                    setEditingScore(null);
                  }}
                  className="w-full py-2 px-3 rounded bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 text-sm text-blue-300 transition-colors flex items-center justify-center gap-2"
                >
                  <LifeBuoy className="w-4 h-4" /> Przywróć wszystkie koła
                </button>
            </div>

            <div className="flex gap-3"><button onClick={() => setEditingScore(null)} className="flex-1 py-2 px-4 rounded bg-transparent hover:bg-white/5 border border-white/10 text-gray-300">Anuluj</button><button onClick={saveScore} className="flex-1 py-2 px-4 rounded bg-primary hover:bg-indigo-600 text-white font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Zapisz</button></div>
          </div>
        </div>
      )}
      <AvatarModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

