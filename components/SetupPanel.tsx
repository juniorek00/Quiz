
import React, { useState, useMemo } from 'react';
import { GameMode, Player, Team, Question } from '../types';
import { UserPlus, Trash2, Users, Play, Shuffle, Edit2, Database, AlertCircle, Wand2 } from 'lucide-react';
import { generateBalancedTeams } from '../utils';
import { AVATARS_PATH, AVATAR_FILES, TEAM_PHOTOS, TEAM_PHOTOS_PATH } from '../constants';
import AvatarModal from './AvatarModal';

interface SetupPanelProps {
  onStartGame: (mode: GameMode, players: Player[], teams: Team[], rounds: number, selectedCategories: string[]) => void;
  questionsPool: Question[];
}

export const SetupPanel: React.FC<SetupPanelProps> = ({ onStartGame, questionsPool }) => {
  const [mode, setMode] = useState<GameMode>('INDIVIDUAL');
  const [rounds, setRounds] = useState<number>(3);
  
  // Participant State
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  
  // Team Config State
  const [teamCount, setTeamCount] = useState<number>(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsGenerated, setTeamsGenerated] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [photoChooserOpenFor, setPhotoChooserOpenFor] = useState<string | null>(null);

  // Extract unique categories from CSV data
  const availableCategories = useMemo(() => {
    return Array.from(new Set(questionsPool.map(q => q.category))).sort();
  }, [questionsPool]);

  // Funkcja losująca unikalny awatar
  const getRandomUniqueAvatar = (currentPlayers: Player[]): string | undefined => {
    // Pobierz listę już użytych nazw plików (zakładamy, że avatar to pełna ścieżka, więc wyciągamy nazwę)
    const usedAvatars = currentPlayers
      .map(p => p.avatar)
      .filter(Boolean)
      .map(url => url!.split('/').pop()); // Pobiera np. "avatar1.jpg" z "images/avatars/avatar1.jpg"

    // Filtrujemy dostępne pliki
    const available = AVATAR_FILES.filter(file => !usedAvatars.includes(file));

    if (available.length === 0) {
      return undefined; // Brak wolnych awatarów
    }

    // Losujemy indeks
    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedFile = available[randomIndex];

    return `${AVATARS_PATH}${selectedFile}`;
  };

  const addPlayer = () => {
    if (!newName.trim()) return;

    // Automatyczny przydział awatara
    const assignedAvatar = getRandomUniqueAvatar(players);

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newName,
      gender: newGender,
      avatar: assignedAvatar,
      score: 0,
      lifelinesUsed: []
    };
    setPlayers([...players, newPlayer]);
    
    // Reset inputs
    setNewName('');
    
    // Reset teams if players change
    setTeamsGenerated(false);
    setTeams([]);
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    setTeamsGenerated(false);
    setTeams([]);
  };

  const handleGenerateTeams = () => {
    if (players.length < teamCount) {
      alert("Liczba graczy musi być większa lub równa liczbie drużyn!");
      return;
    }
    const generated = generateBalancedTeams(players, teamCount);
    setTeams(generated);
    setTeamsGenerated(true);
  };

  // Manual team management helpers
  const createTeam = (name?: string) => {
    const id = `team_${Date.now()}`;
    setTeams(prev => [...prev, { id, name: name ?? `Drużyna ${prev.length + 1}`, members: [], score: 0, lifelinesUsed: [] }]);
    setTeamsGenerated(true);
  };

  const removeTeamById = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  const setTeamImage = (teamId: string, imagePath: string | null) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, image: imagePath ?? undefined } : t));
    setPhotoChooserOpenFor(null);
  };

  const getTeamIdOfPlayer = (playerId: string): string | null => {
    const t = teams.find(team => team.members.some(m => m.id === playerId));
    return t ? t.id : null;
  };

  const assignPlayerToTeam = (playerId: string, teamId: string | null) => {
    // remove from all teams first
    setTeams(prev => prev.map(t => ({ ...t, members: t.members.filter(m => m.id !== playerId) })));

    if (teamId) {
      const player = players.find(p => p.id === playerId);
      if (!player) return;
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, members: [...t.members, player] } : t));
      setTeamsGenerated(true);
    }
  };

  const handleTeamNameChange = (teamId: string, newName: string) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId ? { ...team, name: newName } : team
      )
    );
  };

  const handleStart = () => {
    if (players.length === 0) {
      alert("Dodaj przynajmniej jednego uczestnika.");
      return;
    }
    if (mode === 'TEAM' && teams.length === 0) {
      alert("Musisz wylosować lub utworzyć drużyny przed startem.");
      return;
    }
    if (mode === 'TEAM' && teams.some(t => !t.name.trim())) {
      alert("Wszystkie drużyny muszą mieć nazwę.");
      return;
    }
    if (questionsPool.length === 0) {
      alert("Brak pytań w pliku CSV!");
      return;
    }

    onStartGame(mode, players, teams, rounds, availableCategories);
  };

  const isDataEmpty = questionsPool.length === 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-surface rounded-xl shadow-2xl border border-white/10">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Konfiguracja Quizu
      </h1>

      {/* CSV Status Info */}
      <div className={`mb-6 p-3 rounded-lg flex items-center gap-3 ${isDataEmpty ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'bg-green-500/10 text-green-400 border border-green-500/30'}`}>
        <Database className="w-5 h-5" />
        {isDataEmpty ? (
          <span className="font-bold">Błąd: Brak pytań. Sprawdź plik pytania.csv!</span>
        ) : (
          <span>Załadowano <strong>{questionsPool.length}</strong> pytań (kategorie: {availableCategories.length}) z pliku <code>pytania.csv</code>.</span>
        )}
      </div>

      <div className="space-y-8">
        
        {/* 1. Tryb Gry */}
        <div className="bg-dark/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Tryb Gry
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setMode('INDIVIDUAL')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                mode === 'INDIVIDUAL' 
                ? 'border-primary bg-primary/20 text-white' 
                : 'border-white/10 hover:bg-white/5 text-gray-400'
              }`}
            >
              Indywidualny
            </button>
            <button
              onClick={() => setMode('TEAM')}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                mode === 'TEAM' 
                ? 'border-secondary bg-secondary/20 text-white' 
                : 'border-white/10 hover:bg-white/5 text-gray-400'
              }`}
            >
              Drużynowy
            </button>
          </div>
        </div>

        {/* 2. Dodawanie Uczestników */}
        <div className="bg-dark/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Uczestnicy
          </h2>
          <p className="text-xs text-gray-400 mb-2">Awatar zostanie przydzielony losowo po dodaniu.</p>
          
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Imię / Nick"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 bg-dark border border-white/20 rounded-md px-4 py-2 focus:outline-none focus:border-primary"
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              />
              
              <div className="flex items-center gap-2 bg-dark border border-white/20 rounded-md px-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={newGender === 'M'}
                    onChange={() => setNewGender('M')}
                    className="accent-blue-500"
                  />
                  <span className="text-sm">Mężczyzna</span>
                </label>
                <span className="text-white/20">|</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={newGender === 'F'}
                    onChange={() => setNewGender('F')}
                    className="accent-pink-500"
                  />
                  <span className="text-sm">Kobieta</span>
                </label>
              </div>

              <button
                onClick={addPlayer}
                className="bg-primary hover:bg-indigo-600 text-white px-8 py-2 rounded-md transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Wand2 className="w-4 h-4" /> Dodaj
              </button>
            </div>
          </div>

          {/* Lista graczy */}
          {players.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
              {players.map((p) => (
                <div key={p.id} className={`flex items-center justify-between p-3 rounded border-2 transition-all ${p.gender === 'M' ? 'bg-blue-500/20 border-blue-400 text-blue-100' : 'bg-red-500/20 border-red-400 text-red-100'}`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    {p.avatar ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        onClick={() => p.avatar && setSelectedAvatar(p.avatar)}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20 flex-shrink-0 cursor-pointer"
                        onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/black/white?text=?'}
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${p.gender === 'M' ? 'bg-blue-600' : 'bg-red-600'}`}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="truncate text-sm font-medium">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {mode === 'TEAM' && teams.length > 0 && (
                      <select
                        value={getTeamIdOfPlayer(p.id) ?? ''}
                        onChange={(e) => assignPlayerToTeam(p.id, e.target.value || null)}
                        className="bg-dark border border-white/10 text-sm rounded px-2 py-1 mr-2"
                      >
                        <option value="">Brak</option>
                        {teams.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    )}
                    <button onClick={() => removePlayer(p.id)} className={`${p.gender === 'M' ? 'text-blue-300 hover:text-blue-200' : 'text-red-300 hover:text-red-200'}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Konfiguracja Drużyn (Tylko w trybie Team) */}
        {mode === 'TEAM' && (
          <div className="bg-dark/50 p-4 rounded-lg border-l-4 border-secondary">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-secondary" /> Generator Drużyn
            </h2>
            <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-gray-300">Liczba drużyn:</label>
                <input 
                  type="number" 
                  min="2" 
                  max={Math.max(2, players.length)} 
                  value={teamCount}
                  onChange={(e) => setTeamCount(parseInt(e.target.value) || 2)}
                  className="w-20 bg-dark border border-white/20 rounded px-2 py-1 text-center"
                />
                <button 
                  onClick={handleGenerateTeams}
                  className="text-sm bg-secondary hover:bg-purple-600 px-4 py-2 rounded transition-colors"
                >
                  Wylosuj Drużyny
                </button>
                <button 
                  onClick={() => createTeam()}
                  className="text-sm bg-primary hover:bg-indigo-600 px-4 py-2 rounded transition-colors"
                >
                  Utwórz Drużynę
                </button>
                <button 
                  onClick={() => { setTeams([]); setTeamsGenerated(false); }}
                  className="text-sm bg-rose-600 hover:bg-rose-500 px-3 py-2 rounded transition-colors"
                >
                  Resetuj Drużyny
                </button>
            </div>

            {teamsGenerated && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white/5 p-3 rounded border border-white/10 relative group">
                    <div className="flex items-center gap-2 mb-2">
                      {team.image ? (
                        <img src={team.image} alt={team.name} className="w-12 h-12 rounded-md object-cover border border-white/10" onError={(e) => (e.currentTarget.src = TEAM_PHOTOS_PATH + TEAM_PHOTOS[0])} />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-white/5 flex items-center justify-center text-xs text-gray-300">Brak</div>
                      )}
                      <Edit2 className="w-4 h-4 text-gray-500" />
                      <input 
                        type="text"
                        value={team.name}
                        onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-secondary focus:outline-none font-bold text-secondary w-full transition-colors"
                      />
                      <button onClick={() => setPhotoChooserOpenFor(photoChooserOpenFor === team.id ? null : team.id)} className="text-sm text-sky-300 hover:text-sky-200 px-2">Wybierz zdjęcie</button>
                      <button onClick={() => removeTeamById(team.id)} className="text-sm text-rose-400 hover:text-rose-300 px-2">Usuń</button>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {team.members.map(m => (
                        <li key={m.id} className="flex items-center gap-2">
                           {m.avatar ? (
                             <img
                               src={m.avatar}
                               alt="av"
                               onClick={() => m.avatar && setSelectedAvatar(m.avatar)}
                               className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer"
                               onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/000/fff?text=?')}
                             />
                           ) : (
                             <span className={m.gender === 'M' ? 'text-blue-300' : 'text-red-300'}>•</span>
                           )}
                           <span className="flex-1">{m.name}</span>
                           <button onClick={() => assignPlayerToTeam(m.id, null)} className="text-xs text-rose-400 hover:text-rose-300 px-2">Usuń z drużyny</button>
                        </li>
                      ))}
                    </ul>
                    {photoChooserOpenFor === team.id && (
                      <div className="mt-3 grid grid-cols-6 gap-2">
                        {TEAM_PHOTOS.map((file) => (
                          <button key={file} onClick={() => setTeamImage(team.id, `${TEAM_PHOTOS_PATH}${file}`)} className="w-full p-0">
                            <img src={`${TEAM_PHOTOS_PATH}${file}`} alt={file} className="w-full h-20 object-cover rounded border border-white/10" onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x120/000/fff?text=?')} />
                          </button>
                        ))}
                        <button onClick={() => setTeamImage(team.id, null)} className="col-span-6 text-sm text-rose-400 mt-1">Usuń zdjęcie drużyny</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Rundy */}
        <div className="flex items-center justify-between bg-dark/50 p-4 rounded-lg">
            <span className="font-semibold">Liczba rund / segmentów:</span>
            <select 
              value={rounds} 
              onChange={(e) => setRounds(parseInt(e.target.value))}
              className="bg-dark border border-white/20 rounded px-4 py-2"
            >
              {Array.from({length: 20}, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={isDataEmpty}
          className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
            isDataEmpty 
            ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
            : 'bg-gradient-to-r from-primary to-secondary hover:brightness-110 hover:shadow-primary/25'
          }`}
        >
          {isDataEmpty ? <AlertCircle /> : <Play className="w-6 h-6 fill-current" />} 
          {isDataEmpty ? "Napraw plik CSV aby rozpocząć" : "Rozpocznij Quiz"}
        </button>
      </div>
      <AvatarModal src={selectedAvatar} onClose={() => setSelectedAvatar(null)} />
    </div>
  );
};
