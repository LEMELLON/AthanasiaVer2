/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GameRoom, PlayerState, AdminSettings, TileMapData } from './types/game';
import { Navbar } from './components/Navbar';
import { MatchmakingLobby } from './components/Lobby/MatchmakingLobby';
import { GameBoard } from './components/Board/GameBoard';
import { DiceRoller } from './components/Board/DiceRoller';
import { HandDrawer } from './components/Cards/HandDrawer';
import { GameChat } from './components/Chat/GameChat';
import { GateChallengeModal } from './components/Modals/GateChallengeModal';
import { PagsubokModal } from './components/Modals/PagsubokModal';
import { KapalaranModal } from './components/Modals/KapalaranModal';
import { AccusationModal } from './components/Modals/AccusationModal';
import { RulesModal } from './components/Modals/RulesModal';
import { VictoryModal } from './components/Modals/VictoryModal';
import { AdminModal } from './components/Admin/AdminModal';
import { PilgrimProfileEditor } from './components/Profile/PilgrimProfileEditor';
import { TileMapEditor } from './components/MapEditor/TileMapEditor';
import { DEFAULT_ADMIN_SETTINGS } from './data/canonicalCards';
import { loadPilgrimProfile } from './utils/cookie';
import { sounds } from './utils/audio';
import { LanguageProvider, useLanguage } from './utils/i18n';
import { Play, Users, Bot, AlertCircle, Trash2, MapPin } from 'lucide-react';

function AthanasiaAppContent() {
  const { t } = useLanguage();
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>(() => localStorage.getItem('athanasia_player_id') || '');
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);

  // Modal open states
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAccusationModal, setShowAccusationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMapEditorModal, setShowMapEditorModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const wsRef = useRef<WebSocket | null>(null);

  // Derive current player
  const currentPlayer: PlayerState | null = currentRoom?.players.find(p => p.id === currentPlayerId) || null;

  // Real-time synchronization via WebSocket + Fallback Polling
  useEffect(() => {
    if (!currentRoom?.code) return;

    let isSubscribed = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws?room=${currentRoom.code}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ROOM_STATE_UPDATE' && isSubscribed) {
            setCurrentRoom(data.room);
          }
        } catch {}
      };

      ws.onerror = () => {
        // Fallback to HTTP polling if WS fails
      };
    } catch {}

    // Polling fallback every 2.5s to ensure rock-solid sync
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${currentRoom.code}`);
        if (res.ok && isSubscribed) {
          const updated = await res.json();
          setCurrentRoom(updated);
        }
      } catch {}
    }, 2500);

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [currentRoom?.code]);

  // Detect if current player was kicked from the lobby
  useEffect(() => {
    if (currentRoom && currentPlayerId) {
      const isStillMember = currentRoom.players.some(p => p.id === currentPlayerId);
      if (!isStillMember) {
        showToast(t.kickedToast);
        setCurrentRoom(null);
        setCurrentPlayerId('');
        localStorage.removeItem('athanasia_player_id');
      }
    }
  }, [currentRoom, currentPlayerId, t.kickedToast]);

  // Dispatch an action to the server
  const sendRoomAction = async (action: string, payload?: any) => {
    if (!currentRoom || !currentPlayerId) return;

    try {
      const res = await fetch(`/api/rooms/${currentRoom.code}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          playerId: currentPlayerId,
          payload,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setCurrentRoom(updated);
      }
    } catch (err) {
      console.error('Room action failed:', err);
    }
  };

  // Lobby Handlers
  const handleCreateRoom = async (
    roomName: string,
    hostName: string,
    avatarUrl: string,
    maxPlayers: number,
    fillWithBots: boolean,
    mapId?: string,
    customMap?: TileMapData
  ) => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: roomName,
          hostName,
          hostAvatar: avatarUrl,
          maxPlayers,
          mapId,
          customMap,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentRoom(data.room);
        setCurrentPlayerId(data.hostId);
        localStorage.setItem('athanasia_player_id', data.hostId);

        // If fill with bots was requested, add bots automatically
        if (fillWithBots && data.room) {
          const botsToAdd = maxPlayers - 1;
          for (let i = 0; i < botsToAdd; i++) {
            await fetch(`/api/rooms/${data.room.code}/action`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'ADD_BOT',
                playerId: data.hostId,
              }),
            });
          }
          // Fetch final room state
          const updatedRes = await fetch(`/api/rooms/${data.room.code}`);
          if (updatedRes.ok) {
            const finalRoom = await updatedRes.json();
            setCurrentRoom(finalRoom);
          }
        }
      }
    } catch {
      showToast('Hindi makalikha ng silid. Pakisubukang muli.');
    }
  };

  const handleJoinRoom = async (roomCode: string, playerName: string, avatarUrl: string) => {
    try {
      const res = await fetch(`/api/rooms/${roomCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          avatar: avatarUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentRoom(data.room);
        setCurrentPlayerId(data.playerId);
        localStorage.setItem('athanasia_player_id', data.playerId);
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Hindi makasali sa silid.');
      }
    } catch {
      showToast('Error sa pagsali sa silid. Pakisuri ang code.');
    }
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setCurrentPlayerId('');
  };

  const handleKickPlayer = (targetPlayerId: string, targetName: string) => {
    sounds.playClick();
    sendRoomAction('KICK_PLAYER', { targetPlayerId });
    showToast(`Pinaalis si ${targetName} mula sa silid.`);
  };

  const handleTestPlayMap = async (map: TileMapData) => {
    setShowMapEditorModal(false);
    const profile = loadPilgrimProfile();
    await handleCreateRoom(`Test: ${map.name}`, profile.playerName, profile.avatarUrl, 4, true, map.id, map);
    showToast(`Nagsimula ang pagsubok sa "${map.name}" kasama ang AI bots!`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col justify-between relative">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 border border-amber-500/80 text-amber-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        room={currentRoom}
        currentPlayer={currentPlayer}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenMapEditor={() => setShowMapEditorModal(true)}
        onLeaveRoom={handleLeaveRoom}
      />

      {/* Main View Router */}
      {!currentRoom ? (
        /* Matchmaking & Title Screen */
        <main className="flex-1">
          <MatchmakingLobby
            onJoinRoom={handleJoinRoom}
            onCreateRoom={handleCreateRoom}
            onOpenRules={() => setShowRulesModal(true)}
            onOpenAdmin={() => setShowAdminModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenMapEditor={() => setShowMapEditorModal(true)}
          />
        </main>
      ) : currentRoom.status === 'lobby' ? (
        /* Room Pre-Game Lobby */
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-center">
          <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 shadow-2xl backdrop-blur-md flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
              <div>
                <span className="text-xs font-cinzel font-bold text-amber-400 uppercase tracking-widest">
                  {t.lobby}
                </span>
                <h2 className="text-xl font-bold font-cinzel text-amber-100 mt-0.5">
                  {currentRoom.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-amber-300/90 font-medium font-cinzel">
                    {t.selectMap}: {currentRoom.mapData?.name || 'Canonical Diwa Sanctuary (50 Tiles)'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{t.roomCode}:</span>
                <span className="font-mono font-bold text-base px-3 py-1 rounded-xl bg-slate-950 border border-amber-500/50 text-amber-300 tracking-wider">
                  {currentRoom.code}
                </span>
              </div>
            </div>

            {/* Players in Lobby with Host Kick Controls */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                <span className="flex items-center gap-1.5 font-cinzel">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>{t.playersInLobby} ({currentRoom.players.length}/{currentRoom.maxPlayers})</span>
                </span>
                {currentPlayer?.isHost && currentRoom.players.length < currentRoom.maxPlayers && (
                  <button
                    onClick={() => { sounds.playClick(); sendRoomAction('ADD_BOT'); }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs border border-slate-700 cursor-pointer font-medium"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{t.addAiCompanion}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentRoom.players.map((p) => {
                  const canKick = currentPlayer?.isHost && p.id !== currentPlayer.id;
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 relative shadow-md hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-amber-500/40" />
                        <div>
                          <div className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.isHost && (
                              <span className="text-[9px] bg-amber-950 border border-amber-600/40 text-amber-400 px-1.5 py-0.2 rounded font-bold">HOST</span>
                            )}
                            {p.isBot && (
                              <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.2 rounded font-bold">AI</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-serif italic mt-0.5">
                            Ready for Athanasia
                          </div>
                        </div>
                      </div>

                      {/* HOST KICK BUTTON */}
                      {canKick && (
                        <button
                          onClick={() => handleKickPlayer(p.id, p.name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 border border-transparent hover:border-rose-800 cursor-pointer transition-all"
                          title={t.kickPlayer}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Host Launch Control */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-slate-400">
                {currentRoom.players.length < 2
                  ? t.needMorePlayers
                  : 'All pilgrims assembled! The path through the realms awaits.'}
              </div>

              {currentPlayer?.isHost ? (
                <button
                  onClick={() => { sounds.playClick(); sendRoomAction('START_GAME'); }}
                  disabled={currentRoom.players.length < 2}
                  className={`py-3 px-8 rounded-2xl font-cinzel text-xs font-bold tracking-wider flex items-center gap-2 shadow-xl transition-all ${
                    currentRoom.players.length >= 2
                      ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 hover:brightness-110 cursor-pointer animate-pulse-glow'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.startGame}</span>
                </button>
              ) : (
                <div className="text-xs text-amber-300 font-medium">
                  {t.waitingForHost}
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        /* Active Board Arena Match */
        <main className="flex-1 flex flex-col justify-between p-3 max-w-[1440px] w-full mx-auto gap-4">
          {/* Top Board Area: 50-Tile Dual-View Serpentine Grid */}
          <GameBoard
            room={currentRoom}
            currentPlayer={currentPlayer}
          />

          {/* Middle Control Console & Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Left 2 Cols: Turn Status, Dice Roller & Action Banner */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {(() => {
                const isMyTurn = currentRoom.players[currentRoom.currentTurnIndex]?.id === currentPlayer?.id;
                const canRollDice = isMyTurn && currentRoom.status === 'playing' && currentRoom.turnPhase === 'roll';
                return (
                  <DiceRoller
                    isCurrentPlayerTurn={isMyTurn}
                    canRoll={canRollDice}
                    lastRoll={currentRoom.activeDiceRoll}
                    onRoll={() => sendRoomAction('ROLL_DICE')}
                    halveNextRoll={currentPlayer?.halveNextRoll}
                  />
                );
              })()}
            </div>

            {/* Right 1 Col: Live Game Log & Room Chat */}
            <div className="lg:col-span-1">
              {currentPlayer && (
                <GameChat
                  room={currentRoom}
                  currentPlayer={currentPlayer}
                  onSendChat={(text) => sendRoomAction('SEND_CHAT', { text })}
                />
              )}
            </div>
          </div>

          {/* Bottom Floating Player Hand Drawer */}
          {currentPlayer && (
            <HandDrawer
              room={currentRoom}
              currentPlayer={currentPlayer}
              onPlayCard={(cardId, targetPlayerId) => sendRoomAction('PLAY_BIYAYA', { cardId, targetPlayerId })}
              onEndTurn={() => sendRoomAction('END_TURN')}
              onOpenAccusation={() => setShowAccusationModal(true)}
            />
          )}
        </main>
      )}

      {/* Modal Overlays */}
      {/* 1. Pintuan ng Diwaling Gate Challenge Modal */}
      {currentRoom && currentRoom.turnPhase === 'gate_challenge' && currentPlayer && (
        <GateChallengeModal
          room={currentRoom}
          currentPlayer={currentPlayer}
          onVoteGate={(suspectedPlayerId) => sendRoomAction('VOTE_GATE', { suspectedPlayerId })}
        />
      )}

      {/* 2. Pagsubok Challenge Modal */}
      {currentRoom && currentRoom.turnPhase === 'tile_event' && currentRoom.activeEventCard?.deck === 'pagsubok' && currentPlayer && (
        <PagsubokModal
          room={currentRoom}
          currentPlayer={currentPlayer}
          onSubmitAnswer={(answer) => sendRoomAction('ANSWER_PAGSUBOK', { answer })}
        />
      )}

      {/* 3. Kapalaran Dilemma Modal */}
      {currentRoom && currentRoom.turnPhase === 'tile_event' && currentRoom.activeEventCard?.deck === 'kapalaran' && currentPlayer && (
        <KapalaranModal
          room={currentRoom}
          currentPlayer={currentPlayer}
          onChooseOption={(choiceIndex) => sendRoomAction('CHOOSE_KAPALARAN', { choiceIndex })}
        />
      )}

      {/* 4. Guess the Impostor Accusation Modal */}
      {showAccusationModal && currentRoom && currentPlayer && (
        <AccusationModal
          room={currentRoom}
          currentPlayer={currentPlayer}
          onAccuse={(targetPlayerId) => sendRoomAction('ACCUSE_IMPOSTOR', { targetPlayerId })}
          onClose={() => setShowAccusationModal(false)}
        />
      )}

      {/* 5. Game Over / Victory Modal */}
      {currentRoom && currentRoom.status === 'ended' && currentPlayer && (
        <VictoryModal
          room={currentRoom}
          currentPlayer={currentPlayer}
          onRestartLobby={() => setCurrentRoom(null)}
        />
      )}

      {/* 6. Rules & Lore Modal */}
      {showRulesModal && (
        <RulesModal onClose={() => setShowRulesModal(false)} />
      )}

      {/* 7. Admin Suite Modal */}
      {showAdminModal && (
        <AdminModal
          onClose={() => setShowAdminModal(false)}
          onSettingsUpdated={(newSettings) => setAdminSettings(newSettings)}
        />
      )}

      {/* 8. Pilgrim Profile Editor Modal */}
      {showProfileModal && (
        <PilgrimProfileEditor
          initialProfile={loadPilgrimProfile()}
          onSave={(updated) => {
            showToast(`Nai-save ang profile ni ${updated.playerName}!`);
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* 9. Interactive Tile Map Editor Modal */}
      {showMapEditorModal && (
        <TileMapEditor
          onClose={() => setShowMapEditorModal(false)}
          onMapSaved={(map) => {
            showToast(`Nai-save ang mapa: ${map.name}`);
          }}
          onTestPlay={handleTestPlayMap}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AthanasiaAppContent />
    </LanguageProvider>
  );
}
