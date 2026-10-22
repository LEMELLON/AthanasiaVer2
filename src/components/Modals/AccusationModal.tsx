import React, { useState } from 'react';
import { GameRoom, PlayerState } from '../../types/game';
import { AlertTriangle, Skull, ShieldCheck, XCircle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface AccusationModalProps {
  room: GameRoom;
  currentPlayer: PlayerState;
  onAccuse: (targetPlayerId: string) => void;
  onClose: () => void;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  room,
  currentPlayer,
  onAccuse,
  onClose,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');

  const candidates = room.players.filter(p => p.id !== currentPlayer.id && !p.isEliminated);

  const handleSubmit = () => {
    if (!selectedTargetId) return;
    sounds.playAccusationDrama();
    onAccuse(selectedTargetId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-gradient-to-b from-rose-950/90 via-slate-950 to-slate-900 border-2 border-rose-600 rounded-3xl p-6 shadow-2xl shadow-rose-950/80 flex flex-col gap-4 text-center">
        {/* Header Warning */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-900/60 border border-rose-500 flex items-center justify-center text-rose-300 shadow-lg animate-bounce">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <span className="font-cinzel text-xs font-bold tracking-widest text-rose-400 uppercase">
            Hulaan ang Impostor
          </span>
          <h2 className="font-cinzel text-lg font-bold text-rose-100">
            Sino ang Taksil sa Hanay?
          </h2>
          <p className="text-xs text-rose-200/80 max-w-sm">
            Isang beses mo lamang ito magagamit sa buong laro! Tiyaking handa ka sa magiging kapalit:
          </p>
        </div>

        {/* Stakes Warning Box */}
        <div className="grid grid-cols-2 gap-2 text-left text-[11px] p-3 rounded-xl bg-slate-900/90 border border-rose-900/60">
          <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
            <div className="font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KAPAG TAMA:</span>
            </div>
            <p className="mt-1">Awtomatikong diretso sa Aetherya, may 1 reward card, at matatanggal ang Impostor.</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200">
            <div className="font-bold text-rose-400 flex items-center gap-1">
              <Skull className="w-3.5 h-3.5" />
              <span>KAPAG MALI:</span>
            </div>
            <p className="mt-1">Babalik ka sa Tile 0 (Start) at mawawalan ng tira sa susunod na 1 buong round!</p>
          </div>
        </div>

        {/* Suspect Candidate Selection */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-medium text-slate-300">
            Piliin ang manlalaro na aakusahan:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {candidates.map((p) => {
              const isSelected = selectedTargetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => { sounds.playClick(); setSelectedTargetId(p.id); }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-950 text-rose-100 shadow-md ring-2 ring-rose-500'
                      : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-rose-900'
                  }`}
                >
                  <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                  <span className="text-xs font-semibold truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-cinzel text-xs font-semibold cursor-pointer"
          >
            Huwag Muna (Kanselahin)
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedTargetId}
            className={`flex-1 py-2 rounded-xl font-cinzel text-xs font-bold tracking-wider transition-all ${
              selectedTargetId
                ? 'bg-gradient-to-r from-rose-600 to-rose-800 text-white hover:brightness-110 shadow-lg shadow-rose-950/60 cursor-pointer animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            IPATUPAD ANG PARATANG!
          </button>
        </div>
      </div>
    </div>
  );
};
