import React, { useState, useEffect } from 'react';
import { GameCard, GameRoom, PlayerState } from '../../types/game';
import { HelpCircle, Clock, CheckCircle, XCircle, Sparkles, Send } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PagsubokModalProps {
  room: GameRoom;
  currentPlayer: PlayerState;
  onSubmitAnswer: (answer: string) => void;
}

export const PagsubokModal: React.FC<PagsubokModalProps> = ({
  room,
  currentPlayer,
  onSubmitAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(15);

  const card = room.activeEventCard;
  const isMyTurn = room.players[room.currentTurnIndex]?.id === currentPlayer.id;

  // 15-second countdown timer for active player
  useEffect(() => {
    if (!isMyTurn || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Timeout counts as incorrect submit
          onSubmitAnswer(selectedOption || customText || 'Time expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMyTurn, timeLeft, selectedOption, customText, onSubmitAnswer]);

  if (!card) return null;

  const handleSelect = (opt: string) => {
    sounds.playClick();
    setSelectedOption(opt);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalAns = selectedOption || customText.trim();
    if (!finalAns) return;
    sounds.playClick();
    onSubmitAnswer(finalAns);
  };

  const categoryNames: Record<string, string> = {
    bugtong: 'Tradisyunal na Bugtong',
    sagisag: 'Pambansang Sagisag ng Pilipinas',
    kasabihan: 'Kasabihan & Salawikain',
    speed_trivia: 'Mabilisang Pagsubok sa 5 Segundo',
    tongue_twister: 'Pabilisan ng Dila (Tongue Twister)',
    idiom: 'Sawikain & Salitang Matalinghaga',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/70 rounded-3xl p-6 shadow-2xl shadow-amber-950/60 flex flex-col gap-4 text-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
            <HelpCircle className="w-6 h-6" />
          </div>
          <span className="font-cinzel text-xs font-bold tracking-widest text-amber-400 uppercase">
            {categoryNames[card.category || 'bugtong'] || 'Pagsubok sa Daan'}
          </span>
          <h2 className="font-cinzel text-lg font-bold text-amber-100">
            {card.title}
          </h2>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center justify-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border ${
            timeLeft <= 5 
              ? 'bg-rose-950/60 border-rose-500/60 text-rose-300 animate-bounce' 
              : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Natitirang Oras: {timeLeft}s</span>
          </div>
        </div>

        {/* Question Card Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-left shadow-inner">
          <p className="text-base font-semibold text-amber-100 font-serif">
            "{card.question}"
          </p>
          <div className="text-[11px] text-slate-400 mt-2">
            Gantimpala sa Tamang Sagot: 1 Biyaya card · Parusa sa Mali: Mawawalan ng 1 tira.
          </div>
        </div>

        {/* Choices Options / Text Input */}
        {isMyTurn ? (
          <div className="flex flex-col gap-2">
            {card.options && card.options.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {card.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(opt)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/80 text-amber-200 shadow-md ring-1 ring-amber-400'
                          : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-amber-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="I-type ang iyong sagot..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
                />
              </form>
            )}

            <button
              onClick={() => handleSubmit()}
              disabled={!selectedOption && !customText.trim()}
              className={`mt-2 py-2.5 px-4 rounded-xl font-cinzel text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                selectedOption || customText.trim()
                  ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 hover:brightness-110 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>IPASA ANG SAGOT</span>
            </button>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-amber-300 font-medium bg-amber-950/40 rounded-xl border border-amber-500/30">
            Kasalukuyang sinasagutan ni {room.players[room.currentTurnIndex]?.name} ang Pagsubok...
          </div>
        )}
      </div>
    </div>
  );
};
