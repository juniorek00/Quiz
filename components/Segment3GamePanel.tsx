
import React, { useState, useEffect, useRef } from 'react';
import { GameMode, Player, Team, MusicPair } from '../types';
import { MUSIC_PAIRS } from '../constants';
import { Trophy, ArrowRight, XCircle, Music, Edit2, PlayCircle, PauseCircle, Volume2, Save, X, Star, CheckCircle2, Users, LifeBuoy, Pause, Play, RotateCcw } from 'lucide-react';

interface Segment3GamePanelProps {
  mode: GameMode;
  players: Player[];
  teams: Team[];
  totalRounds: number;
  onEndSegment: () => void;
  onUpdateScore: (id: string, newScore: number) => void;
  onResetLifelines: (id: string) => void;
}

export const Segment3GamePanel: React.FC<Segment3GamePanelProps> = ({
  mode,
  players,
  teams,
  totalRounds,
  onEndSegment,
  onUpdateScore,
  onResetLifelines
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [activePair, setActivePair] = useState<MusicPair | null>(null);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  
  type AudioPhase = 'IDLE' | 'PLAYING_QUESTION' | 'WAITING_FOR_REVEAL' | 'PLAYING_ANSWER' | 'FINISHED';
  const [phase, setPhase] = useState<AudioPhase>('IDLE');
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [winningEntityName, setWinningEntityName] = useState<string | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState<number>(0);
  const [showAnswerButtonEnabled, setShowAnswerButtonEnabled] = useState(false);
  const [scoringCandidate, setScoringCandidate] = useState<{ id: string, name: string } | null>(null);
  const [editingScore, setEditingScore] = useState<{ id: string, name: string, score: number } | null>(null);

  const loadNextRound = () => {
    const availablePairs = MUSIC_PAIRS.filter(p => !usedIds.includes(p.id));
    if (availablePairs.length === 0) {
      onEndSegment();
      return;
    }
    const randomIndex = Math.floor(Math.random() * availablePairs.length);
    const selected = availablePairs[randomIndex];
    setActivePair(selected);
    setUsedIds(prev => [...prev, selected.id]);
    setPhase('IDLE');
    setIsPaused(false);
    setWinningEntityName(null);
    setPointsAwarded(0);
    setShowAnswerButtonEnabled(false);
    setScoringCandidate(null);
  };

  useEffect(() => {
    loadNextRound();
  }, []);

  useEffect(() => {
    if (activePair && phase === 'IDLE') {
        playQuestion();
    }
  }, [activePair]);

  const playQuestion = () => {
    if (!activePair) return;
    setPhase('PLAYING_QUESTION');
    setIsPaused(false);
    if (audioRef.current) {
        audioRef.current.src = activePair.questionSrc;
        audioRef.current.play().catch(e => console.error("Autoplay blocked:", e));
    }
  };

  const playAnswer = () => {
    if (!activePair) return;
    setPhase('PLAYING_ANSWER');
    setIsPaused(false);
    if (audioRef.current) {
        audioRef.current.src = activePair.answerSrc;
        audioRef.current.play().catch(e => console.error("Play error:", e));
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const replayQuestion = () => {
    if (!activePair) return;
    if (phase === 'PLAYING_ANSWER') {
      setPhase('PLAYING_ANSWER');
      if (audioRef.current) {
        audioRef.current.src = activePair.answerSrc;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Play error:", e));
      }
    } else {
      playQuestion();
    }
  };

  const handleAudioEnded = () => {
    if (phase === 'PLAYING_QUESTION') {
        setPhase('WAITING_FOR_REVEAL');
        setShowAnswerButtonEnabled(true);
        setIsPaused(false);
    } 
  };

  const handleTeamClick = (entityId: string, entityName: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
    }
    setScoringCandidate({ id: entityId, name: entityName });
  };

  const confirmPoints = (points: number) => {
    if (!scoringCandidate) return;
    let currentScore = 0;
    if (mode === 'INDIVIDUAL') {
      const p = players.find(p => p.id === scoringCandidate.id);
      if (p) currentScore = p.score;
    } else {
      const t = teams.find(t => t.id === scoringCandidate.id);
      if (t) currentScore = t.score;
    }
    onUpdateScore(scoringCandidate.id, currentScore + points);
    setPhase('FINISHED');
    setWinningEntityName(scoringCandidate.name);
    setPointsAwarded(points);
    setScoringCandidate(null);
  };

  const handleNoPoints = () => {
    if (audioRef.current) audioRef.current.pause();
    setPhase('FINISHED');
    setWinningEntityName(null);
    setPointsAwarded(0);
  };

  const handleNextRoundButton = () => {
    if (currentRound >= totalRounds) {
        onEndSegment();
    } else {
        setCurrentRound(prev => prev + 1);
        loadNextRound();
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
    if (mode === 'TEAM') return <div className={`${size} rounded-lg bg-secondary flex items-center justify-center text-white`}><Users className="w-1/2 h-1/2" /></div>;
    if (entity.avatar) return <img src={entity.avatar} alt={entity.name} className={`${size} rounded-full object-cover border border-white/20`} />;
    return <div className={`${size} rounded-full flex items-center justify-center font-bold text-white border border-white/20 ${entity.gender === 'M' ? 'bg-blue-600' : 'bg-pink-600'}`}>{entity.name.charAt(0).toUpperCase()}</div>;
  };

  const entities = mode === 'INDIVIDUAL' ? players : teams;
  const leaderboard = [...entities].sort((a, b) => b.score - a.score);

  if (!activePair) return <div className="text-center p-10">Ładowanie segmentu 3...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 max-w-6xl mx-auto">
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between bg-dark/50 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
             <div className="bg-purple-600 p-2 rounded-lg"><Music className="w-6 h-6 text-white" /></div>
             <div><h2 className="text-xl font-bold">Segment 3: Jaka to melodia?</h2><p className="text-sm text-gray-400">Runda {currentRound} z {totalRounds}</p></div>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-2xl text-center relative flex flex-col items-center justify-center min-h-[300px]">
          <div className="mb-8 w-full">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 border-4 transition-all relative ${phase === 'PLAYING_QUESTION' ? 'border-purple-500 bg-purple-500/20' : phase === 'PLAYING_ANSWER' ? 'border-green-500 bg-green-500/20' : 'border-gray-600 bg-gray-800'}`}>
                 {(phase === 'PLAYING_QUESTION' || phase === 'PLAYING_ANSWER') ? <Volume2 className={`w-16 h-16 text-white ${!isPaused ? 'animate-pulse' : 'opacity-50'}`} /> : <PlayCircle className="w-16 h-16 text-gray-500" />}
                 
                 {/* Pause Overlay Indicator */}
                 {isPaused && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                     <Pause className="w-12 h-12 text-white fill-white" />
                   </div>
                 )}
            </div>
            
            <h3 className="text-2xl font-bold mb-2">
              {phase === 'PLAYING_QUESTION' ? "Odtwarzanie pytania..." : 
               phase === 'PLAYING_ANSWER' ? "Odtwarzanie odpowiedzi..." : 
               phase === 'FINISHED' ? "Runda Zakończona" : "Oczekiwanie..."}
            </h3>
            
            {phase === 'PLAYING_QUESTION' && <p className="text-purple-400">Słuchaj uważnie...</p>}
            {phase === 'WAITING_FOR_REVEAL' && <p className="text-gray-400">Koniec fragmentu. Kto zgłosił się pierwszy?</p>}

            {/* Title Reveal - Show during Answer or Finished phase */}
            {(phase === 'PLAYING_ANSWER' || phase === 'FINISHED') && activePair.title && (
              <div className="mt-4 animate-fade-in">
                 <div className="text-sm text-gray-500 uppercase tracking-widest mb-1">Tytuł utworu</div>
                 <h2 className="text-4xl font-black text-white drop-shadow-lg bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                   {activePair.title}
                 </h2>
              </div>
            )}
            
            {/* Playback Controls */}
            {(phase === 'PLAYING_QUESTION' || phase === 'PLAYING_ANSWER') && (
              <div className="mt-4 flex justify-center gap-4">
                <button 
                  onClick={togglePlayback}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-3 transition-all"
                  title={isPaused ? "Wznów" : "Zatrzymaj"}
                >
                  {isPaused ? <Play className="w-6 h-6 fill-white" /> : <Pause className="w-6 h-6 fill-white" />}
                </button>
                <button 
                  onClick={replayQuestion}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-3 transition-all"
                  title="Odtwórz ponownie"
                >
                  <RotateCcw className="w-6 h-6 text-white" />
                </button>
              </div>
            )}
          </div>

          {phase !== 'FINISHED' && (
              <button onClick={playAnswer} disabled={phase === 'PLAYING_ANSWER'} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all mb-8 ${phase !== 'PLAYING_ANSWER' ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                 <PlayCircle className="w-5 h-5" /> Pokaż Odpowiedź
              </button>
          )}

          {phase !== 'FINISHED' ? (
            <div className="w-full animate-fade-in border-t border-white/10 pt-6">
              <p className="text-gray-400 mb-4 uppercase tracking-widest text-sm">Wybierz drużynę:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {entities.map(entity => (
                  <button key={entity.id} onClick={() => handleTeamClick(entity.id, entity.name)} className="py-3 px-4 bg-white/5 hover:bg-purple-600 hover:text-white border border-white/10 rounded-xl font-bold transition-all truncate">{entity.name}</button>
                ))}
              </div>
              <div className="mt-4">
                 <button onClick={handleNoPoints} className="text-gray-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"><XCircle className="w-4 h-4" /> Zakończ bez punktów</button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
               <div className="text-left">
                  {winningEntityName ? (
                    <>
                      <div className="text-sm text-gray-400">Punkty przyznane dla:</div>
                      <div className="flex items-center gap-2"><span className="text-2xl font-bold text-green-400">{winningEntityName}</span><span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">+{pointsAwarded} pkt</span></div>
                    </>
                  ) : <div className="text-xl font-bold text-gray-400">Brak punktów.</div>}
               </div>
               <button onClick={handleNextRoundButton} className="bg-white text-dark hover:bg-gray-200 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg">{currentRound >= totalRounds ? "Zakończ Segment" : "Następna Runda"} <ArrowRight className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-surface p-4 rounded-xl border border-white/10 h-fit sticky top-4">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Ranking</h3>
          <ul className="space-y-2">
            {leaderboard.map((entity: any, idx) => (
              <li key={entity.id} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`font-mono text-sm ${idx === 0 ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>#{idx + 1}</span>
                  {renderAvatar(entity)}
                  <span className="truncate max-w-[100px] text-sm">{entity.name}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="font-bold text-secondary">{entity.score}</span>
                   <button onClick={() => openScoreEditor(entity.id)} className="text-gray-500 hover:text-white transition-colors p-1"><Edit2 className="w-3 h-3" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {scoringCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-purple-500/50 p-6 rounded-2xl w-full max-w-md shadow-2xl">
             <div className="text-center mb-6"><h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Przyznaj punkty dla</h3><h2 className="text-3xl font-bold text-white">{scoringCandidate.name}</h2></div>
             <div className="grid grid-cols-1 gap-4 mb-6">
                <button onClick={() => confirmPoints(5)} className="bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500 p-4 rounded-xl flex items-center justify-between group transition-all">
                   <div className="text-left"><div className="text-yellow-400 font-bold text-xl group-hover:scale-110 transition-transform">+5 pkt</div><div className="text-gray-400 text-sm">Autor LUB Tytuł</div></div><Star className="w-8 h-8 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                </button>
                <button onClick={() => confirmPoints(10)} className="bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500 p-4 rounded-xl flex items-center justify-between group transition-all">
                   <div className="text-left"><div className="text-green-400 font-bold text-xl group-hover:scale-110 transition-transform">+10 pkt</div><div className="text-gray-400 text-sm">Autor ORAZ Tytuł</div></div><CheckCircle2 className="w-8 h-8 text-gray-600 group-hover:text-green-400 transition-colors" />
                </button>
             </div>
             <button onClick={() => setScoringCandidate(null)} className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 transition-colors">Anuluj</button>
          </div>
        </div>
      )}

      {editingScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex items-center gap-2"><Edit2 className="w-5 h-5 text-primary" /> Edycja punktów</h3><button onClick={() => setEditingScore(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
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
    </div>
  );
};
