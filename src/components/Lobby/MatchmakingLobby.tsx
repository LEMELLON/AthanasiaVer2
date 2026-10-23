import React, { useState, useEffect } from 'react';
import { GameRoom, PilgrimProfile } from '../../types/game';
import { loadPilgrimProfile } from '../../utils/cookie';
import { 
  Play, 
  Plus, 
  Users, 
  Bot, 
  Sparkles, 
  Shield, 
  Compass, 
  BookOpen, 
  Settings, 
  RefreshCw, 
  User, 
  Map as MapIcon,
  Crown,
  Lock,
  Layers,
  Edit3
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../utils/i18n';

interface MatchmakingLobbyProps {
  onJoinRoom: (roomCode: string, playerName: string, avatarUrl: string) => void;
  onCreateRoom: (
    roomName: string,
    hostName: string,
    avatarUrl: string,
    maxPlayers: number,
    fillWithBots: boolean,
    mapId?: string,
    customMap?: any
  ) => void;
  onOpenRules: () => void;
  onOpenAdmin: () => void;
  onOpenProfile: () => void;
  onOpenMapEditor: () => void;
}

export const MatchmakingLobby: React.FC<MatchmakingLobbyProps> = ({
  onJoinRoom,
  onCreateRoom,
  onOpenRules,
  onOpenAdmin,
  onOpenProfile,
  onOpenMapEditor,
}) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<PilgrimProfile>(() => loadPilgrimProfile());
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [customRoomName, setCustomRoomName] = useState('Dambana ng Diwa');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [fillWithBots, setFillWithBots] = useState(true);
  const [selectedMapId, setSelectedMapId] = useState<string>('map_canonical_diwa_50');
  const [availableMaps, setAvailableMaps] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'quick' | 'create' | 'join'>('quick');
  const [publicRooms, setPublicRooms] = useState<{ code: string; name: string; playerCount: number; maxPlayers: number; status: string }[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Sync profile when localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      setProfile(loadPilgrimProfile());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchMaps = async () => {
    try {
      let combinedMaps: any[] = [];
      const res = await fetch('/api/maps');
      if (res.ok) {
        combinedMaps = await res.json();
      }
      const localCustom = localStorage.getItem('athanasia_active_custom_map');
      if (localCustom) {
        try {
          const parsed = JSON.parse(localCustom);
          if (parsed && parsed.id && !combinedMaps.some(m => m.id === parsed.id)) {
            combinedMaps.unshift({
              id: parsed.id,
              name: parsed.name,
              description: parsed.description,
              author: parsed.author,
              totalTiles: parsed.tiles?.length || 50,
              gatesCount: parsed.tiles?.filter((t: any) => t.type === 'pintuan').length || 4,
              pagsubokCount: parsed.tiles?.filter((t: any) => t.type === 'pagsubok').length || 12,
              kapalaranCount: parsed.tiles?.filter((t: any) => t.type === 'kapalaran').length || 10,
              fullData: parsed,
            });
          }
        } catch {}
      }
      setAvailableMaps(combinedMaps);
      if (combinedMaps.length > 0 && !selectedMapId) {
        setSelectedMapId(combinedMaps[0].id);
      }
    } catch {}
  };

  const getSelectedCustomMap = (mapId: string) => {
    const found = availableMaps.find(m => m.id === mapId);
    if (found?.fullData) return found.fullData;
    const local = localStorage.getItem('athanasia_active_custom_map');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.id === mapId) return parsed;
      } catch {}
    }
    return undefined;
  };

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        setPublicRooms(data);
      }
    } catch {}
    setLoadingRooms(false);
  };

  useEffect(() => {
    fetchMaps();
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickPlaySolo = () => {
    sounds.playClick();
    const customMap = getSelectedCustomMap(selectedMapId);
    onCreateRoom(`${profile.playerName}'s Sanctuary`, profile.playerName, profile.avatarUrl, 4, true, selectedMapId, customMap);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const customMap = getSelectedCustomMap(selectedMapId);
    onCreateRoom(customRoomName, profile.playerName, profile.avatarUrl, maxPlayers, fillWithBots, selectedMapId, customMap);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    sounds.playClick();
    onJoinRoom(joinCodeInput.trim().toUpperCase(), profile.playerName, profile.avatarUrl);
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4">
      {/* Background Atmosphere Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Hero Title Section */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-semibold mb-2 animate-float-glow">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Mitolohiyang Pilipino · Dark-Fantasy Tactical Board & Card Adventure</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-md">
          ATHANASIA
        </h1>
        <div className="font-cinzel text-xs sm:text-sm font-bold tracking-widest text-amber-400/90 mt-0.5 uppercase">
          Ang Hiwaga ng Diwa
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-serif italic">
          "Sa Likod ng Bawat Anino, May Lihim na Nakatago."
        </p>
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col gap-4">
        {/* Pilgrim Identity Banner with Quick Edit Trigger */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer" onClick={onOpenProfile}>
              <img
                src={profile.avatarUrl}
                alt={profile.playerName}
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-md shadow-amber-500/30"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                <Edit3 className="w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-sm text-amber-100">
                  {profile.playerName}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  {profile.characterName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-serif italic mt-0.5">
                {t.profileSaved}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-cinzel font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.profile}</span>
            </button>
            <button
              onClick={onOpenMapEditor}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-cinzel font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title={t.mapEditor}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.mapEditor}</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-cinzel font-bold">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('quick'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'quick' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Solo / AI Bots
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('create'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.createRoom}
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('join'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'join' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.joinRoom}
          </button>
        </div>

        {/* TAB 1: QUICK PLAY SOLO WITH AI BOTS */}
        {activeTab === 'quick' && (
          <div className="flex flex-col gap-3 py-1">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-900/30 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-amber-300 font-cinzel flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Solo Pilgrimage with 3 AI Companions</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Immediately embark on a full pilgrimage match using the 50-space Diwa Sanctuary serpentine board with automated AI companions!
              </p>
            </div>

            <button
              onClick={handleQuickPlaySolo}
              className="w-full py-3 rounded-2xl font-cinzel text-xs font-black tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>EMBARK (SOLO / AI BOTS)</span>
            </button>
          </div>
        )}

        {/* TAB 2: CREATE CUSTOM ROOM WITH MAP SELECTION */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3 py-1 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 font-medium">{t.roomName}:</label>
              <input
                type="text"
                value={customRoomName}
                onChange={(e) => setCustomRoomName(e.target.value)}
                maxLength={30}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 mt-1 outline-none focus:border-amber-500 font-medium"
              />
            </div>

            {/* MAP SELECTION PICKER */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-cinzel font-bold text-amber-300 flex items-center gap-1.5">
                  <MapIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.selectMap}:</span>
                </label>
                <button
                  type="button"
                  onClick={onOpenMapEditor}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{t.mapEditor}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {availableMaps.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setSelectedMapId(m.id); sounds.playClick(); }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      selectedMapId === m.id
                        ? 'border-amber-400 bg-amber-950/40 ring-1 ring-amber-400/60 shadow-md'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-cinzel font-bold text-xs text-amber-200 truncate">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {m.description || 'Philippine mythology map layout'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 mt-1.5">
                      <span>{m.totalTiles || 50} Tiles</span>
                      <span>·</span>
                      <span>{m.gatesCount || 4} Gates</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">{t.maxPlayers}:</label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 mt-1 outline-none"
                >
                  <option value={2}>2 Pilgrims</option>
                  <option value={3}>3 Pilgrims</option>
                  <option value={4}>4 Pilgrims (Recommended)</option>
                  <option value={5}>5 Pilgrims</option>
                  <option value={6}>6 Pilgrims (Max)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={fillWithBots}
                    onChange={(e) => setFillWithBots(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-[11px]">{t.fillWithBots}</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 w-full py-3 rounded-2xl font-cinzel text-xs font-black tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createButton}</span>
            </button>
          </form>
        )}

        {/* TAB 3: JOIN BY CODE OR BROWSE PUBLIC ROOMS */}
        {activeTab === 'join' && (
          <div className="flex flex-col gap-3 py-1 text-xs">
            {/* Join Form */}
            <form onSubmit={handleJoinSubmit} className="flex gap-2">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder={t.enterRoomCode}
                maxLength={6}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 uppercase font-mono tracking-wider outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!joinCodeInput.trim()}
                className={`px-4 py-2 rounded-xl font-cinzel text-xs font-bold transition-all ${
                  joinCodeInput.trim()
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-md'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {t.joinButton}
              </button>
            </form>

            {/* Public Rooms List */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mt-1">
              <span>{t.publicSanctuaries} ({publicRooms.length}):</span>
              <button
                onClick={() => { sounds.playClick(); fetchRooms(); }}
                className="hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loadingRooms ? 'animate-spin' : ''}`} />
                <span>{t.refreshList}</span>
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 pr-1">
              {publicRooms.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-slate-500 text-xs">
                  {t.noRoomsFound}
                </div>
              ) : (
                publicRooms.map((r) => (
                  <div
                    key={r.code}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span>{r.name}</span>
                        <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 border border-slate-700">
                          {r.code}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{r.playerCount} / {r.maxPlayers} {t.pilgrimsTab}</span>
                        <span>·</span>
                        <span className={r.status === 'lobby' ? 'text-emerald-400' : 'text-amber-400'}>
                          {r.status === 'lobby' ? 'Waiting in Lobby' : 'Match in Progress'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onJoinRoom(r.code, profile.playerName, profile.avatarUrl)}
                      disabled={r.status !== 'lobby'}
                      className={`px-3 py-1.5 rounded-lg font-cinzel text-xs font-semibold ${
                        r.status === 'lobby'
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-sm'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {r.status === 'lobby' ? t.joinButton : 'Playing'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="relative z-10 flex items-center gap-4 mt-6 text-xs text-slate-400 font-medium">
        <button onClick={onOpenRules} className="hover:text-amber-300 flex items-center gap-1.5 cursor-pointer">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>{t.rules}</span>
        </button>
        <span>·</span>
        <button onClick={onOpenMapEditor} className="hover:text-amber-300 flex items-center gap-1.5 cursor-pointer">
          <Compass className="w-4 h-4 text-amber-500" />
          <span>{t.mapEditor}</span>
        </button>
        <span>·</span>
        <button onClick={onOpenAdmin} className="hover:text-amber-300 flex items-center gap-1.5 cursor-pointer">
          <Settings className="w-4 h-4 text-amber-500" />
          <span>{t.admin}</span>
        </button>
      </div>
    </div>
  );
};
