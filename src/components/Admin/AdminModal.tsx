import React, { useState } from 'react';
import { AdminSettings, CardDeckType, CardEffect, CardEffectType, GameCard, PagsubokCategory, RealmType } from '../../types/game';
import { DEFAULT_ADMIN_SETTINGS, INITIAL_ALL_CARDS, DEFAULT_CHARACTER_AVATARS, DEFAULT_REALM_BACKGROUNDS } from '../../data/canonicalCards';
import { Settings, Lock, Plus, Trash2, Edit3, Save, RotateCcw, Download, Upload, Check, X, Shield, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface AdminModalProps {
  onClose: () => void;
  onSettingsUpdated: (newSettings: AdminSettings) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  onClose,
  onSettingsUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin tabs
  const [activeTab, setActiveTab] = useState<'cards' | 'builder' | 'assets' | 'backup'>('cards');
  const [selectedDeckFilter, setSelectedDeckFilter] = useState<CardDeckType | 'all'>('biyaya');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Editable state
  const [cards, setCards] = useState<GameCard[]>(() => {
    const saved = localStorage.getItem('athanasia_custom_cards');
    return saved ? JSON.parse(saved) : INITIAL_ALL_CARDS;
  });

  const [avatars, setAvatars] = useState(DEFAULT_CHARACTER_AVATARS);
  const [backgrounds, setBackgrounds] = useState(DEFAULT_REALM_BACKGROUNDS);
  const [systemPassword, setSystemPassword] = useState('diwa_admin_2026');

  // Modular Builder State
  const [editingCard, setEditingCard] = useState<GameCard>({
    id: `custom_${Date.now()}`,
    deck: 'biyaya',
    title: 'Bagong Baraha',
    subtitle: 'Mahiwagang Epekto',
    flavorText: 'Inukit ng Babaylan ang bagong agimat.',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 2,
        target: 'self',
        description: 'Sumulong ng 2 hakbang pasulong.',
      },
    ],
    custom: true,
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === systemPassword || passwordInput === 'diwa_admin_2026') {
      sounds.playChallengeSuccess();
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      sounds.playChallengeFail();
      setAuthError('Maling system password! Ang default password ay: diwa_admin_2026');
    }
  };

  // Modular effect stacker helpers
  const addEffectToEditingCard = () => {
    const newEffect: CardEffect = {
      type: 'DRAW_BIYAYA',
      value: 1,
      target: 'self',
      description: 'Bumunot ng 1 karagdagang Biyaya card.',
    };
    setEditingCard({
      ...editingCard,
      effects: [...(editingCard.effects || []), newEffect],
    });
  };

  const removeEffectFromEditingCard = (idx: number) => {
    const updated = [...(editingCard.effects || [])];
    updated.splice(idx, 1);
    setEditingCard({ ...editingCard, effects: updated });
  };

  const updateEffectField = (idx: number, field: keyof CardEffect, val: any) => {
    const updated = [...(editingCard.effects || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setEditingCard({ ...editingCard, effects: updated });
  };

  const handleSaveCard = () => {
    sounds.playClick();
    const existingIdx = cards.findIndex(c => c.id === editingCard.id);
    let updatedCards: GameCard[];
    if (existingIdx !== -1) {
      updatedCards = [...cards];
      updatedCards[existingIdx] = editingCard;
    } else {
      updatedCards = [editingCard, ...cards];
    }
    setCards(updatedCards);
    localStorage.setItem('athanasia_custom_cards', JSON.stringify(updatedCards));
    setActiveTab('cards');

    onSettingsUpdated({
      systemPassword,
      characterAvatars: avatars,
      realmBackgrounds: backgrounds,
      cardFrameStyle: 'ancient',
      cards: updatedCards,
    });
  };

  const handleDeleteCard = (id: string) => {
    sounds.playClick();
    const updatedCards = cards.filter(c => c.id !== id);
    setCards(updatedCards);
    localStorage.setItem('athanasia_custom_cards', JSON.stringify(updatedCards));
  };

  const handleResetDefaults = () => {
    sounds.playClick();
    setCards(INITIAL_ALL_CARDS);
    setAvatars(DEFAULT_CHARACTER_AVATARS);
    setBackgrounds(DEFAULT_REALM_BACKGROUNDS);
    localStorage.removeItem('athanasia_custom_cards');
    setStatusMessage('Naibalik na ang canonical GDD cards at balance sa default!');
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleExportJSON = () => {
    sounds.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `athanasia_balance_patch_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setCards(parsed);
            localStorage.setItem('athanasia_custom_cards', JSON.stringify(parsed));
            sounds.playChallengeSuccess();
            alert('Matagumpay na na-import ang balance patch!');
          }
        } catch {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  // Filter cards
  const filteredCards = cards.filter(c => {
    const matchesDeck = selectedDeckFilter === 'all' || c.deck === selectedDeckFilter;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.effects?.some(e => e.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDeck && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/70 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-left max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base md:text-lg font-bold text-amber-100 flex items-center gap-2">
                ATHANASIA Admin Suite & Modular Card Balancer
              </h2>
              <p className="text-[11px] text-slate-400">
                Pamahalaan ang mga baraha, mag-stack ng modular effects, at magpalit ng assets.
              </p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Password Lock Screen */}
        {!isAuthenticated ? (
          <form onSubmit={handleAuthSubmit} className="py-8 flex flex-col items-center gap-4 max-w-sm mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-amber-200">
                Kailangan ng System Password
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ipasok ang tamang admin password upang mabuksan ang buong card management suite.
              </p>
            </div>

            <div className="w-full flex flex-col gap-1.5">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password (Default: diwa_admin_2026)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 text-center outline-none focus:border-amber-500"
              />
              {authError && <span className="text-[11px] text-rose-400">{authError}</span>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 font-cinzel text-xs font-bold tracking-wider hover:brightness-110 shadow-lg cursor-pointer"
            >
              BUKSAN ANG ADMIN SUITE
            </button>
          </form>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeTab === 'cards' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Listahan ng Baraha ({cards.length})
                </button>
                <button
                  onClick={() => {
                    setEditingCard({
                      id: `custom_${Date.now()}`,
                      deck: 'biyaya',
                      title: 'Bagong Baraha',
                      subtitle: 'Mahiwagang Epekto',
                      flavorText: 'Paglalarawan ng baraha.',
                      effects: [
                        {
                          type: 'MOVE_FORWARD',
                          value: 2,
                          target: 'self',
                          description: 'Sumulong ng 2 hakbang pasulong.',
                        },
                      ],
                      custom: true,
                    });
                    setActiveTab('builder');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    activeTab === 'builder' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Modular Card Builder</span>
                </button>
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeTab === 'assets' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Character & Realm Assets
                </button>
                <button
                  onClick={() => setActiveTab('backup')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    activeTab === 'backup' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Import / Export / Reset
                </button>
              </div>

              <span className="text-[11px] text-amber-400 font-mono">
                Admin: Authenticated ✓
              </span>
            </div>

            {/* TAB 1: CARDS LIST */}
            {activeTab === 'cards' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Deck Filter Strip */}
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-1 overflow-x-auto text-xs">
                    {(['all', 'biyaya', 'pagsubok', 'kapalaran', 'pahiwatig', 'sumpa'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setSelectedDeckFilter(d)}
                        className={`px-2.5 py-1 rounded-lg uppercase font-semibold text-[10px] cursor-pointer ${
                          selectedDeckFilter === d ? 'bg-amber-950 text-amber-300 border border-amber-500/50' : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Maghanap ng pamagat o epekto..."
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-200 outline-none w-56 focus:border-amber-500"
                  />
                </div>

                {/* Cards Table */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel font-bold text-amber-200">{card.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-400 uppercase">
                            {card.deck} {card.category ? `· ${card.category}` : ''}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {card.question ? `Q: "${card.question}" (Ans: ${card.answer})` : card.flavorText}
                        </div>
                        {card.effects && card.effects.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {card.effects.map((eff, i) => (
                              <span key={i} className="text-[10px] bg-amber-950/70 border border-amber-600/30 text-amber-300 px-2 py-0.5 rounded-full">
                                ⚡ {eff.type} {eff.value ? `(${eff.value})` : ''} - {eff.description}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingCard(card);
                            setActiveTab('builder');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer"
                          title="I-edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 cursor-pointer"
                          title="Tanggalin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: MODULAR CARD BUILDER */}
            {activeTab === 'builder' && (
              <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Deck Type:</label>
                    <select
                      value={editingCard.deck}
                      onChange={(e) => setEditingCard({ ...editingCard, deck: e.target.value as CardDeckType })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 outline-none"
                    >
                      <option value="biyaya">Biyaya (Action Card)</option>
                      <option value="pagsubok">Pagsubok (Challenge/Riddle)</option>
                      <option value="kapalaran">Kapalaran (Risk/Reward)</option>
                      <option value="pahiwatig">Pahiwatig (Gate Clue)</option>
                      <option value="sumpa">Sumpa (Curse)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Card Title:</label>
                    <input
                      type="text"
                      value={editingCard.title}
                      onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Subtitle / Theme:</label>
                    <input
                      type="text"
                      value={editingCard.subtitle || ''}
                      onChange={(e) => setEditingCard({ ...editingCard, subtitle: e.target.value })}
                      placeholder="Hal: Agimat ng Lupa"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-medium">Category (Para sa Pagsubok):</label>
                    <select
                      value={editingCard.category || 'bugtong'}
                      onChange={(e) => setEditingCard({ ...editingCard, category: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 outline-none"
                    >
                      <option value="bugtong">Bugtong (Riddle)</option>
                      <option value="sagisag">Pambansang Sagisag</option>
                      <option value="kasabihan">Kasabihan (Proverb)</option>
                      <option value="speed_trivia">Speed Trivia (5s)</option>
                      <option value="tongue_twister">Tongue Twister</option>
                      <option value="idiom">Sawikain (Idiom)</option>
                      <option value="action">Action / Biyaya</option>
                      <option value="curse">Curse / Sumpa</option>
                      <option value="clue">Gate Clue / Pahiwatig</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium">Flavor Text / Paglalarawan:</label>
                  <textarea
                    value={editingCard.flavorText || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, flavorText: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 outline-none text-xs"
                  />
                </div>

                {/* If Pagsubok: Question and Answer */}
                {editingCard.deck === 'pagsubok' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div>
                      <label className="text-[11px] text-amber-400 font-medium">Tanong (Question):</label>
                      <input
                        type="text"
                        value={editingCard.question || ''}
                        onChange={(e) => setEditingCard({ ...editingCard, question: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-amber-400 font-medium">Tamang Sagot (Answer):</label>
                      <input
                        type="text"
                        value={editingCard.answer || ''}
                        onChange={(e) => setEditingCard({ ...editingCard, answer: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 mt-1 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Modular Stacked Effects Section */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-600/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Stacked Modular Effects Engine</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Magpatong-patong ng mga epekto (Hal. Sumulong ng 2 hakbang + Bumunot ng baraha).
                      </p>
                    </div>
                    <button
                      onClick={addEffectToEditingCard}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Magdagdag ng Effect</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingCard.effects?.map((eff, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap flex-1">
                          {/* Effect Type Picker */}
                          <select
                            value={eff.type}
                            onChange={(e) => updateEffectField(idx, 'type', e.target.value as CardEffectType)}
                            className="bg-slate-900 border border-slate-700 text-amber-300 rounded-lg px-2 py-1 text-xs"
                          >
                            <option value="MOVE_FORWARD">MOVE_FORWARD (Pasulong)</option>
                            <option value="MOVE_BACKWARD">MOVE_BACKWARD (Paurong)</option>
                            <option value="DRAW_BIYAYA">DRAW_BIYAYA (Bunot)</option>
                            <option value="DISCARD_BIYAYA">DISCARD_BIYAYA (Tapon)</option>
                            <option value="SKIP_TURN">SKIP_TURN (Harang/Laktaw)</option>
                            <option value="EXTRA_TURN">EXTRA_TURN (Dagdag Tira)</option>
                            <option value="ANTING_ANTING_SHIELD">ANTING_ANTING_SHIELD (Kalasag)</option>
                            <option value="SWAP_PLAYERS_SAME_REALM">SWAP_PLAYERS_SAME_REALM (Palit-Pwesto)</option>
                            <option value="SWAP_PLAYER_FURTHEST">SWAP_PLAYER_FURTHEST</option>
                            <option value="HALVE_NEXT_ROLL">HALVE_NEXT_ROLL (Kalahati)</option>
                            <option value="PEEK_PAHIWATIG">PEEK_PAHIWATIG (Silip)</option>
                            <option value="AUTO_CORRECT_PAGSUBOK">AUTO_CORRECT_PAGSUBOK</option>
                            <option value="TELEPORT_REALM_START">TELEPORT_REALM_START</option>
                          </select>

                          {/* Value Input */}
                          <input
                            type="number"
                            value={eff.value || 1}
                            onChange={(e) => updateEffectField(idx, 'value', Number(e.target.value))}
                            className="w-16 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs text-center"
                            placeholder="Value"
                          />

                          {/* Target Picker */}
                          <select
                            value={eff.target || 'self'}
                            onChange={(e) => updateEffectField(idx, 'target', e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 text-xs"
                          >
                            <option value="self">Sarili (Self)</option>
                            <option value="target_player">Kalaban (Target Player)</option>
                            <option value="all_opponents">Lahat ng Kalaban</option>
                          </select>

                          {/* Description */}
                          <input
                            type="text"
                            value={eff.description || ''}
                            onChange={(e) => updateEffectField(idx, 'description', e.target.value)}
                            placeholder="Maikling paliwanag sa epekto"
                            className="flex-1 min-w-[200px] bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs"
                          />
                        </div>

                        <button
                          onClick={() => removeEffectFromEditingCard(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Card Buttons */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('cards')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-cinzel text-xs cursor-pointer"
                  >
                    Kanselahin
                  </button>
                  <button
                    onClick={handleSaveCard}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 font-cinzel text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>I-SAVE ANG BARAHA</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ASSETS CUSTOMIZER */}
            {activeTab === 'assets' && (
              <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
                {/* Character Avatars */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-cinzel text-xs font-bold text-amber-300">
                    Character Avatars & Tokens
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {avatars.map((av, idx) => (
                      <div key={av.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
                        <img src={av.url} alt={av.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/40" />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={av.name}
                            onChange={(e) => {
                              const updated = [...avatars];
                              updated[idx].name = e.target.value;
                              setAvatars(updated);
                            }}
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-200 font-semibold w-full"
                          />
                          <input
                            type="text"
                            value={av.url}
                            onChange={(e) => {
                              const updated = [...avatars];
                              updated[idx].url = e.target.value;
                              setAvatars(updated);
                            }}
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-400 w-full mt-1 font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Realm Backgrounds */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-cinzel text-xs font-bold text-amber-300">
                    Realm Environment Backgrounds
                  </h4>
                  {(['talvaris', 'alabarya', 'alonawon', 'himaraya', 'aetherya'] as RealmType[]).map((realm) => (
                    <div key={realm} className="flex items-center gap-3">
                      <span className="w-24 uppercase font-cinzel font-bold text-slate-400 text-[11px]">{realm}:</span>
                      <input
                        type="text"
                        value={backgrounds[realm]}
                        onChange={(e) => setBackgrounds({ ...backgrounds, [realm]: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: IMPORT / EXPORT / RESET */}
            {activeTab === 'backup' && (
              <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-cinzel text-xs font-bold text-amber-300">
                    I-export ang Balance Patch (JSON)
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    I-download ang kabuuang database ng baraha kasama ang iyong mga custom cards at bagong effects para maibahagi sa ibang manlalaro o silid.
                  </p>
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    <span>I-download ang athanasia_balance.json</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-cinzel text-xs font-bold text-amber-300">
                    I-import ang Balance Patch
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    Mag-upload ng JSON file na may bagong balanse o modular cards.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 cursor-pointer font-semibold">
                    <Upload className="w-4 h-4" />
                    <span>Pumili ng JSON File</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-3">
                  <h4 className="font-cinzel text-xs font-bold text-rose-300">
                    I-reset sa Canonical GDD Default
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    Ibabalik nito ang lahat ng baraha, pahiwatig, bugtong, at epekto sa orihinal na nilalaman ng Game Design Document.
                  </p>
                  <button
                    onClick={handleResetDefaults}
                    className="px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800/80 border border-rose-700 text-rose-200 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>I-reset ang Lahat ng Baraha sa Default</span>
                  </button>
                  {statusMessage && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
                      {statusMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
