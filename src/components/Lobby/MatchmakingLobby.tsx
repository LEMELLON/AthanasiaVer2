import React, { useState, useEffect } from 'react';
import { DEFAULT_CHARACTER_AVATARS } from '../../data/canonicalCards';
import { Play, Plus, Bot, Sparkles, BookOpen, Settings, RefreshCw } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

interface MatchmakingLobbyProps {
  onJoinRoom: (roomCode: string, playerName: string, avatarUrl: string) => void;
  onCreateRoom: (roomName: string, hostName: string, avatarUrl: string, maxPlayers: number, fillWithBots: boolean) => void;
  onOpenRules: () => void;
  onOpenAdmin: () => void;
}

export const MatchmakingLobby: React.FC<MatchmakingLobbyProps> = ({
  onJoinRoom,
  onCreateRoom,
  onOpenRules,
  onOpenAdmin,
}) => {
  const { t, language } = useLanguage();
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('athanasia_player_name') || 'Aninag Bayani');
  const [selectedAvatar, setSelectedAvatar] = useState(() => DEFAULT_CHARACTER_AVATARS[0].url);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [customRoomName, setCustomRoomName] = useState(() => language === 'tl' ? 'Dambana ng Diwa' : 'Sanctuary of Diwa');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [fillWithBots, setFillWithBots] = useState(true);
  const [activeTab, setActiveTab] = useState<'quick' | 'create' | 'join'>('quick');
  const [publicRooms, setPublicRooms] = useState<{ code: string; name: string; playerCount: number; maxPlayers: number; status: string }[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    localStorage.setItem('athanasia_player_name', playerName);
  }, [playerName]);

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
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickPlaySolo = () => {
    sounds.playClick();
    onCreateRoom(`${playerName}'s Sanctuary`, playerName, selectedAvatar, 4, true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    onCreateRoom(customRoomName, playerName, selectedAvatar, maxPlayers, fillWithBots);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    sounds.playClick();
    onJoinRoom(joinCodeInput.trim().toUpperCase(), playerName, selectedAvatar);
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4">
      {/* Background Atmosphere Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Hero Title Section */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-cinzel font-semibold mb-3 animate-float-glow">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.mythTag}</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-md">
          {t.appName}
        </h1>
        <div className="font-cinzel text-sm sm:text-base font-bold tracking-widest text-amber-400/90 mt-1 uppercase">
          {t.appSubtitle}
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 font-serif italic">
          {t.motto}
        </p>
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col gap-5">
        {/* Profile / Avatar Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-amber-300 font-cinzel flex items-center justify-between">
            <span>{t.pilgrimNameLabel}</span>
            <span className="text-[11px] text-slate-400 font-sans font-normal">{t.pilgrimNameSub}</span>
          </label>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={t.pilgrimNamePlaceholder}
            maxLength={20}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 outline-none focus:border-amber-500 font-medium"
          />

          {/* Avatars Carousel */}
          <div className="grid grid-cols-6 gap-2 mt-1">
            {DEFAULT_CHARACTER_AVATARS.map((av) => {
              const isSelected = selectedAvatar === av.url;
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => { sounds.playClick(); setSelectedAvatar(av.url); }}
                  className={`group relative rounded-xl p-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-amber-400 bg-amber-950/60 shadow-md ring-2 ring-amber-400 scale-105'
                      : 'border border-slate-800 bg-slate-950/80 hover:border-slate-600'
                  }`}
                  title={av.name}
                >
                  <img src={av.url} alt={av.name} className="w-full aspect-square rounded-lg object-cover" />
                  <span className="text-[9px] text-slate-300 truncate block text-center mt-1">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
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
            {t.tabSolo}
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('create'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabCreate}
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('join'); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'join' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.tabJoin}
          </button>
        </div>

        {/* TAB 1: QUICK PLAY SOLO WITH AI BOTS */}
        {activeTab === 'quick' && (
          <div className="flex flex-col gap-3 py-1">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-amber-900/30 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-amber-300 font-cinzel flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>{t.quickSoloTitle}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {t.quickSoloDesc}
              </p>
            </div>

            <button
              onClick={handleQuickPlaySolo}
              className="w-full py-3 rounded-2xl font-cinzel text-xs font-black tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t.quickSoloBtn}</span>
            </button>
          </div>
        )}

        {/* TAB 2: CREATE CUSTOM ROOM */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3 py-1 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 font-medium">{t.roomNameLabel}</label>
              <input
                type="text"
                value={customRoomName}
                onChange={(e) => setCustomRoomName(e.target.value)}
                maxLength={30}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 mt-1 outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">{t.totalPlayersLabel}</label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 mt-1 outline-none"
                >
                  <option value={2}>2 {language === 'tl' ? 'Manlalaro' : 'Players'}</option>
                  <option value={3}>3 {language === 'tl' ? 'Manlalaro' : 'Players'}</option>
                  <option value={4}>4 {language === 'tl' ? 'Manlalaro (Recommended)' : 'Players (Recommended)'}</option>
                  <option value={5}>5 {language === 'tl' ? 'Manlalaro' : 'Players'}</option>
                  <option value={6}>6 {language === 'tl' ? 'Manlalaro (Max)' : 'Players (Max)'}</option>
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
                  <span className="text-[11px]">{t.fillBotsLabel}</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 rounded-2xl font-cinzel text-xs font-black tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createRoomBtn}</span>
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
                placeholder={t.joinCodePlaceholder}
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
                {t.joinBtn}
              </button>
            </form>

            {/* Public Rooms List */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>{t.openRoomsLabel}</span>
              <button onClick={fetchRooms} className="flex items-center gap-1 hover:text-amber-400 cursor-pointer">
                <RefreshCw className={`w-3 h-3 ${loadingRooms ? 'animate-spin' : ''}`} />
                <span>{t.refreshBtn}</span>
              </button>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {publicRooms.length === 0 ? (
                <div className="py-4 text-center text-slate-500 text-[11px]">
                  {t.noOpenRooms}
                </div>
              ) : (
                publicRooms.map((r) => (
                  <div
                    key={r.code}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{r.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Code: {r.code} · {r.playerCount}/{r.maxPlayers} {language === 'tl' ? 'Manlalaro' : 'Players'}
                      </div>
                    </div>
                    <button
                      onClick={() => onJoinRoom(r.code, playerName, selectedAvatar)}
                      disabled={r.status !== 'lobby' || r.playerCount >= r.maxPlayers}
                      className={`px-3 py-1 rounded-lg font-cinzel text-[11px] font-bold ${
                        r.status === 'lobby' && r.playerCount < r.maxPlayers
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {r.status === 'lobby' ? t.joinBtn : t.statusPlaying}
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
          <span>{t.rulesLink}</span>
        </button>
        <span>·</span>
        <button onClick={onOpenAdmin} className="hover:text-amber-300 flex items-center gap-1.5 cursor-pointer">
          <Settings className="w-4 h-4 text-amber-500" />
          <span>{t.adminLink}</span>
        </button>
      </div>
    </div>
  );
};
