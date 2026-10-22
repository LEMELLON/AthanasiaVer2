import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, BookOpen, Settings, Copy, Check, LogOut, Flame, Droplets, Wind, Mountain, Crown } from 'lucide-react';
import { GameRoom, PlayerState, RealmType } from '../types/game';
import { sounds } from '../utils/audio';
import { getPlayerRealm } from '../utils/modularCardEngine';

interface NavbarProps {
  room: GameRoom | null;
  currentPlayer: PlayerState | null;
  onOpenRules: () => void;
  onOpenAdmin: () => void;
  onLeaveRoom: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  room,
  currentPlayer,
  onOpenRules,
  onOpenAdmin,
  onLeaveRoom,
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [copied, setCopied] = useState(false);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const copyRoomCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      sounds.playClick();
    }
  };

  const currentRealm: RealmType = currentPlayer ? getPlayerRealm(currentPlayer.currentTile) : 'talvaris';

  const realmMeta: Record<RealmType, { name: string; icon: React.ReactNode; color: string }> = {
    talvaris: { name: 'Talvaris (Lupa)', icon: <Mountain className="w-4 h-4 text-emerald-400" />, color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40' },
    alabarya: { name: 'Alabarya (Apoy)', icon: <Flame className="w-4 h-4 text-amber-500" />, color: 'border-amber-500/40 text-amber-300 bg-amber-950/40' },
    alonawon: { name: 'Alonawon (Tubig)', icon: <Droplets className="w-4 h-4 text-cyan-400" />, color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40' },
    himaraya: { name: 'Himaraya (Hangin)', icon: <Wind className="w-4 h-4 text-purple-400" />, color: 'border-purple-500/40 text-purple-300 bg-purple-950/40' },
    aetherya: { name: 'Aetherya (Sanctuary)', icon: <Crown className="w-4 h-4 text-yellow-400" />, color: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/40' },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-900/30 px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Brand Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-800 to-slate-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-950/50">
          <span className="font-cinzel text-lg font-bold text-amber-200">ᜇ</span>
        </div>
        <div>
          <h1 className="font-cinzel text-base md:text-lg font-bold tracking-wider text-amber-100 flex items-center gap-2">
            ATHANASIA
            <span className="text-xs font-normal text-amber-400/80 tracking-widest hidden sm:inline">ANG HIWAGA NG DIWA</span>
          </h1>
        </div>
      </div>

      {/* Mid Status Strip */}
      {room && (
        <div className="hidden md:flex items-center gap-3">
          {/* Room Code Badge */}
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
            title="Kopyahin ang Room Code"
          >
            <span className="text-slate-400">Silid:</span>
            <span className="font-mono font-bold tracking-wider text-amber-300">{room.code}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Current Realm Indicator */}
          {room.status === 'playing' && currentPlayer && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium ${realmMeta[currentRealm].color}`}>
              {realmMeta[currentRealm].icon}
              <span>{realmMeta[currentRealm].name}</span>
              <span className="text-slate-400 text-[11px] font-mono">· Tile {currentPlayer.currentTile}/50</span>
            </div>
          )}

          {/* Secret Role Badge (Only for current player) */}
          {room.status === 'playing' && currentPlayer && (
            <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${
              currentPlayer.role === 'impostor' 
                ? 'bg-rose-950/50 border-rose-600/50 text-rose-300 animate-pulse' 
                : 'bg-emerald-950/50 border-emerald-600/50 text-emerald-300'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{currentPlayer.role === 'impostor' ? 'IMPOSTOR (Lihim)' : 'ANINAG (Pilgrim)'}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions & Utilities */}
      <div className="flex items-center gap-2">
        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
          title={isMuted ? 'I-unmute ang Tunog' : 'I-mute ang Tunog'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Rules Button */}
        <button
          onClick={() => { sounds.playClick(); onOpenRules(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Gabay / Alituntunin</span>
        </button>

        {/* Admin Button */}
        <button
          onClick={() => { sounds.playClick(); onOpenAdmin(); }}
          className="p-2 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-300 hover:bg-amber-900/50 hover:border-amber-500 transition-colors"
          title="Admin Suite (System Settings & Card Builder)"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Leave Room Button */}
        {room && (
          <button
            onClick={() => { sounds.playClick(); onLeaveRoom(); }}
            className="p-2 rounded-lg bg-rose-950/30 border border-rose-800/40 text-rose-300 hover:bg-rose-900/50 hover:border-rose-500 transition-colors"
            title="Umalis sa Silid"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
