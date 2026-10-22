import React, { useEffect } from 'react';
import { GameRoom, PlayerState } from '../../types/game';
import confetti from 'canvas-confetti';
import { Crown, Sparkles, Skull, RotateCcw, Home } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface VictoryModalProps {
  room: GameRoom;
  currentPlayer: PlayerState;
  onRestartLobby: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  room,
  currentPlayer,
  onRestartLobby,
}) => {
  const isAninagWin = room.winner === 'aninag';

  useEffect(() => {
    sounds.playVictory();
    // Fire celebratory confetti bursts
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: isAninagWin ? ['#F59E0B', '#10B981', '#38BDF8'] : ['#EF4444', '#7C3AED', '#F97316'],
      });
    } catch {}
  }, [isAninagWin]);

  const winnerTitle = isAninagWin
    ? 'TAGUMPAY NG MGA ANINAG!'
    : 'TAGUMPAY NG IMPOSTOR!';

  const winnerSubtitle = isAninagWin
    ? 'Matagumpay na naibalik ang liwanag ng Diwa sa dambana ni Varyndor sa Aetherya!'
    : 'Naligaw at napigil ng Karimlan ang pagbabalik ng liwanag sa Aetherya!';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-center border-2 ${
        isAninagWin
          ? 'bg-gradient-to-b from-amber-950/80 via-slate-950 to-emerald-950/60 border-amber-400 shadow-amber-500/20'
          : 'bg-gradient-to-b from-rose-950/80 via-slate-950 to-purple-950/60 border-rose-500 shadow-rose-500/20'
      }`}>
        {/* Crown Icon */}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl ${
            isAninagWin 
              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-amber-500/50 animate-bounce' 
              : 'bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-rose-500/50 animate-pulse'
          }`}>
            <Crown className="w-8 h-8" />
          </div>
          <span className="font-cinzel text-xs font-bold tracking-widest uppercase text-amber-400">
            WAKAS NG LAKBAYIN
          </span>
          <h2 className="font-cinzel text-xl md:text-2xl font-black text-amber-100">
            {winnerTitle}
          </h2>
          <p className="text-xs text-slate-300 max-w-sm">
            {winnerSubtitle}
          </p>
        </div>

        {/* Player Roles & Curses Revealed */}
        <div className="flex flex-col gap-2 text-left">
          <span className="font-cinzel text-xs font-bold text-amber-400 uppercase tracking-wider">
            Pagbubunyag ng mga Lihim:
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {room.players.map((p) => {
              const isImp = p.role === 'impostor';
              return (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isImp 
                      ? 'border-rose-500/60 bg-rose-950/40 text-rose-200' 
                      : 'border-slate-800 bg-slate-900/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.id === currentPlayer.id && (
                          <span className="text-[10px] text-amber-400 font-mono">(Ikaw)</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-serif italic">
                        Sumpa: {p.sumpaCard?.title || 'Walang sumpa'}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md font-cinzel text-[10px] font-bold tracking-wider ${
                    isImp 
                      ? 'bg-rose-950 border border-rose-500 text-rose-300' 
                      : 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                  }`}>
                    {isImp ? 'IMPOSTOR' : 'ANINAG'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Return Button */}
        <button
          onClick={() => { sounds.playClick(); onRestartLobby(); }}
          className="w-full py-3 px-6 rounded-xl font-cinzel text-xs font-bold tracking-wider bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Home className="w-4 h-4" />
          <span>BUMALIK SA LOBBY / SILID</span>
        </button>
      </div>
    </div>
  );
};
