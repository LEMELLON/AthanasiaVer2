import React, { useState } from 'react';
import { Dices, Sparkles, AlertCircle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface DiceRollerProps {
  isCurrentPlayerTurn: boolean;
  canRoll: boolean;
  lastRoll?: number;
  onRoll: () => void;
  halveNextRoll?: boolean;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  isCurrentPlayerTurn,
  canRoll,
  lastRoll,
  onRoll,
  halveNextRoll,
}) => {
  const [rolling, setRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState<number>(lastRoll || 1);

  const handleRollClick = () => {
    if (!isCurrentPlayerTurn || !canRoll || rolling) return;

    setRolling(true);
    sounds.playDiceRoll();

    // Jiggle/cycle random numbers for 600ms
    const interval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      setRolling(false);
      onRoll();
    }, 650);
  };

  // Dice dot positions mapping
  const renderDiceDots = (val: number) => {
    const dotConfigs: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    const activeDots = dotConfigs[val] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-10 h-10 p-1.5 gap-1 bg-amber-950/80 border border-amber-500/50 rounded-xl shadow-inner">
        {[...Array(9)].map((_, idx) => (
          <div key={idx} className="flex items-center justify-center">
            {activeDots.includes(idx) && (
              <span className="w-2 h-2 rounded-full bg-amber-300 shadow-sm shadow-amber-400/80 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-amber-900/40 backdrop-blur-md shadow-xl">
      <div className="flex items-center gap-3">
        {/* Dice Visual */}
        <div className={`transition-transform duration-300 ${rolling ? 'animate-bounce rotate-12 scale-110' : ''}`}>
          {renderDiceDots(displayValue)}
        </div>

        {/* Dice Info */}
        <div className="text-left">
          <div className="text-[11px] uppercase tracking-wider text-amber-400/80 font-cinzel font-semibold">
            Banol na Dice
          </div>
          <div className="font-mono text-xs text-slate-300">
            {rolling ? 'Gumugulong...' : lastRoll ? `Resulta: ${lastRoll}` : 'Handa nang gumulong'}
          </div>
        </div>
      </div>

      {halveNextRoll && (
        <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
          <AlertCircle className="w-3 h-3" />
          <span>Kalahati ang epekto ng susunod na roll!</span>
        </div>
      )}

      {/* Roll Action Button */}
      <button
        onClick={handleRollClick}
        disabled={!isCurrentPlayerTurn || !canRoll || rolling}
        className={`w-full py-2 px-4 rounded-xl font-cinzel text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
          isCurrentPlayerTurn && canRoll && !rolling
            ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 hover:brightness-110 active:scale-95 shadow-amber-900/50 cursor-pointer animate-pulse-glow'
            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
        }`}
      >
        <Dices className="w-4 h-4" />
        <span>{rolling ? 'GUMUGULONG...' : isCurrentPlayerTurn && canRoll ? 'GUMULONG NG DICE' : 'HINDI MO TIRA'}</span>
        {isCurrentPlayerTurn && canRoll && !rolling && <Sparkles className="w-3.5 h-3.5 text-slate-950" />}
      </button>
    </div>
  );
};
