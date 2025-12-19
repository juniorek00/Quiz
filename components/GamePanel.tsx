
import React, { useState, useEffect, useCallback } from 'react';
import { GameConfig, GameMode, Player, Team, Question, LifelineType } from '../types';
import { HelpCircle, RefreshCw, Zap, Trophy, SkipForward, Clock, Shuffle, Edit2, X, Save, Users, LifeBuoy } from 'lucide-react';
import AvatarModal from './AvatarModal';

interface GamePanelProps {
  mode: GameMode;
  players: Player[];
  teams: Team[];
  config: GameConfig;
  onEndGame: (finalPlayers: Player[], finalTeams: Team[]) => void;
  onRoundChange: (newRound: number) => void;
  onUpdateScore: (id: string, newScore: number) => void;
  onUseLifeline: (id: string, lifeline: LifelineType) => void;
  onResetLifelines: (id: string) => void;
  initialQuestionsPool: Question[];
}

type TurnState = 'CATEGORY_SELECT' | 'ANSWERING' | 'RESULT';

export const GamePanel: React.FC<GamePanelProps> = ({ 
  mode, 
  players: initialPlayers, 
  teams: initialTeams, 
  config, 
  onEndGame,
  onRoundChange,
  onUpdateScore,
  onUseLifeline,
  onResetLifelines,
  initialQuestionsPool
}) => {
  // --- Game State ---
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>(initialPlayers);
  const [currentTeams, setCurrentTeams] = useState<Team[]>(initialTeams);
  
  // Sync props with state
  useEffect(() => { setCurrentPlayers(initialPlayers); }, [initialPlayers]);
  useEffect(() => { setCurrentTeams(initialTeams); }, [initialTeams]);

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>(() => {
    return initialQuestionsPool.filter(q => config.activeCategories.includes(q.category));
  });

  const [usedSwapIds, setUsedSwapIds] = useState<string[]>([]);
  
  const [turnIndex, setTurnIndex] = useState(0);
  const [turnState, setTurnState] = useState<TurnState>('CATEGORY_SELECT');
  
  const [turnCategories, setTurnCategories] = useState<string[]>([]);

  // Current Question Logic
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [timeRanOut, setTimeRanOut] = useState<boolean>(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Lifeline Local State for current question
  const [hiddenAnswers, setHiddenAnswers] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  
  const [editingScore, setEditingScore] = useState<{ id: string, name: string, score: number } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // --- Derived Data ---
  const getCurrentEntity = () => {
    return mode === 'INDIVIDUAL' ? currentPlayers[turnIndex] : currentTeams[turnIndex];
  };
  
  const currentEntity = getCurrentEntity();

  // --- Logic for Category Randomization ---
  const getAvailableCategories = useCallback(() => {
    return Array.from(new Set(availableQuestions.map(q => q.category)));
  }, [availableQuestions]);

  const rollTurnCategories = useCallback(() => {
    const categories = getAvailableCategories();
    if (categories.length < 2) {
      setTurnCategories([]);
      return;
    }
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    setTurnCategories(shuffled.slice(0, 2));
  }, [getAvailableCategories]);

  useEffect(() => {
    rollTurnCategories();
  }, []);

  // --- Helpers ---
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    if (turnState === 'ANSWERING' && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (turnState === 'ANSWERING' && timeLeft === 0) {
      handleTimeUp();
    }

    return () => clearTimeout(timerId);
  }, [turnState, timeLeft]);


  const getNextTurn = () => {
    const totalEntities = mode === 'INDIVIDUAL' ? currentPlayers.length : currentTeams.length;
    const nextIndex = (turnIndex + 1) % totalEntities;

    if (nextIndex === 0) {
      const nextRound = config.currentRound + 1;
      if (config.currentRound >= config.rounds) {
        onEndGame(currentPlayers, currentTeams);
        return;
      }
      const cats = getAvailableCategories();
      if (cats.length < 2) {
        onEndGame(currentPlayers, currentTeams);
        return;
      }
      onRoundChange(nextRound);
    }

    setTurnIndex(nextIndex);
    setTurnState('CATEGORY_SELECT');
    
    setHiddenAnswers([]);
    setShowHint(false);
    setLastAnswerCorrect(null);
    setTimeRanOut(false);
    setCorrectAnswerIndex(null);
    setCurrentQuestion(null);
    setSelectedCategory(null);
    setTimeLeft(30);

    rollTurnCategories();
  };

  const handleCategorySelect = (category: string) => {
    const questionIndices = availableQuestions
        .map((q, index) => ({ q, index }))
        .filter(item => item.q.category === category);

    if (questionIndices.length === 0) return;

    const randomIndex = Math.floor(Math.random() * questionIndices.length);
    const selectedItem = questionIndices[randomIndex];

    const newPool = [...availableQuestions];
    newPool.splice(selectedItem.index, 1);
    setAvailableQuestions(newPool);
    
    setCurrentQuestion(selectedItem.q);
    setSelectedCategory(category);
    setTimeLeft(30);
    setTurnState('ANSWERING');
  };

  const handleTimeUp = () => {
    if (!currentQuestion) return;
    setLastAnswerCorrect(false);
    setTimeRanOut(true);
    setCorrectAnswerIndex(currentQuestion.correctIndex);
    setTurnState('RESULT');
  };

  const handleAnswer = (index: number) => {
    if (!currentQuestion) return;

    const isCorrect = index === currentQuestion.correctIndex;
    setLastAnswerCorrect(isCorrect);
    setCorrectAnswerIndex(currentQuestion.correctIndex);

    if (isCorrect) {
      const current = mode === 'INDIVIDUAL' ? currentPlayers[turnIndex] : currentTeams[turnIndex];
      onUpdateScore(current.id, current.score + 1);
    }

    setTurnState('RESULT');
  };

  const openScoreEditor = (id: string) => {
    const entity = mode === 'INDIVIDUAL' 
      ? currentPlayers.find(p => p.id === id) 
      : currentTeams.find(t => t.id === id);
      
    if (entity) {
      setEditingScore({ id: entity.id, name: entity.name, score: entity.score });
    }
  };

  const saveScore = () => {
    if (!editingScore) return;
    onUpdateScore(editingScore.id, editingScore.score);
    setEditingScore(null);
  };

  const useLifeline = (type: LifelineType) => {
    const current = mode === 'INDIVIDUAL' ? currentPlayers[turnIndex] : currentTeams[turnIndex];
    
    // Zaktualizuj stan w komponencie nadrzędnym (App.tsx), aby zmiana była trwała
    onUseLifeline(current.id, type);

    // Lokalne efekty UI koła
    if (type === 'FIFTY_FIFTY' && currentQuestion) {
      const wrongIndices = currentQuestion.answers
        .map((_, idx) => idx)
        .filter(idx => idx !== currentQuestion.correctIndex);
      for (let i = wrongIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wrongIndices[i], wrongIndices[j]] = [wrongIndices[j], wrongIndices[i]];
      }
      setHiddenAnswers(wrongIndices.slice(0, 2));
    }

    if (type === 'HINT') {
      setShowHint(true);
      setTimeLeft(prev => prev + 20);
    }

    if (type === 'SWAP' && currentQuestion) {
      const swapCategory = "Inne";
      const availableSwapQuestions = initialQuestionsPool.filter(
        q => q.category === swapCategory && !usedSwapIds.includes(q.id)
      );

      let selectedQuestion: Question | undefined;
      if (availableSwapQuestions.length > 0) {
         const randomIndex = Math.floor(Math.random() * availableSwapQuestions.length);
         selectedQuestion = availableSwapQuestions[randomIndex];
      }

      if (selectedQuestion) {
         setUsedSwapIds(prev => [...prev, selectedQuestion!.id]);
         setCurrentQuestion(selectedQuestion);
         setHiddenAnswers([]);
         setTimeLeft(30);
      } else {
         alert("Brak pytań zapasowych w kategorii 'Inne'! Niestety koło przepadło.");
      }
    }
  };

  const isLifelineAvailable = (type: LifelineType) => {
    return !currentEntity.lifelinesUsed.includes(type);
  };

  useEffect(() => {
    const availableCats = getAvailableCategories();
    if (availableCats.length < 2 && turnState === 'CATEGORY_SELECT') {
      onEndGame(currentPlayers, currentTeams);
    }
  }, [availableQuestions, turnState, onEndGame, currentPlayers, currentTeams, getAvailableCategories]);

  // --- UI Helpers ---
  const renderAvatar = (entity: any, size: string = "w-10 h-10", clickable: boolean = false) => {
    if (mode === 'TEAM') {
      if (entity.image) {
        return (
          <img 
            src={entity.image} 
            alt={entity.name} 
            className={`${size} rounded-lg object-cover border border-white/20 ${clickable ? 'cursor-pointer hover:border-yellow-500/50' : ''}`}
            onClick={(e) => {
              if (clickable) {
                e.stopPropagation();
                setSelectedImage(entity.image);
              }
            }}
          />
        );
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

  const renderLeaderboard = () => {
    const list = mode === 'INDIVIDUAL' 
      ? [...currentPlayers].sort((a, b) => b.score - a.score)
      : [...currentTeams].sort((a, b) => b.score - a.score);

    return (
      <div className="bg-surface p-4 rounded-xl border border-white/10 h-fit sticky top-4">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Punktacja
        </h3>
        <ul className="space-y-2">
          {list.map((entity: any, idx) => (
            <li key={entity.id} className={`flex justify-between items-center p-2 rounded ${
              (mode === 'INDIVIDUAL' && currentPlayers[turnIndex].id === entity.id) ||
              (mode === 'TEAM' && currentTeams[turnIndex].id === entity.id)
                ? 'bg-primary/20 border border-primary/50'
                : 'bg-white/5'
            }`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-gray-400 text-sm w-4">#{idx + 1}</span>
                {renderAvatar(entity, "w-8 h-8", mode === 'TEAM')}
                <span className="truncate max-w-[100px] text-sm">{entity.name}</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="font-bold text-secondary text-sm">{entity.score}</span>
                 <button 
                  onClick={() => openScoreEditor(entity.id)}
                  className="text-gray-500 hover:text-white transition-colors p-1"
                 >
                   <Edit2 className="w-3 h-3" />
                 </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Find the entity currently being edited to show their lifelines
  const editingEntity = editingScore 
    ? (mode === 'INDIVIDUAL' ? currentPlayers.find(p => p.id === editingScore.id) : currentTeams.find(t => t.id === editingScore.id))
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 max-w-6xl mx-auto">
      
      {/* Main Game Area */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Top Bar: Whose Turn */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl border border-white/10 text-center relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          <h2 className="text-gray-400 uppercase tracking-widest text-xs mb-3">Aktualna Tura</h2>
          <div className="flex items-center gap-4">
             {renderAvatar(currentEntity, "w-16 h-16", mode === 'TEAM')}
             <h1 className="text-4xl font-black text-white">{currentEntity.name}</h1>
          </div>
        </div>

        {/* --- PHASE 1: Category Selection (Now Randomized) --- */}
        {turnState === 'CATEGORY_SELECT' && (
          <div className="bg-surface p-8 rounded-2xl border border-white/10 text-center animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
               <Shuffle className="w-6 h-6 text-primary" />
               Wylosowane kategorie
            </h3>
            
            {turnCategories.length === 0 ? (
               <div className="text-red-400">Brak wystarczającej liczby kategorii. Koniec gry...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {turnCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="p-8 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary transition-all group"
                  >
                    <span className="text-xl font-bold group-hover:text-primary transition-colors">{cat}</span>
                    <div className="text-sm text-gray-500 mt-2">
                       Dostępne pytania: {availableQuestions.filter(q => q.category === cat).length}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-6">Wybierz jedną z wylosowanych kategorii.</p>
          </div>
        )}

        {/* --- PHASE 2 & 3: Question & Result --- */}
        {(turnState === 'ANSWERING' || turnState === 'RESULT') && currentQuestion && (
          <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            
            <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex gap-3">
                 {turnState === 'ANSWERING' && (
                    <>
                      <LifelineButton 
                        icon={<div className="font-bold text-xs">50:50</div>} 
                        label="50/50" 
                        available={isLifelineAvailable('FIFTY_FIFTY')} 
                        onClick={() => useLifeline('FIFTY_FIFTY')} 
                      />
                      <LifelineButton 
                        icon={<HelpCircle className="w-4 h-4" />} 
                        label="Podpowiedź" 
                        available={isLifelineAvailable('HINT')} 
                        onClick={() => useLifeline('HINT')} 
                      />
                      <LifelineButton 
                        icon={<RefreshCw className="w-4 h-4" />} 
                        label="Wymiana" 
                        available={isLifelineAvailable('SWAP')} 
                        onClick={() => useLifeline('SWAP')} 
                      />
                    </>
                 )}
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  timeLeft <= 10 && turnState === 'ANSWERING'
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                  : 'bg-black/30 border-white/10 text-white'
              }`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-2xl font-bold w-8 text-center">{timeLeft}</span>
              </div>
            </div>

            {showHint && (
               <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-center animate-fade-in">
                  <h4 className="text-yellow-400 text-lg font-bold flex items-center justify-center gap-2">
                     <HelpCircle className="w-6 h-6" />
                     PODPOWIEDŹ AKTYWNA
                  </h4>
                  {/* <p className="text-white font-medium mt-2 text-lg">
                    {currentQuestion.hint || "Brak zdefiniowanej podpowiedzi w bazie pytań."}
                  </p> */}
                  <p className="text-yellow-200/60 text-xs mt-2">+20 sekund do czasu gry.</p>
               </div>
            )}

            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300 mb-3 border border-white/5">
                {currentQuestion.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                {currentQuestion.text}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.answers.map((ans, idx) => {
                const isHidden = hiddenAnswers.includes(idx);
                const isCorrect = idx === currentQuestion.correctIndex;
                let btnClass = "bg-white/5 hover:bg-white/10 border-white/10";
                
                if (turnState === 'RESULT') {
                  if (isCorrect) btnClass = "bg-green-500/20 border-green-500 text-green-300";
                  else if (correctAnswerIndex === idx) btnClass = "bg-green-500/20 border-green-500 text-green-300";
                  else btnClass = "bg-red-500/10 border-red-500/30 text-red-400 opacity-50";
                }

                if (isHidden) {
                  return <div key={idx} className="bg-transparent" />;
                }

                return (
                  <button
                    key={idx}
                    disabled={turnState === 'RESULT'}
                    onClick={() => handleAnswer(idx)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${btnClass}`}
                  >
                    <span className="font-bold mr-2 text-white/40">{String.fromCharCode(65 + idx)}.</span>
                    {ans}
                  </button>
                );
              })}
            </div>

            {turnState === 'RESULT' && (
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="text-center sm:text-left">
                  {timeRanOut ? (
                    <div className="text-red-400 font-bold text-xl flex items-center gap-2">
                       <Clock className="w-6 h-6" /> Czas minął!
                    </div>
                  ) : lastAnswerCorrect ? (
                    <div className="text-green-400 font-bold text-xl flex items-center gap-2">
                      <Zap className="w-6 h-6 fill-current" /> Poprawna odpowiedź! (+1 pkt)
                    </div>
                  ) : (
                    <div className="text-red-400 font-bold text-xl">
                      Błędna odpowiedź.
                    </div>
                  )}
                </div>
                <button
                  onClick={getNextTurn}
                  className="bg-white text-dark hover:bg-gray-200 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                  Następna tura <SkipForward className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
            <button 
                onClick={() => onEndGame(currentPlayers, currentTeams)} 
                className="text-red-400 hover:text-red-300 text-sm underline mt-4"
            >
                Zakończ quiz przed czasem
            </button>
        </div>

      </div>

      <div className="lg:col-span-1">
         {renderLeaderboard()}
      </div>

      <AvatarModal src={selectedImage} onClose={() => setSelectedImage(null)} />

      {editingScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" /> Edycja punktów
              </h3>
              <button 
                onClick={() => setEditingScore(null)} 
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-1">Uczestnik/Drużyna:</p>
              <p className="font-bold text-lg text-white">{editingScore.name}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Nowa liczba punktów:</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingScore({ ...editingScore, score: editingScore.score - 1 })} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded border border-white/10 font-bold">-1</button>
                <input type="number" value={editingScore.score} onChange={(e) => setEditingScore({ ...editingScore, score: parseInt(e.target.value) || 0 })} className="flex-1 bg-black/20 border border-white/10 rounded h-10 px-3 text-center focus:border-primary focus:outline-none" />
                <button onClick={() => setEditingScore({ ...editingScore, score: editingScore.score + 1 })} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded border border-white/10 font-bold">+1</button>
              </div>
            </div>

            {editingEntity && (
              <div className="mb-6 pt-4 border-t border-white/10">
                <label className="block text-sm text-gray-400 mb-2">Koła ratunkowe:</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editingEntity.lifelinesUsed.length === 0 ? (
                    <span className="text-xs text-gray-500 italic">Brak zużytych kół.</span>
                  ) : (
                    editingEntity.lifelinesUsed.map((l, i) => (
                      <span key={i} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded border border-red-500/30">
                        {l === 'FIFTY_FIFTY' ? '50:50' : l === 'HINT' ? 'Podpowiedź' : 'Wymiana'}
                      </span>
                    ))
                  )}
                </div>
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
            )}

            <div className="flex gap-3">
              <button onClick={() => setEditingScore(null)} className="flex-1 py-2 px-4 rounded bg-transparent hover:bg-white/5 border border-white/10 text-gray-300">Anuluj</button>
              <button onClick={saveScore} className="flex-1 py-2 px-4 rounded bg-primary hover:bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"><Save className="w-4 h-4" /> Zapisz</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const LifelineButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  available: boolean;
  onClick: () => void;
}> = ({ icon, label, available, onClick }) => (
  <button
    onClick={onClick}
    disabled={!available}
    title={label}
    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
      available
        ? 'bg-blue-600 border-blue-400 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
        : 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
    }`}
  >
    {icon}
  </button>
);
