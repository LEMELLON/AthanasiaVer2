import React, { useState, useRef, useEffect } from 'react';
import { GameRoom, PlayerState } from '../../types/game';
import { Send, MessageSquare, Users, Shield } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../utils/i18n';

interface GameChatProps {
  room: GameRoom;
  currentPlayer: PlayerState;
  onSendChat: (text: string) => void;
}

export const GameChat: React.FC<GameChatProps> = ({
  room,
  currentPlayer,
  onSendChat,
}) => {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'players'>('chat');
  
  // Scoped internal scroll container ref to prevent browser window-level auto-scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Confine scroll strictly to internal chat element, never dragging parent window viewport
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [room.chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sounds.playClick();
    onSendChat(inputText.trim());
    setInputText('');
  };

  const handleQuickReaction = (text: string) => {
    sounds.playClick();
    onSendChat(text);
  };

  return (
    <div className="flex flex-col h-[480px] rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl overflow-hidden">
      {/* Chat Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.chatTab}</span>
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'players'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.pilgrimsTab} ({room.players.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Messages Feed with Scoped Scroll Container */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
            {room.chatMessages.map((msg) => {
              const isMe = msg.sender === currentPlayer.name;
              const isSystem = msg.type === 'system';
              const isCard = msg.type === 'card';
              const isAccusation = msg.type === 'accusation';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-1">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/60">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              if (isAccusation) {
                return (
                  <div key={msg.id} className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 my-1 animate-pulse">
                    <div className="font-bold text-[11px] uppercase tracking-wider text-rose-400 flex items-center gap-1">
                      🚨 PARATANG NG IMPOSTOR
                    </div>
                    <div className="text-xs mt-0.5">{msg.text}</div>
                  </div>
                );
              }

              if (isCard) {
                return (
                  <div key={msg.id} className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 my-1">
                    <span className="font-bold text-amber-400 mr-1.5">{msg.sender}:</span>
                    <span>{msg.text}</span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 font-medium px-1">
                    {msg.sender}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-1.5 mt-0.5 ${
                      isMe
                        ? 'bg-amber-600 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Reaction Pills */}
          <div className="px-2 py-1 flex items-center gap-1 overflow-x-auto border-t border-slate-800 bg-slate-950/40 shrink-0">
            {t.quickReactions.map((qText, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReaction(qText)}
                className="whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-amber-300 border border-slate-700 cursor-pointer transition-colors shrink-0"
              >
                {qText}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="p-2 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chatPlaceholder}
              maxLength={150}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Players List Tab */
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
          {room.players.map((p) => {
            const isTurn = room.players[room.currentTurnIndex]?.id === p.id;
            return (
              <div
                key={p.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                  isTurn
                    ? 'border-amber-500/80 bg-amber-950/30'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                    {p.hasShield && (
                      <Shield className="w-3.5 h-3.5 text-cyan-400 absolute -bottom-1 -right-1" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {p.isHost && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-800/40">HOST</span>
                      )}
                      {p.isBot && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">BOT</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Pwesto: Tile #{p.currentTile}/50 · {p.hand?.length || 0} Baraha
                    </div>
                  </div>
                </div>

                {isTurn && (
                  <span className="text-[10px] font-bold font-cinzel text-amber-400 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 animate-pulse">
                    TUMITIRA
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
