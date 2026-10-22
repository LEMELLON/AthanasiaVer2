import React, { useState } from 'react';
import { GameCard, GameRoom, PlayerState } from '../../types/game';
import { Shuffle, Compass, Sparkles, AlertTriangle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface KapalaranModalProps {
  room: GameRoom;
  currentPlayer: PlayerState;
  onChooseOption: (choiceIndex: number) => void;
}

export const KapalaranModal: React.FC<KapalaranModalProps> = ({
  room,
  currentPlayer,
  onChooseOption,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const card = room.activeEventCard;
  const isMyTurn = room.players[room.currentTurnIndex]?.id === currentPlayer.id;

  if (!card) return null;

  const handleSelect = (idx: number) => {
    if (!isMyTurn) return;
    sounds.playClick();
    setSelectedIdx(idx);
    onChooseOption(idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-violet-500/70 rounded-3xl p-6 shadow-2xl shadow-violet-950/60 flex flex-col gap-4 text-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-400/50 flex items-center justify-center text-violet-300 shadow-lg">
            <Shuffle className="w-6 h-6" />
          </div>
          <span className="font-cinzel text-xs font-bold tracking-widest text-violet-400 uppercase">
            Kapalaran — Pagsubok ng Tadhana
          </span>
          <h2 className="font-cinzel text-lg font-bold text-violet-100">
            {card.title}
          </h2>
          <p className="text-xs text-slate-300 italic font-serif max-w-sm mt-0.5">
            "{card.flavorText}"
          </p>
        </div>

        {/* Narrative Dilemma Choices */}
        <div className="flex flex-col gap-3 mt-1 text-left">
          <span className="text-xs font-medium text-slate-300">
            Piliin ang iyong tatahakin (Bahala Na o Masinop na Pag-iingat):
          </span>

          {card.choices?.map((choice, idx) => {
            const isChosen = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={!isMyTurn || selectedIdx !== null}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 cursor-pointer ${
                  isChosen
                    ? 'border-violet-400 bg-violet-950/90 text-violet-100 shadow-xl ring-2 ring-violet-400'
                    : isMyTurn
                    ? 'border-slate-800 bg-slate-900/80 text-slate-200 hover:border-violet-500/60 hover:bg-violet-950/30'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-violet-400" />
                    <span>Pagpipilian {idx === 0 ? 'A' : 'B'}: {choice.label}</span>
                  </span>
                  {idx === 0 ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Gantimpala / Ingat
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Panganib / Bilis
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {choice.text}
                </p>
              </button>
            );
          })}
        </div>

        {!isMyTurn && (
          <div className="py-2 text-center text-xs text-violet-300 font-medium bg-violet-950/40 rounded-xl border border-violet-500/30">
            Kasalukuyang pumipili si {room.players[room.currentTurnIndex]?.name} sa kanyang Kapalaran...
          </div>
        )}
      </div>
    </div>
  );
};
