
import React, { useState, useEffect } from 'react';
import { GameMode, Player, Team } from '../types';
import { SEGMENT4_CATEGORIES } from '../constants';
import { Trophy, Clock, CheckCircle, XCircle, Gavel, Play, ArrowRight, X, Edit2, Save, Timer, Users, LifeBuoy } from 'lucide-react';
import AvatarModal from './AvatarModal';

interface Segment4GamePanelProps {
  mode: GameMode;
  players: Player[];
  teams: Team[];
  onEndSegment: () => void;
  onUpdateScore: (id: string, newScore: number) => void;
  onResetLifelines: (id: string) => void;
}

type Phase = 'PREVIEW' | 'THINKING' | 'BIDDING' | 'GAMEPLAY' | 'TIE_BREAKER' | 'ROUND_SUMMARY';

export const Segment4GamePanel: React.FC<Segment4GamePanelProps> = ({
  mode,
  players,
  teams,
  onEndSegment,
  onUpdateScore,
  onResetLifelines
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const currentCategory = SEGMENT4_CATEGORIES[currentRoundIndex];
  const [phase, setPhase] = useState<Phase>('PREVIEW');
  const [timeLeft, setTimeLeft] = useState(0);
  const [tieBreakerDuration, setTieBreakerDuration] = useState<number>(30);
  const [bids, setBids] = useState<Record<string, number>>({});
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [winningEntityId, setWinningEntityId] = useState<string | null>(null);
  const [winnerBid, setWinnerBid] = useState<number>(0);
  const [tiedIds, setTiedIds] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [roundResult, setRoundResult] = useState<'WIN' | 'LOSE' | null>(null);
  const [tieBreakerPoints, setTieBreakerPoints] = useState<Record<string, number>>({});
  const [editingScore, setEditingScore] = useState<{ id: string, name: string, score: number } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const entities = mode === 'INDIVIDUAL' ? players : teams;

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    if (timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else {
      if (phase === 'THINKING') setPhase('BIDDING');
    }
    return () => clearTimeout(timerId);
  }, [timeLeft, phase]);

  const startThinking = () => {
    setTimeLeft(30);
    setPhase('THINKING');
  };

  const handleBidChange = (id: string, value: string) => {
    const val = parseInt(value) || 0;
    setBids(prev => ({ ...prev, [id]: val }));
  };

  const submitBids = () => {
    let maxBid = -1;
    let winners: string[] = [];
    entities.forEach(entity => {
      const bid = bids[entity.id] || 0;
      if (bid > maxBid) {
        maxBid = bid;
        winners = [entity.id];
      } else if (bid === maxBid) {
        winners.push(entity.id);
      }
    });

    if (maxBid === 0) {
      alert("Nikt nie zadeklarował wartości > 0!");
      return;
    }

    if (winners.length === 1) {
      setWinnerId(winners[0]);
      setWinningEntityId(winners[0]);
      setWinnerBid(maxBid);
      setCorrectAnswers([]);
      setWrongAnswers([]);
      setCurrentInput("");
      setRoundResult(null);
      setPhase('GAMEPLAY');
    } else {
      setTiedIds(winners);
      setTieBreakerPoints({});
      setTieBreakerDuration(30);
      setPhase('TIE_BREAKER');
    }
  };

  const startTieBreakerTimer = () => {
     setTimeLeft(tieBreakerDuration);
  };

  const handleTieBreakerPointsChange = (id: string, val: string) => {
    setTieBreakerPoints(prev => ({ ...prev, [id]: parseInt(val) || 0 }));
  };

  const submitTieBreaker = () => {
    Object.entries(tieBreakerPoints).forEach(([id, points]) => {
        if (points !== 0) {
            const currentScore = entities.find(e => e.id === id)?.score || 0;
            onUpdateScore(id, currentScore + points);
        }
    });
    finishRound();
  };

  const validateAnswer = () => {
    if (!currentInput.trim()) return;
    const normalizedInput = currentInput.trim().toLowerCase();
    
    if (correctAnswers.some(a => a.toLowerCase() === normalizedInput) || 
        wrongAnswers.some(a => a.toLowerCase() === normalizedInput)) {
        alert("Ta odpowiedź już padła!");
        setCurrentInput("");
        return;
    }

    const isValid = currentCategory.validValues.some(v => v.toLowerCase() === normalizedInput);
    if (isValid) {
      const niceName = currentCategory.validValues.find(v => v.toLowerCase() === normalizedInput) || currentInput;
      const newCorrect = [...correctAnswers, niceName];
      setCorrectAnswers(newCorrect);
      if (newCorrect.length >= winnerBid) handleWin();
    } else {
      const newWrong = [...wrongAnswers, currentInput];
      setWrongAnswers(newWrong);
      if (newWrong.length > currentCategory.errorThreshold) handleLose();
    }
    setCurrentInput("");
  };

  const handleWin = () => {
    if (!winnerId) return;
    const currentScore = entities.find(e => e.id === winnerId)?.score || 0;
    onUpdateScore(winnerId, currentScore + 10);
    setRoundResult('WIN');
    setWinningEntityId(null);
    setPhase('ROUND_SUMMARY');
  };

  const handleLose = () => {
    if (!winnerId) return;
    const currentScore = entities.find(e => e.id === winnerId)?.score || 0;
    onUpdateScore(winnerId, currentScore - 10);
    setRoundResult('LOSE');
    setWinningEntityId(null);
    setPhase('ROUND_SUMMARY');
  };

  const finishRound = () => {
    const nextRoundIndex = currentRoundIndex + 1;
    if (nextRoundIndex < SEGMENT4_CATEGORIES.length) {
      setCurrentRoundIndex(nextRoundIndex);
      setPhase('PREVIEW');
      setTimeLeft(0);
      setBids({});
      setWinnerId(null);
      setWinnerBid(0);
      setTiedIds([]);
      setRoundResult(null);
      setCorrectAnswers([]);
      setWrongAnswers([]);
    } else {
      onEndSegment();
    }
  };

  const getEntityName = (id: string) => entities.find(e => e.id === id)?.name || "Nieznany";
  const leaderboard = [...entities].sort((a, b) => b.score - a.score);
  
  const openScoreEditor = (id: string) => {
    const entity = entities.find(e => e.id === id);
    if (entity) setEditingScore({ id: entity.id, name: entity.name, score: entity.score });
  };
  const saveScore = () => {
    if (!editingScore) return;
    onUpdateScore(editingScore.id, editingScore.score);
    setEditingScore(null);
  };

  const renderAvatar = (entity: any, size: string = "w-8 h-8") => {
    if (mode === 'TEAM') {
      return (
        <img 
          src={(entity as Team).image} 
          alt={entity.name} 
          className={`${size} rounded-lg object-cover border border-white/20`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );
    }
    if (entity.avatar) return <img src={entity.avatar} alt={entity.name} className={`${size} rounded-full object-cover border border-white/20`} />;
    return <div className={`${size} rounded-full flex items-center justify-center font-bold text-white border border-white/20 ${entity.gender === 'M' ? 'bg-blue-600' : 'bg-pink-600'}`}>{entity.name.charAt(0).toUpperCase()}</div>;
  };

  if (!currentCategory) return <div>Koniec Segmentu</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 max-w-6xl mx-auto">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between bg-dark/50 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
             <div className="bg-yellow-600 p-2 rounded-lg"><Gavel className="w-6 h-6 text-white" /></div>
             <div><h2 className="text-xl font-bold">Segment 4: Licytacja</h2><p className="text-sm text-gray-400">Runda {currentRoundIndex + 1} z {SEGMENT4_CATEGORIES.length}</p></div>
          </div>
          {timeLeft > 0 && <div className="flex items-center gap-2 bg-red-900/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 animate-pulse"><Clock className="w-5 h-5" /><span className="font-mono font-bold text-2xl">{timeLeft}s</span></div>}
        </div>

        {phase === 'PREVIEW' && (
          <div className="bg-surface p-8 rounded-2xl border border-white/10 text-center animate-fade-in">
            <h3 className="text-gray-400 uppercase tracking-widest mb-4">KATEGORIA</h3>
            <h1 className="text-4xl font-black text-yellow-500 mb-6">{currentCategory.name}</h1>
            <div className="inline-block bg-white/10 px-6 py-3 rounded-lg text-xl mb-8">Max. liczba odpowiedzi: <span className="font-bold text-white">{currentCategory.maxValue}</span></div>
            <p className="text-gray-400 mb-8">Próg błędów: {currentCategory.errorThreshold}</p>
            <button onClick={startThinking} className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-2 mx-auto transition-colors"><Clock className="w-6 h-6" /> Rozpocznij Czas (30s)</button>
          </div>
        )}

        {phase === 'THINKING' && (
           <div className="bg-surface p-12 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <h2 className="text-3xl font-bold mb-4">Czas na naradę...</h2>
              <div className="text-6xl font-black font-mono text-yellow-500 animate-pulse">{timeLeft}</div>
              <p className="text-gray-400 mt-4">Zastanówcie się, ile haseł jesteście w stanie wymienić.</p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setTimeLeft(0);
                    setPhase('BIDDING');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  Zakończ przed czasem
                </button>
              </div>
           </div>
        )}

        {phase === 'BIDDING' && (
          <div className="bg-surface p-6 rounded-2xl border border-white/10 animate-fade-in">
             <h2 className="text-2xl font-bold text-center mb-6">Licytacja: Ile haseł wymienisz?</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {entities.map(entity => (
                  <div key={entity.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                     <div className="flex items-center gap-2 font-bold">
                       {renderAvatar(entity, "w-6 h-6")}
                       {entity.name}
                     </div>
                     <input type="number" min="0" max={currentCategory.maxValue} placeholder="0" value={bids[entity.id] || ''} onChange={(e) => handleBidChange(entity.id, e.target.value)} className="w-20 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-center text-xl font-bold focus:border-yellow-500 focus:outline-none" />
                  </div>
                ))}
             </div>
             <button onClick={submitBids} className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-xl transition-colors">Zatwierdź Licytację</button>
          </div>
        )}

        {phase === 'TIE_BREAKER' && (
          <div className="bg-surface p-6 rounded-2xl border border-white/10 animate-fade-in border-t-4 border-red-500">
             <div className="text-center mb-6"><h2 className="text-2xl font-bold text-red-400 mb-2">DOGRYWKA!</h2><p className="text-gray-300">Remis między: {tiedIds.map(id => getEntityName(id)).join(", ")}</p></div>
             {timeLeft === 0 && (
               <div className="flex flex-col items-center justify-center gap-4 mb-8 bg-white/5 p-6 rounded-xl border border-white/10">
                 <div className="flex items-center gap-3"><Timer className="w-5 h-5 text-gray-400" /><label className="text-sm text-gray-300">Ustaw czas dogrywki (s):</label><input type="number" min="1" value={tieBreakerDuration} onChange={(e) => setTieBreakerDuration(parseInt(e.target.value) || 0)} className="w-20 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-center font-bold focus:border-red-500 focus:outline-none" /></div>
                 <button onClick={startTieBreakerTimer} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-500/20">Start Czasu Dogrywki</button>
               </div>
             )}
             <div className="space-y-4 mb-8">
                {tiedIds.map(id => (
                   <div key={id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg"><span className="font-bold text-lg">{getEntityName(id)}</span><div className="flex items-center gap-2"><label className="text-sm text-gray-400">Punkty:</label><input type="number" value={tieBreakerPoints[id] || 0} onChange={(e) => handleTieBreakerPointsChange(id, e.target.value)} className="w-20 bg-black/30 border border-white/20 rounded px-2 py-1 text-center font-bold" /></div></div>
                ))}
             </div>
             <button onClick={submitTieBreaker} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors">Zatwierdź punkty i zakończ rundę</button>
          </div>
        )}

        {phase === 'GAMEPLAY' && winnerId && (
           <div className="bg-surface p-6 rounded-2xl border border-white/10 animate-fade-in">
              <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-xl mb-6 text-center">
                <p className="text-yellow-200 text-sm uppercase">Licytację wygrywa</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  {mode === 'TEAM' && (
                    <img 
                      src={(entities.find(e => e.id === winnerId) as Team)?.image} 
                      alt={getEntityName(winnerId)} 
                      className="w-12 h-12 rounded-lg object-cover border border-white/20 cursor-pointer hover:opacity-80 transition-opacity" 
                      onClick={(e) => {
                        e.stopPropagation();
                        const entity = entities.find(ent => ent.id === winnerId) as Team;
                        if (entity?.image) setSelectedImage(entity.image);
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <h2 className="text-3xl font-black text-white">{getEntityName(winnerId)}</h2>
                </div>
                <p className="text-xl font-bold text-yellow-400">Deklaracja: {winnerBid}</p>
              </div>
              <div className="flex gap-2 mb-6"><input type="text" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && validateAnswer()} placeholder="Wpisz odpowiedź..." className="flex-1 bg-dark border border-white/20 rounded-xl px-4 py-3 text-lg focus:border-yellow-500 focus:outline-none" autoFocus /><button onClick={validateAnswer} className="bg-primary hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold">Dodaj</button></div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 min-h-[200px]"><h3 className="text-green-400 font-bold mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Poprawne ({correctAnswers.length}/{winnerBid})</h3><ul className="space-y-1">{correctAnswers.map((ans, idx) => (<li key={idx} className="text-green-100 border-b border-green-500/10 pb-1">{ans}</li>))}</ul></div>
                 <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 min-h-[200px]"><h3 className="text-red-400 font-bold mb-3 flex items-center gap-2"><XCircle className="w-5 h-5" /> Błędne ({wrongAnswers.length}/{currentCategory.errorThreshold + 1})</h3><ul className="space-y-1">{wrongAnswers.map((ans, idx) => (<li key={idx} className="text-red-100 border-b border-red-500/10 pb-1">{ans}</li>))}</ul></div>
              </div>
           </div>
        )}

        {phase === 'ROUND_SUMMARY' && roundResult && (
           <div className={`p-8 rounded-2xl text-center border animate-fade-in ${roundResult === 'WIN' ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
              {roundResult === 'WIN' ? (<><Trophy className="w-20 h-20 text-green-400 mx-auto mb-4" /><h2 className="text-4xl font-black text-green-400 mb-2">SUKCES!</h2><p className="text-xl text-white">Drużyna zdobywa <span className="font-bold">+10 punktów</span>.</p></>) : (<><XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" /><h2 className="text-4xl font-black text-red-400 mb-2">PORAŻKA</h2><p className="text-xl text-white">Drużyna traci <span className="font-bold">-10 punktów</span>.</p></>)}
              <button onClick={finishRound} className="mt-8 bg-white text-dark hover:bg-gray-200 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mx-auto">{currentRoundIndex < SEGMENT4_CATEGORIES.length - 1 ? "Następna Kategoria" : "Zakończ Segment"} <ArrowRight className="w-6 h-6" /></button>
           </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-surface p-4 rounded-xl border border-white/10 h-fit sticky top-4">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Ranking</h3>
          <ul className="space-y-2">
            {leaderboard.map((entity: any, idx) => (
              <li key={entity.id} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`font-mono text-sm ${idx === 0 ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>#{idx + 1}</span>
                  {mode === 'TEAM' && (entity as Team).image ? (
                    <img 
                      src={(entity as Team).image} 
                      alt={entity.name} 
                      className="w-6 h-6 rounded-lg object-cover border border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((entity as Team).image);
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    renderAvatar(entity)
                  )}
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

      <AvatarModal src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};
