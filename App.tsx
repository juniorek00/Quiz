
import React, { useState, useEffect } from 'react';
import { SetupPanel } from './components/SetupPanel';
import { GamePanel } from './components/GamePanel';
import { SummaryPanel } from './components/SummaryPanel';
import { Segment2SetupPanel } from './components/Segment2SetupPanel';
import { Segment2GamePanel } from './components/Segment2GamePanel';
import { Segment3SetupPanel } from './components/Segment3SetupPanel';
import { Segment3GamePanel } from './components/Segment3GamePanel';
import { Segment4SetupPanel } from './components/Segment4SetupPanel';
import { Segment4GamePanel } from './components/Segment4GamePanel';
import { AppState, GameConfig, GameMode, Player, Team, Question, LifelineType } from './types';
import { loadQuestionsFromCsv } from './utils';
import { FastForward } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState<AppState>('SETUP');
  
  // Stan określający, który segment ma zostać uruchomiony po kliknięciu "Następny Segment" w podsumowaniu
  const [nextStage, setNextStage] = useState<'SEGMENT2' | 'SEGMENT3' | 'SEGMENT4' | 'END_GAME'>('SEGMENT2');

  // --- Data from CSV ---
  const [questionsPool, setQuestionsPool] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // --- Global Game Data ---
  const [config, setConfig] = useState<GameConfig>({ 
    mode: 'INDIVIDUAL', 
    rounds: 1, 
    currentRound: 1,
    activeCategories: [] 
  });
  
  // Players and Teams - Persistent across segments
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Config for Segments
  const [segment2Rounds, setSegment2Rounds] = useState<number>(3);
  const [segment3Rounds, setSegment3Rounds] = useState<number>(3);

  // 1. Load CSV on Mount
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Po starcie aplikacji wczytujemy pytania do pamięci podręcznej
        const loadedQuestions = await loadQuestionsFromCsv();
        setQuestionsPool(loadedQuestions);
        setLoading(false);
      } catch (err) {
        setLoadError("Nie udało się wczytać pytań z pliku pytania.csv.");
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleStartGame = (
    mode: GameMode, 
    selectedPlayers: Player[], 
    selectedTeams: Team[], 
    rounds: number, 
    selectedCategories: string[]
  ) => {
    setConfig({
      mode,
      rounds,
      currentRound: 1,
      activeCategories: selectedCategories
    });
    setPlayers(selectedPlayers);
    setTeams(selectedTeams);
    setAppState('GAME');
  };

  const handleRoundChange = (newRound: number) => {
    setConfig(prev => ({ ...prev, currentRound: newRound }));
  };

  const handleEndGame = (finalPlayers: Player[], finalTeams: Team[]) => {
    // Update state with final scores
    setPlayers(finalPlayers);
    setTeams(finalTeams);
    // Po zakończeniu Segmentu 1 (GAME), następnym krokiem jest SEGMENT 2
    setNextStage('SEGMENT2');
    setAppState('SUMMARY');
  };

  const handleUpdateScore = (id: string, newScore: number) => {
    if (config.mode === 'INDIVIDUAL') {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, score: newScore } : p));
    } else {
      setTeams(prev => prev.map(t => t.id === id ? { ...t, score: newScore } : t));
    }
  };

  // Nowa funkcja: Zapisywanie użycia koła ratunkowego w stanie globalnym
  const handleUseLifeline = (id: string, lifeline: LifelineType) => {
    if (config.mode === 'INDIVIDUAL') {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, lifelinesUsed: [...p.lifelinesUsed, lifeline] } : p));
    } else {
      setTeams(prev => prev.map(t => t.id === id ? { ...t, lifelinesUsed: [...t.lifelinesUsed, lifeline] } : t));
    }
  };

  // Nowa funkcja: Resetowanie kół ratunkowych
  const handleResetLifelines = (id: string) => {
    if (config.mode === 'INDIVIDUAL') {
      setPlayers(prev => prev.map(p => p.id === id ? { ...p, lifelinesUsed: [] } : p));
    } else {
      setTeams(prev => prev.map(t => t.id === id ? { ...t, lifelinesUsed: [] } : t));
    }
  };

  const handleRestart = () => {
    setAppState('SETUP');
    setPlayers([]);
    setTeams([]);
    setNextStage('SEGMENT2');
    // Reload questions to reset the pool? 
    loadQuestionsFromCsv().then(qs => setQuestionsPool(qs)); 
  };

  // --- Segment Logic Handlers ---

  const goToNextSegment = () => {
    if (nextStage === 'SEGMENT2') {
      setAppState('SEGMENT2_SETUP');
    } else if (nextStage === 'SEGMENT3') {
      setAppState('SEGMENT3_SETUP');
    } else if (nextStage === 'SEGMENT4') {
      setAppState('SEGMENT4_SETUP');
    }
  };

  // --- Segment 2 ---
  const handleStartSegment2 = (rounds: number) => {
    setSegment2Rounds(rounds);
    setAppState('SEGMENT2_GAME');
  };
  const handleEndSegment2 = () => {
    setNextStage('SEGMENT3');
    setAppState('SUMMARY');
  };

  // --- Segment 3 ---
  const handleStartSegment3 = (rounds: number) => {
     setSegment3Rounds(rounds);
     setAppState('SEGMENT3_GAME');
  };
  const handleEndSegment3 = () => {
      // Po zakończeniu Segmentu 3 idziemy do Segmentu 4
      setNextStage('SEGMENT4');
      setAppState('SUMMARY');
  };

  // --- Segment 4 ---
  const handleStartSegment4 = () => {
     setAppState('SEGMENT4_GAME');
  };
  const handleEndSegment4 = () => {
     // Koniec gry po segmencie 4
     setNextStage('END_GAME');
     setAppState('SUMMARY');
  };

  // --- Force Skip Logic ---
  const handleForceNextSegment = () => {
    // Faza 1: Quiz Tekstowy -> Skok do Seg 2 Setup
    const isStage1 = ['SETUP', 'GAME'].includes(appState) || (appState === 'SUMMARY' && nextStage === 'SEGMENT2');
    
    // Faza 2: Filmy -> Skok do Seg 3 Setup
    const isStage2 = ['SEGMENT2_SETUP', 'SEGMENT2_GAME'].includes(appState) || (appState === 'SUMMARY' && nextStage === 'SEGMENT3');

    // Faza 3: Muzyka -> Skok do Seg 4 Setup
    const isStage3 = ['SEGMENT3_SETUP', 'SEGMENT3_GAME'].includes(appState) || (appState === 'SUMMARY' && nextStage === 'SEGMENT4');

    // Faza 4: Licytacja -> Koniec
    const isStage4 = ['SEGMENT4_SETUP', 'SEGMENT4_GAME'].includes(appState);

    if (isStage1) {
       setAppState('SEGMENT2_SETUP');
       setNextStage('SEGMENT3');
    } else if (isStage2) {
       setAppState('SEGMENT3_SETUP');
       setNextStage('SEGMENT4');
    } else if (isStage3) {
       setAppState('SEGMENT4_SETUP');
       setNextStage('END_GAME');
    } else if (isStage4) {
       setAppState('SUMMARY');
       setNextStage('END_GAME');
    }
  };


  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900 via-[#07221a] to-black text-white">
      
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
           <div 
             className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
             onClick={handleRestart}
             title="Wróć do strony głównej"
           >
             <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg rotate-3 relative">
               <span className="absolute -top-2 -right-2 text-sm">🎄</span>
             </div>
             <span className="font-bold text-xl tracking-tight">Quiz<span className="text-primary">Squadowy</span></span>
             <span className="ml-2 text-sm opacity-80">❄️</span>
           </div>
           
           <div className="flex items-center gap-4">
             {/* Header Info based on State */}
             {appState === 'GAME' && (
               <div className="hidden md:block text-sm font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                 Segment 1 | Runda {config.currentRound} / {config.rounds}
               </div>
             )}
             {appState === 'SEGMENT2_GAME' && (
               <div className="hidden md:block text-sm font-mono text-secondary bg-white/5 px-3 py-1 rounded-full">
                 Segment 2 | Filmy
               </div>
             )}
             {appState === 'SEGMENT3_GAME' && (
               <div className="hidden md:block text-sm font-mono text-purple-400 bg-white/5 px-3 py-1 rounded-full">
                 Segment 3 | Muzyka
               </div>
             )}
             {appState === 'SEGMENT4_GAME' && (
               <div className="hidden md:block text-sm font-mono text-yellow-400 bg-white/5 px-3 py-1 rounded-full">
                 Segment 4 | Licytacja
               </div>
             )}
             
             {/* Force Skip Button (Hidden if Game Ended) */}
             {nextStage !== 'END_GAME' && (
                <button 
                  onClick={handleForceNextSegment}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-sm px-4 py-2 rounded-lg transition-all shadow-lg shadow-orange-900/20 font-bold border border-white/10"
                  title="Wymuś przejście do następnego segmentu (Admin)"
                >
                  <span>Następny Segment</span> 
                  <FastForward className="w-4 h-4" />
                </button>
             )}
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        {loading && (
           <div className="text-center mt-20">
             <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-gray-400">Ładowanie bazy pytań...</p>
           </div>
        )}

        {loadError && (
          <div className="max-w-md mx-auto mt-10 p-6 bg-red-900/20 border border-red-500 rounded-xl text-center">
            <h2 className="text-red-400 font-bold text-xl mb-2">Błąd krytyczny</h2>
            <p className="text-gray-300">{loadError}</p>
            <p className="text-sm text-gray-500 mt-4">Sprawdź czy plik <code>pytania.csv</code> istnieje w katalogu głównym.</p>
          </div>
        )}

        {!loading && !loadError && (
          <>
            {appState === 'SETUP' && (
              <SetupPanel 
                onStartGame={handleStartGame} 
                questionsPool={questionsPool} 
              />
            )}

            {appState === 'GAME' && (
              <GamePanel 
                mode={config.mode}
                players={players}
                teams={teams}
                config={config}
                onEndGame={handleEndGame}
                onRoundChange={handleRoundChange}
                onUpdateScore={handleUpdateScore}
                onUseLifeline={handleUseLifeline}
                onResetLifelines={handleResetLifelines}
                initialQuestionsPool={questionsPool} 
              />
            )}

            {appState === 'SUMMARY' && (
              <SummaryPanel 
                mode={config.mode}
                players={players}
                teams={teams}
                onRestart={handleRestart}
                onUpdateScore={handleUpdateScore}
                onNextSegment={goToNextSegment}
                isFinalStage={nextStage === 'END_GAME'}
                nextSegmentLabel={
                    nextStage === 'SEGMENT2' ? "Następny Segment: Kadry Filmowe" : 
                    nextStage === 'SEGMENT3' ? "Następny Segment: Jaka to melodia?" : 
                    nextStage === 'SEGMENT4' ? "Następny Segment: Licytacja" : 
                    "Zakończ Grę (Wielki Finał)"
                }
              />
            )}

            {appState === 'SEGMENT2_SETUP' && (
              <Segment2SetupPanel onStartSegment={handleStartSegment2} />
            )}

            {appState === 'SEGMENT2_GAME' && (
               <Segment2GamePanel 
                  mode={config.mode}
                  players={players}
                  teams={teams}
                  totalRounds={segment2Rounds}
                  onEndSegment={handleEndSegment2}
                  onUpdateScore={handleUpdateScore}
                  onResetLifelines={handleResetLifelines}
               />
            )}

            {appState === 'SEGMENT3_SETUP' && (
              <Segment3SetupPanel onStartSegment={handleStartSegment3} />
            )}

            {appState === 'SEGMENT3_GAME' && (
               <Segment3GamePanel 
                  mode={config.mode}
                  players={players}
                  teams={teams}
                  totalRounds={segment3Rounds}
                  onEndSegment={handleEndSegment3}
                  onUpdateScore={handleUpdateScore}
                  onResetLifelines={handleResetLifelines}
               />
            )}

            {appState === 'SEGMENT4_SETUP' && (
              <Segment4SetupPanel onStartSegment={handleStartSegment4} />
            )}

            {appState === 'SEGMENT4_GAME' && (
               <Segment4GamePanel 
                  mode={config.mode}
                  players={players}
                  teams={teams}
                  onEndSegment={handleEndSegment4}
                  onUpdateScore={handleUpdateScore}
                  onResetLifelines={handleResetLifelines}
               />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
