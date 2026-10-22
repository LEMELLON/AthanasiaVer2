import React, { useState } from 'react';
import { GameRoom, PlayerState, RealmType } from '../../types/game';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

interface GateChallengeModalProps {
  room: GameRoom;
  currentPlayer: PlayerState;
  onVoteGate: (suspectedPlayerId: string) => void;
}

export const GateChallengeModal: React.FC<GateChallengeModalProps> = ({
  room,
  currentPlayer,
  onVoteGate,
}) => {
  const { t, language } = useLanguage();
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>('');
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const card = room.activeEventCard;
  const realm = room.activeGateRealm || 'talvaris';

  if (!card) return null;

  const handleVoteSubmit = () => {
    if (!selectedSuspectId) return;
    sounds.playClick();
    setHasVoted(true);
    onVoteGate(selectedSuspectId);
  };

  const realmNames: Record<RealmType, string> = {
    talvaris: language === 'tl' ? 'Talvaris (Lupa) — Ikapatar' : 'Talvaris (Earth) — Ikapatar',
    alabarya: language === 'tl' ? 'Alabarya (Apoy) — Sinukalab' : 'Alabarya (Fire) — Sinukalab',
    alonawon: language === 'tl' ? 'Alonawon (Tubig) — Sinayalon' : 'Alonawon (Water) — Sinayalon',
    himaraya: language === 'tl' ? 'Himaraya (Hangin) — Lihamihan' : 'Himaraya (Air) — Lihamihan',
    aetherya: language === 'tl' ? 'Aetherya (Sanctuary) — Varyndor' : 'Aetherya (Sanctuary) — Varyndor',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl shadow-amber-950/60 flex flex-col gap-4 text-center">
        {/* Gate Header Badge */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg animate-pulse-glow">
            <Lock className="w-6 h-6" />
          </div>
          <span className="font-cinzel text-xs font-bold tracking-widest text-amber-400 uppercase">
            {t.gateModalTitle}
          </span>
          <h2 className="font-cinzel text-lg font-bold text-amber-100">
            {realmNames[realm]}
          </h2>
          <p className="text-xs text-slate-300 max-w-sm">
            {t.gateModalDesc}
          </p>
        </div>

        {/* Pahiwatig Card Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-left shadow-inner">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-cinzel">
            <Sparkles className="w-4 h-4" />
            <span>{card.title}</span>
          </div>
          <p className="text-sm font-semibold text-amber-100 mt-2 italic font-serif">
            "{card.question}"
          </p>
          <div className="text-[11px] text-slate-400 mt-2">
            {language === 'tl'
              ? 'Tip: Alalahanin ang mga pahiwatig ng Sumpa na binasa ng bawat isa sa simula ng laro.'
              : 'Tip: Recall the secret Sumpa hints shared in chat at the beginning of the match.'}
          </div>
        </div>

        {/* Suspect Selector */}
        {!hasVoted ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-300 text-left">
              {t.gateVotePrompt}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {room.players.map((p) => {
                const isSelected = selectedSuspectId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => { sounds.playClick(); setSelectedSuspectId(p.id); }}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/70 text-amber-200 shadow-md ring-1 ring-amber-400'
                        : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                    <span className="text-xs font-semibold truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleVoteSubmit}
              disabled={!selectedSuspectId}
              className={`mt-2 py-2.5 px-4 rounded-xl font-cinzel text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                selectedSuspectId
                  ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 hover:brightness-110 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.gateVoteBtn}</span>
            </button>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-amber-300 font-medium bg-amber-950/40 rounded-xl border border-amber-500/30">
            {t.gateVotedStatus}
          </div>
        )}
      </div>
    </div>
  );
};
