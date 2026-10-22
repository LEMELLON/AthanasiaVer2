import React, { useState } from 'react';
import { GameCard, GameRoom, PlayerState } from '../../types/game';
import { Shield, Sparkles, Skull, Eye, EyeOff, UserCheck, Play, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface HandDrawerProps {
  room: GameRoom;
  currentPlayer: PlayerState;
  onPlayCard: (cardId: string, targetPlayerId?: string) => void;
  onEndTurn: () => void;
  onOpenAccusation: () => void;
}

export const HandDrawer: React.FC<HandDrawerProps> = ({
  room,
  currentPlayer,
  onPlayCard,
  onEndTurn,
  onOpenAccusation,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);
  const [showRole, setShowRole] = useState(false);
  const [showSumpa, setShowSumpa] = useState(false);
  const [targetPlayerId, setTargetPlayerId] = useState<string>('');

  const isMyTurn = room.players[room.currentTurnIndex]?.id === currentPlayer.id;
  const canPlayCards = isMyTurn && room.status === 'playing' && (room.turnPhase === 'action' || room.turnPhase === 'roll');

  const otherPlayers = room.players.filter(p => p.id !== currentPlayer.id && !p.isEliminated);

  const handleCardClick = (card: GameCard) => {
    sounds.playCardFlip();
    if (selectedCard?.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
      // Auto select first target if applicable
      if (otherPlayers.length > 0 && !targetPlayerId) {
        setTargetPlayerId(otherPlayers[0].id);
      }
    }
  };

  const handleExecutePlay = () => {
    if (!selectedCard) return;
    sounds.playClick();
    onPlayCard(selectedCard.id, targetPlayerId || undefined);
    setSelectedCard(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center pointer-events-none">
      {/* Drawer Toggle Handle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto px-4 py-1 rounded-t-xl bg-slate-900/90 border-t border-x border-amber-500/40 text-xs font-cinzel text-amber-300 hover:text-white flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer"
      >
        <span>Mga Baraha at Agimat ({currentPlayer.hand?.length || 0})</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Drawer Container */}
      {isOpen && (
        <div className="pointer-events-auto w-full max-w-5xl bg-slate-950/95 border-t border-amber-900/50 backdrop-blur-lg px-4 py-3 shadow-2xl flex flex-col gap-3">
          {/* Action Header & Secrets Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
            {/* Secret Cards Peeking Buttons */}
            <div className="flex items-center gap-2">
              {/* Role Card Peek */}
              <button
                onClick={() => { sounds.playClick(); setShowRole(!showRole); }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                  currentPlayer.role === 'impostor'
                    ? 'border-rose-600/60 bg-rose-950/40 text-rose-300'
                    : 'border-emerald-600/60 bg-emerald-950/40 text-emerald-300'
                }`}
              >
                {showRole ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>Gampanin: {showRole ? currentPlayer.role.toUpperCase() : 'Silipin'}</span>
              </button>

              {/* Sumpa Card Peek */}
              {currentPlayer.sumpaCard && (
                <button
                  onClick={() => { sounds.playClick(); setShowSumpa(!showSumpa); }}
                  className="px-3 py-1.5 rounded-lg border border-purple-600/60 bg-purple-950/40 text-purple-300 flex items-center gap-1.5 font-medium hover:bg-purple-900/50 transition-colors cursor-pointer"
                >
                  <Skull className="w-3.5 h-3.5 text-purple-400" />
                  <span>Sumpa: {showSumpa ? currentPlayer.sumpaCard.title : 'Silipin'}</span>
                </button>
              )}

              {/* Shield Status */}
              {currentPlayer.hasShield && (
                <div className="px-2.5 py-1 rounded-lg border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 flex items-center gap-1 text-[11px] font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>May Kalasag (Anting-Anting)</span>
                </div>
              )}
            </div>

            {/* Turn Controls & Impostor Accusation */}
            <div className="flex items-center gap-2">
              {/* Accusation Button */}
              {!currentPlayer.hasUsedAccusation && (
                <button
                  onClick={() => { sounds.playAccusationDrama(); onOpenAccusation(); }}
                  className="px-3 py-1.5 rounded-lg border border-rose-500/70 bg-gradient-to-r from-rose-950 to-rose-900 text-rose-200 text-xs font-cinzel font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-rose-950/60 cursor-pointer"
                  title="Isang beses lamang magagamit sa buong laro!"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hulaan ang Impostor</span>
                </button>
              )}

              {/* End Turn Button */}
              {isMyTurn && room.status === 'playing' && (
                <button
                  onClick={() => { sounds.playClick(); onEndTurn(); }}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 hover:bg-slate-700 hover:text-white font-cinzel text-xs font-semibold cursor-pointer"
                >
                  Tapusin ang Tira ➔
                </button>
              )}
            </div>
          </div>

          {/* Sumpa / Role Revealed Banner */}
          {showSumpa && currentPlayer.sumpaCard && (
            <div className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-xs text-purple-200 flex items-center justify-between gap-4">
              <div>
                <span className="font-cinzel font-bold text-purple-300 mr-2">{currentPlayer.sumpaCard.title}:</span>
                <span className="italic font-serif">"{currentPlayer.sumpaCard.hint}"</span>
                <p className="text-[11px] text-purple-300/80 mt-0.5">{currentPlayer.sumpaCard.flavorText}</p>
              </div>
              <button onClick={() => setShowSumpa(false)} className="text-purple-400 hover:text-white text-[11px] px-2 py-0.5 rounded bg-purple-900/60">
                Itago
              </button>
            </div>
          )}

          {/* Hand Cards List (Uno Style Horizontal Scroll) */}
          <div className="flex items-center gap-2.5 overflow-x-auto py-1">
            {(!currentPlayer.hand || currentPlayer.hand.length === 0) ? (
              <div className="py-4 text-center w-full text-slate-500 text-xs font-medium">
                Wala ka pang hawak na Biyaya cards. Makakamit ito sa pagsagot sa Pagsubok o sa Kapalaran!
              </div>
            ) : (
              currentPlayer.hand.map((card) => {
                const isSelected = selectedCard?.id === card.id;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`relative w-28 h-36 shrink-0 rounded-xl p-2 flex flex-col justify-between text-left transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'bg-gradient-to-b from-amber-900 via-amber-950 to-slate-900 border-2 border-amber-400 shadow-xl shadow-amber-500/30 -translate-y-2' 
                        : 'bg-slate-900/90 border border-amber-900/40 hover:border-amber-600/60 hover:-translate-y-1'
                    }`}
                  >
                    {/* Card Title */}
                    <div>
                      <div className="text-[10px] font-bold text-amber-400 uppercase font-cinzel leading-tight line-clamp-2">
                        {card.title}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {card.subtitle || 'Biyaya Card'}
                      </div>
                    </div>

                    {/* Card Icon Accent */}
                    <div className="my-auto flex items-center justify-center text-amber-500/80">
                      <Sparkles className="w-5 h-5" />
                    </div>

                    {/* Card Effect Summary */}
                    <div className="text-[9px] text-slate-300 line-clamp-2 leading-tight">
                      {card.effects?.[0]?.description || card.flavorText || 'Espesyal na epekto.'}
                    </div>

                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Card Action Banner */}
          {selectedCard && (
            <div className="p-3 rounded-xl bg-slate-900/95 border border-amber-500/50 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="font-cinzel text-xs font-bold text-amber-300">
                  {selectedCard.title} ({selectedCard.subtitle})
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {selectedCard.effects?.map(e => e.description).join(' ') || selectedCard.flavorText}
                </div>
              </div>

              {/* Target selector if card targets another player */}
              <div className="flex items-center gap-2">
                {selectedCard.effects?.some(e => e.target === 'target_player') && otherPlayers.length > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-400">Target:</span>
                    <select
                      value={targetPlayerId}
                      onChange={(e) => setTargetPlayerId(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-amber-200 text-xs rounded-lg px-2 py-1 outline-none"
                    >
                      {otherPlayers.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Tile {p.currentTile})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Play Button */}
                <button
                  onClick={handleExecutePlay}
                  disabled={!canPlayCards}
                  className={`px-4 py-1.5 rounded-lg font-cinzel text-xs font-bold flex items-center gap-1.5 transition-all ${
                    canPlayCards
                      ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 hover:brightness-110 shadow-lg cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{canPlayCards ? 'GAMITIN ANG BARAHA' : 'HINDI PWEDE NGAYON'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
