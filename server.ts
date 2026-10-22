import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GameRoom, PlayerState, GameCard, RealmType } from './src/types/game.ts';
import { 
  CANONICAL_SUMPA_CARDS, 
  CANONICAL_PAHIWATIG_CARDS, 
  CANONICAL_PAGSUBOK_CARDS, 
  CANONICAL_BIYAYA_CARDS, 
  CANONICAL_KAPALARAN_CARDS,
  CANONICAL_BOARD_TILES,
  DEFAULT_CHARACTER_AVATARS,
  DEFAULT_ADMIN_SETTINGS 
} from './src/data/canonicalCards.ts';
import { calculateClampedMovement, executeCardEffects, isGateTile } from './src/utils/modularCardEngine.ts';
import { botChoosePagsubokAnswer, botChooseKapalaranIndex, botChooseGateTarget, botChooseBiyayaCard } from './src/utils/botAi.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Room Store
const rooms: Map<string, GameRoom> = new Map();
// WebSocket connection registry: roomCode -> Set<WebSocket>
const roomSockets: Map<string, Set<WebSocket>> = new Map();

let currentAdminSettings = { ...DEFAULT_ADMIN_SETTINGS };

function broadcastRoom(room: GameRoom) {
  const sockets = roomSockets.get(room.code);
  if (!sockets) return;
  const payload = JSON.stringify({ type: 'ROOM_STATE_UPDATE', room });
  for (const client of sockets) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper to seed a newly created room
function createInitialRoom(
  code: string,
  name: string,
  hostName: string,
  hostAvatar: string,
  maxPlayers: number = 4
): { room: GameRoom; hostId: string } {
  const hostId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const hostPlayer: PlayerState = {
    id: hostId,
    name: hostName || 'Pilgrim Host',
    avatar: hostAvatar || DEFAULT_CHARACTER_AVATARS[0].url,
    isHost: true,
    isBot: false,
    role: 'aninag',
    currentTile: 0,
    hand: [],
    hasUsedAccusation: false,
    hasShield: false,
    skipNextTurn: false,
    halveNextRoll: false,
    isBlockedRound: false,
    isEliminated: false,
  };

  const room: GameRoom = {
    code,
    name: name || `Diwa Sanctuary ${code}`,
    hostId,
    maxPlayers: Math.max(2, Math.min(6, maxPlayers)),
    status: 'lobby',
    players: [hostPlayer],
    currentTurnIndex: 0,
    turnTimeLimit: 30,
    turnSecondsRemaining: 30,
    turnPhase: 'roll',
    chatMessages: [
      {
        id: `sys_${Date.now()}`,
        sender: 'DIWA',
        text: `Maligayang pagdating sa silid ${code}! Maghintay ng mga kasama o magdagdag ng bots bago simulan ang paglalakbay.`,
        timestamp: Date.now(),
        type: 'system',
      },
    ],
    diwalingGatesUnlocked: {
      talvaris: false,
      alabarya: false,
      alonawon: false,
      himaraya: false,
      aetherya: false,
    },
    historyLog: [`Nalikha ang silid ${code}.`],
    cardsDataVersion: 1,
  };

  rooms.set(code, room);
  return { room, hostId };
}

// Start Game and Deal Roles, Sumpa, and Biyaya Cards
function startGameInRoom(room: GameRoom): GameRoom {
  if (room.players.length < 2) return room;

  // 1. Assign Roles: Exactly 1 Impostor, rest are Ordinary Aninag
  const impostorIndex = Math.floor(Math.random() * room.players.length);
  room.players.forEach((player, idx) => {
    player.role = idx === impostorIndex ? 'impostor' : 'aninag';
    player.currentTile = 0;
    player.hasUsedAccusation = false;
    player.hasShield = false;
    player.skipNextTurn = false;
    player.isBlockedRound = false;
    player.isEliminated = false;
    player.hand = [];
  });

  // 2. Deal Sumpa Cards (1 secret per player)
  const shuffledSumpa = [...CANONICAL_SUMPA_CARDS].sort(() => Math.random() - 0.5);
  room.players.forEach((player, idx) => {
    player.sumpaCard = shuffledSumpa[idx % shuffledSumpa.length];
  });

  // 3. Deal starting Biyaya Cards (2 per player)
  const shuffledBiyaya = [...CANONICAL_BIYAYA_CARDS].sort(() => Math.random() - 0.5);
  room.players.forEach((player, idx) => {
    player.hand = [
      shuffledBiyaya[(idx * 2) % shuffledBiyaya.length],
      shuffledBiyaya[(idx * 2 + 1) % shuffledBiyaya.length],
    ];
  });

  room.status = 'playing';
  room.currentTurnIndex = 0;
  room.turnPhase = 'roll';
  room.turnSecondsRemaining = room.turnTimeLimit;
  room.historyLog.push(`Nagsimula na ang paglalakbay sa Talvaris!`);

  // Announce the Sumpa hints aloud
  room.players.forEach(p => {
    if (p.sumpaCard) {
      room.chatMessages.push({
        id: `sumpa_${Date.now()}_${Math.random()}`,
        sender: p.name,
        text: `📜 (Ibinaling ng Sumpa): "${p.sumpaCard.hint}"`,
        timestamp: Date.now(),
        type: 'card',
      });
    }
  });

  room.chatMessages.push({
    id: `sys_start_${Date.now()}`,
    sender: 'DIWA',
    text: `Unang tira kay ${room.players[0].name}. Pagulungin ang dice upang makasulong!`,
    timestamp: Date.now(),
    type: 'system',
  });

  return room;
}

// Next Turn Handler
function advanceTurn(room: GameRoom) {
  let nextIndex = (room.currentTurnIndex + 1) % room.players.length;
  let attempts = 0;

  // Skip eliminated or skipped players
  while (attempts < room.players.length) {
    const nextPlayer = room.players[nextIndex];
    if (nextPlayer.isEliminated) {
      nextIndex = (nextIndex + 1) % room.players.length;
      attempts++;
      continue;
    }
    if (nextPlayer.skipNextTurn) {
      nextPlayer.skipNextTurn = false;
      room.chatMessages.push({
        id: `skip_${Date.now()}`,
        sender: 'DIWA',
        text: `Nalampasan ang tira ni ${nextPlayer.name} dahil sa epekto ng Harang/Sumpa.`,
        timestamp: Date.now(),
        type: 'system',
      });
      nextIndex = (nextIndex + 1) % room.players.length;
      attempts++;
      continue;
    }
    break;
  }

  room.currentTurnIndex = nextIndex;
  room.turnPhase = 'roll';
  room.turnSecondsRemaining = room.turnTimeLimit;
  room.activeDiceRoll = undefined;
  room.activeEventCard = undefined;
  room.activeGateRealm = undefined;
  room.gateVotes = undefined;

  const currentPlayer = room.players[room.currentTurnIndex];
  room.chatMessages.push({
    id: `turn_${Date.now()}`,
    sender: 'DIWA',
    text: `Oras ng pagtira ni ${currentPlayer.name}.`,
    timestamp: Date.now(),
    type: 'system',
  });

  broadcastRoom(room);

  // Trigger bot turn if current player is a bot
  if (currentPlayer.isBot && room.status === 'playing') {
    handleBotTurn(room, currentPlayer);
  }
}

// AI Bot automated actions
function handleBotTurn(room: GameRoom, bot: PlayerState) {
  setTimeout(() => {
    if (room.status !== 'playing' || room.players[room.currentTurnIndex]?.id !== bot.id) return;

    // Phase 1: Roll dice
    let roll = Math.floor(Math.random() * 6) + 1;
    if (bot.halveNextRoll) {
      roll = Math.max(1, Math.floor(roll / 2));
      bot.halveNextRoll = false;
    }
    room.activeDiceRoll = roll;

    const { finalTile, stoppedAtGate } = calculateClampedMovement(
      bot.currentTile,
      roll,
      room.diwalingGatesUnlocked
    );
    bot.currentTile = finalTile;
    room.chatMessages.push({
      id: `bot_roll_${Date.now()}`,
      sender: bot.name,
      text: `🎲 Gumulong ng ${roll}! Lumipat sa Tile #${finalTile}.`,
      timestamp: Date.now(),
      type: 'system',
    });

    const tile = CANONICAL_BOARD_TILES[finalTile] || CANONICAL_BOARD_TILES[0];

    // Check Victory at Aetherya
    if (finalTile >= 50) {
      room.status = 'ended';
      room.winner = bot.role === 'impostor' ? 'impostor' : 'aninag';
      room.chatMessages.push({
        id: `win_${Date.now()}`,
        sender: 'DIWA',
        text: `🏆 Nakarating si ${bot.name} sa Aetherya! Tagumpay ng ${room.winner.toUpperCase()}!`,
        timestamp: Date.now(),
        type: 'system',
      });
      broadcastRoom(room);
      return;
    }

    // Phase 2: Resolve tile
    if (stoppedAtGate || (tile.type === 'pintuan' && !room.diwalingGatesUnlocked[tile.realm])) {
      // Trigger Diwaling Gate Challenge
      const gateRealm = stoppedAtGate || tile.realm;
      room.activeGateRealm = gateRealm;
      room.turnPhase = 'gate_challenge';
      // Pick random Pahiwatig card
      const pahiwatigCards = CANONICAL_PAHIWATIG_CARDS;
      room.activeEventCard = pahiwatigCards[Math.floor(Math.random() * pahiwatigCards.length)];
      room.gateVotes = [];
      broadcastRoom(room);

      // Auto-resolve gate vote after 3 seconds for bots
      setTimeout(() => {
        if (room.turnPhase === 'gate_challenge') {
          // Check matching Sumpa
          room.diwalingGatesUnlocked[gateRealm] = true;
          room.chatMessages.push({
            id: `gate_unlock_${Date.now()}`,
            sender: 'DIWA',
            text: `✨ Nabuksan ang Pintuan ng Diwaling sa ${gateRealm.toUpperCase()}! Lahat ay maaari nang makatawid.`,
            timestamp: Date.now(),
            type: 'system',
          });
          advanceTurn(room);
        }
      }, 2500);
      return;
    } else if (tile.type === 'pagsubok') {
      const pagCards = CANONICAL_PAGSUBOK_CARDS;
      const card = pagCards[Math.floor(Math.random() * pagCards.length)];
      room.activeEventCard = card;
      room.turnPhase = 'tile_event';
      broadcastRoom(room);

      setTimeout(() => {
        if (room.turnPhase === 'tile_event' && room.activeEventCard?.id === card.id) {
          // Bot answer
          const ans = botChoosePagsubokAnswer(card, bot.role === 'impostor');
          const isCorrect = ans === card.answer;
          if (isCorrect) {
            // Reward 1 Biyaya card
            const randBiyaya = CANONICAL_BIYAYA_CARDS[Math.floor(Math.random() * CANONICAL_BIYAYA_CARDS.length)];
            bot.hand.push({ ...randBiyaya, id: `${randBiyaya.id}_${Date.now()}` });
            room.chatMessages.push({
              id: `pag_win_${Date.now()}`,
              sender: bot.name,
              text: `✅ Nasagot nang tama ang Pagsubok! (${card.answer}) Nakatanggap ng Biyaya card.`,
              timestamp: Date.now(),
              type: 'card',
            });
          } else {
            bot.skipNextTurn = true;
            room.chatMessages.push({
              id: `pag_fail_${Date.now()}`,
              sender: bot.name,
              text: `❌ Nabigo sa Pagsubok. Mawawalan ng susunod na tira.`,
              timestamp: Date.now(),
              type: 'system',
            });
          }
          advanceTurn(room);
        }
      }, 1800);
      return;
    } else if (tile.type === 'kapalaran') {
      const kapCards = CANONICAL_KAPALARAN_CARDS;
      const card = kapCards[Math.floor(Math.random() * kapCards.length)];
      room.activeEventCard = card;
      room.turnPhase = 'tile_event';
      broadcastRoom(room);

      setTimeout(() => {
        if (room.turnPhase === 'tile_event' && room.activeEventCard?.id === card.id) {
          const choiceIdx = botChooseKapalaranIndex(card);
          const choice = card.choices?.[choiceIdx];
          if (choice) {
            const effectRes = executeCardEffects(
              { ...card, effects: choice.effects },
              bot.id,
              undefined,
              room,
              CANONICAL_BIYAYA_CARDS
            );
            room = effectRes.updatedRoom;
            room.chatMessages.push({
              id: `kap_res_${Date.now()}`,
              sender: bot.name,
              text: `⚖️ Pinili ang: "${choice.label}" — ${choice.text}`,
              timestamp: Date.now(),
              type: 'card',
            });
          }
          advanceTurn(room);
        }
      }, 1800);
      return;
    }

    // Play optional Biyaya card if beneficial
    const botCardPlay = botChooseBiyayaCard(bot, room);
    if (botCardPlay) {
      const playedCard = bot.hand.splice(botCardPlay.cardIndex, 1)[0];
      const effectRes = executeCardEffects(
        playedCard,
        bot.id,
        botCardPlay.targetPlayerId,
        room,
        CANONICAL_BIYAYA_CARDS
      );
      room = effectRes.updatedRoom;
      room.chatMessages.push({
        id: `card_play_${Date.now()}`,
        sender: bot.name,
        text: `🎴 Ginamit ang Biyaya card: "${playedCard.title}"!`,
        timestamp: Date.now(),
        type: 'card',
      });
    }

    // End bot turn
    setTimeout(() => {
      advanceTurn(room);
    }, 1200);
  }, 1000);
}

// REST API Endpoints for Vercel Serverless & Client Fallback
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/rooms', (_req: Request, res: Response) => {
  const roomList = Array.from(rooms.values()).map(r => ({
    code: r.code,
    name: r.name,
    playerCount: r.players.length,
    maxPlayers: r.maxPlayers,
    status: r.status,
  }));
  res.json(roomList);
});

app.get('/api/rooms/:code', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const room = rooms.get(code);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

app.post('/api/rooms', (req: Request, res: Response) => {
  const { name, hostName, hostAvatar, maxPlayers } = req.body || {};
  const code = generateRoomCode();
  const { room, hostId } = createInitialRoom(code, name, hostName, hostAvatar, maxPlayers);
  res.json({ room, hostId });
});

app.post('/api/rooms/:code/join', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  const { name, avatar } = req.body || {};
  const room = rooms.get(code);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  if (room.status !== 'lobby') {
    return res.status(400).json({ error: 'Game already in progress' });
  }
  if (room.players.length >= room.maxPlayers) {
    return res.status(400).json({ error: 'Room is full' });
  }

  const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newPlayer: PlayerState = {
    id: playerId,
    name: name || `Pilgrim ${room.players.length + 1}`,
    avatar: avatar || DEFAULT_CHARACTER_AVATARS[room.players.length % DEFAULT_CHARACTER_AVATARS.length].url,
    isHost: false,
    isBot: false,
    role: 'aninag',
    currentTile: 0,
    hand: [],
    hasUsedAccusation: false,
    hasShield: false,
    skipNextTurn: false,
    halveNextRoll: false,
    isBlockedRound: false,
    isEliminated: false,
  };

  room.players.push(newPlayer);
  room.chatMessages.push({
    id: `join_${Date.now()}`,
    sender: 'DIWA',
    text: `Sumali si ${newPlayer.name} sa silid.`,
    timestamp: Date.now(),
    type: 'system',
  });

  broadcastRoom(room);
  res.json({ room, playerId });
});

// Room actions endpoint (Roll, Move, Play Card, Chat, Bot Fill, Accuse, Gate Vote)
app.post('/api/rooms/:code/action', (req: Request, res: Response) => {
  const code = (req.params.code || '').toUpperCase();
  let room = rooms.get(code);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const { action, playerId, payload } = req.body || {};
  const player = room.players.find(p => p.id === playerId);

  switch (action) {
    case 'START_GAME': {
      if (player && player.isHost) {
        startGameInRoom(room);
        broadcastRoom(room);
      }
      break;
    }

    case 'ADD_BOT': {
      if (player && player.isHost && room.players.length < room.maxPlayers && room.status === 'lobby') {
        const botIndex = room.players.length;
        const botAvatars = DEFAULT_CHARACTER_AVATARS;
        const botAvatar = botAvatars[botIndex % botAvatars.length];
        const botPlayer: PlayerState = {
          id: `bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: `${botAvatar.name} (AI)`,
          avatar: botAvatar.url,
          isHost: false,
          isBot: true,
          role: 'aninag',
          currentTile: 0,
          hand: [],
          hasUsedAccusation: false,
          hasShield: false,
          skipNextTurn: false,
          halveNextRoll: false,
          isBlockedRound: false,
          isEliminated: false,
        };
        room.players.push(botPlayer);
        room.chatMessages.push({
          id: `bot_add_${Date.now()}`,
          sender: 'DIWA',
          text: `Idinagdag si ${botPlayer.name} bilang AI kasama.`,
          timestamp: Date.now(),
          type: 'system',
        });
        broadcastRoom(room);
      }
      break;
    }

    case 'REMOVE_PLAYER': {
      if (player && player.isHost && room.status === 'lobby' && payload?.targetPlayerId) {
        room.players = room.players.filter(p => p.id !== payload.targetPlayerId);
        broadcastRoom(room);
      }
      break;
    }

    case 'ROLL_DICE': {
      if (player && room.status === 'playing' && room.players[room.currentTurnIndex]?.id === playerId && room.turnPhase === 'roll') {
        let roll = Math.floor(Math.random() * 6) + 1;
        if (player.halveNextRoll) {
          roll = Math.max(1, Math.floor(roll / 2));
          player.halveNextRoll = false;
        }
        room.activeDiceRoll = roll;

        const { finalTile, stoppedAtGate } = calculateClampedMovement(
          player.currentTile,
          roll,
          room.diwalingGatesUnlocked
        );
        player.currentTile = finalTile;

        room.chatMessages.push({
          id: `roll_${Date.now()}`,
          sender: player.name,
          text: `🎲 Gumulong ng ${roll}! Lumipat sa Tile #${finalTile}.`,
          timestamp: Date.now(),
          type: 'system',
        });

        // Check Victory
        if (finalTile >= 50) {
          room.status = 'ended';
          room.winner = player.role === 'impostor' ? 'impostor' : 'aninag';
          room.chatMessages.push({
            id: `win_${Date.now()}`,
            sender: 'DIWA',
            text: `🏆 Nakarating si ${player.name} sa Aetherya! Tagumpay ng mga ${room.winner.toUpperCase()}!`,
            timestamp: Date.now(),
            type: 'system',
          });
          broadcastRoom(room);
          break;
        }

        const tile = CANONICAL_BOARD_TILES[finalTile] || CANONICAL_BOARD_TILES[0];

        if (stoppedAtGate || (tile.type === 'pintuan' && !room.diwalingGatesUnlocked[tile.realm])) {
          const gateRealm = stoppedAtGate || tile.realm;
          room.activeGateRealm = gateRealm;
          room.turnPhase = 'gate_challenge';
          const pahiwatigCards = CANONICAL_PAHIWATIG_CARDS;
          room.activeEventCard = pahiwatigCards[Math.floor(Math.random() * pahiwatigCards.length)];
          room.gateVotes = [];
        } else if (tile.type === 'pagsubok') {
          room.turnPhase = 'tile_event';
          const pagCards = CANONICAL_PAGSUBOK_CARDS;
          room.activeEventCard = pagCards[Math.floor(Math.random() * pagCards.length)];
        } else if (tile.type === 'kapalaran') {
          room.turnPhase = 'tile_event';
          const kapCards = CANONICAL_KAPALARAN_CARDS;
          room.activeEventCard = kapCards[Math.floor(Math.random() * kapCards.length)];
        } else {
          // Normal Daan tile -> player can optionally play Biyaya or end turn
          room.turnPhase = 'action';
        }

        broadcastRoom(room);
      }
      break;
    }

    case 'ANSWER_PAGSUBOK': {
      if (room.status === 'playing' && room.activeEventCard && room.turnPhase === 'tile_event' && player) {
        const { answer } = payload || {};
        const card = room.activeEventCard;
        const isCorrect = 
          card.answer?.toLowerCase().includes((answer || '').toLowerCase()) ||
          card.options?.find(o => o.toLowerCase() === (answer || '').toLowerCase()) === card.answer;

        if (isCorrect) {
          const randBiyaya = CANONICAL_BIYAYA_CARDS[Math.floor(Math.random() * CANONICAL_BIYAYA_CARDS.length)];
          player.hand.push({ ...randBiyaya, id: `${randBiyaya.id}_${Date.now()}` });
          room.chatMessages.push({
            id: `ans_ok_${Date.now()}`,
            sender: player.name,
            text: `✅ Tama ang sagot sa Pagsubok! (${card.answer}). Nakatanggap ng Biyaya card!`,
            timestamp: Date.now(),
            type: 'card',
          });
        } else {
          player.skipNextTurn = true;
          room.chatMessages.push({
            id: `ans_fail_${Date.now()}`,
            sender: player.name,
            text: `❌ Maling sagot sa Pagsubok ("${answer}"). Ang tamang sagot ay: ${card.answer}. Mawawalan ng 1 tira.`,
            timestamp: Date.now(),
            type: 'system',
          });
        }
        advanceTurn(room);
      }
      break;
    }

    case 'CHOOSE_KAPALARAN': {
      if (room.status === 'playing' && room.activeEventCard && room.turnPhase === 'tile_event' && player) {
        const { choiceIndex } = payload || {};
        const card = room.activeEventCard;
        const choice = card.choices?.[choiceIndex];
        if (choice) {
          const effectRes = executeCardEffects(
            { ...card, effects: choice.effects },
            player.id,
            undefined,
            room,
            CANONICAL_BIYAYA_CARDS
          );
          room = effectRes.updatedRoom;
          rooms.set(code, room);
          room.chatMessages.push({
            id: `kap_pick_${Date.now()}`,
            sender: player.name,
            text: `⚖️ Pinili: "${choice.label}" — ${choice.text}`,
            timestamp: Date.now(),
            type: 'card',
          });
        }
        advanceTurn(room);
      }
      break;
    }

    case 'VOTE_GATE': {
      if (room.status === 'playing' && room.turnPhase === 'gate_challenge' && room.activeEventCard && room.activeGateRealm) {
        const { suspectedPlayerId } = payload || {};
        if (!room.gateVotes) room.gateVotes = [];
        room.gateVotes.push({ playerId, suspectedPlayerId });

        // If all human players voted, evaluate
        const humanPlayers = room.players.filter(p => !p.isBot);
        if (room.gateVotes.length >= humanPlayers.length) {
          const matchingId = room.activeEventCard.matchingSumpaId;
          const actualCurseHolder = room.players.find(p => p.sumpaCard?.id === matchingId);

          // Count votes
          const voteCounts: Record<string, number> = {};
          room.gateVotes.forEach(v => {
            voteCounts[v.suspectedPlayerId] = (voteCounts[v.suspectedPlayerId] || 0) + 1;
          });
          const votedTarget = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

          if (votedTarget === actualCurseHolder?.id) {
            room.diwalingGatesUnlocked[room.activeGateRealm] = true;
            room.chatMessages.push({
              id: `gate_success_${Date.now()}`,
              sender: 'DIWA',
              text: `🌟 Tama ang hinala ng grupo! Nabuksan ang Pintuan ng Diwaling sa ${room.activeGateRealm.toUpperCase()}!`,
              timestamp: Date.now(),
              type: 'system',
            });
          } else {
            room.chatMessages.push({
              id: `gate_fail_${Date.now()}`,
              sender: 'DIWA',
              text: `⚠️ Hindi nagtagumpay sa pahiwatig ng Diwaling. Mananatiling sarado ang tarangkahan para sa tirang ito.`,
              timestamp: Date.now(),
              type: 'system',
            });
          }
          advanceTurn(room);
        } else {
          broadcastRoom(room);
        }
      }
      break;
    }

    case 'PLAY_BIYAYA': {
      if (room.status === 'playing' && player && payload?.cardId) {
        const cardIdx = player.hand.findIndex(c => c.id === payload.cardId);
        if (cardIdx !== -1) {
          const playedCard = player.hand.splice(cardIdx, 1)[0];
          const effectRes = executeCardEffects(
            playedCard,
            player.id,
            payload.targetPlayerId,
            room,
            CANONICAL_BIYAYA_CARDS
          );
          room = effectRes.updatedRoom;
          rooms.set(code, room);
          room.chatMessages.push({
            id: `biyaya_play_${Date.now()}`,
            sender: player.name,
            text: `🎴 Ginamit ang Biyaya: "${playedCard.title}"!`,
            timestamp: Date.now(),
            type: 'card',
          });
          broadcastRoom(room);
        }
      }
      break;
    }

    case 'END_TURN': {
      if (room.status === 'playing' && room.players[room.currentTurnIndex]?.id === playerId) {
        advanceTurn(room);
      }
      break;
    }

    case 'ACCUSE_IMPOSTOR': {
      if (room.status === 'playing' && player && !player.hasUsedAccusation && payload?.targetPlayerId) {
        player.hasUsedAccusation = true;
        const target = room.players.find(p => p.id === payload.targetPlayerId);
        if (target) {
          const isCorrect = target.role === 'impostor';
          if (isCorrect) {
            // Accuser teleports to Aetherya and gets reward card, Impostor eliminated
            player.currentTile = 50;
            target.isEliminated = true;
            room.chatMessages.push({
              id: `accuse_win_${Date.now()}`,
              sender: 'DIWA',
              text: `🚨 TAMA ANG PARATANG! Si ${target.name} nga ang IMPOSTOR! Si ${player.name} ay agad na narating ang Aetherya!`,
              timestamp: Date.now(),
              type: 'accusation',
            });
            // Check victory
            room.status = 'ended';
            room.winner = 'aninag';
          } else {
            // Accuser returns to start tile and is blocked for 1 round
            player.currentTile = 0;
            player.skipNextTurn = true;
            room.chatMessages.push({
              id: `accuse_fail_${Date.now()}`,
              sender: 'DIWA',
              text: `⚠️ MALI ANG PARATANG! Si ${target.name} ay inosenteng Aninag! Si ${player.name} ay bumalik sa simula at hindi makatitira sa susunod na round.`,
              timestamp: Date.now(),
              type: 'accusation',
            });
          }
          broadcastRoom(room);
        }
      }
      break;
    }

    case 'SEND_CHAT': {
      if (player && payload?.text) {
        room.chatMessages.push({
          id: `chat_${Date.now()}`,
          sender: player.name,
          text: payload.text.slice(0, 200),
          timestamp: Date.now(),
          type: 'chat',
        });
        broadcastRoom(room);
      }
      break;
    }

    default:
      break;
  }

  res.json(room);
});

// Admin API
app.get('/api/admin/settings', (_req: Request, res: Response) => {
  res.json(currentAdminSettings);
});

app.post('/api/admin/settings', (req: Request, res: Response) => {
  const { password, settings } = req.body || {};
  if (password !== currentAdminSettings.systemPassword) {
    return res.status(401).json({ error: 'Maling password ng Admin' });
  }
  if (settings) {
    currentAdminSettings = { ...currentAdminSettings, ...settings };
  }
  res.json({ success: true, settings: currentAdminSettings });
});

// Setup WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const urlParams = new URL(req.url || '', `http://${req.headers.host}`).searchParams;
  const roomCode = (urlParams.get('room') || '').toUpperCase();

  if (roomCode) {
    if (!roomSockets.has(roomCode)) {
      roomSockets.set(roomCode, new Set());
    }
    roomSockets.get(roomCode)!.add(ws);

    const room = rooms.get(roomCode);
    if (room) {
      ws.send(JSON.stringify({ type: 'ROOM_STATE_UPDATE', room }));
    }
  }

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG' }));
      }
    } catch {}
  });

  ws.on('close', () => {
    if (roomCode && roomSockets.has(roomCode)) {
      roomSockets.get(roomCode)!.delete(ws);
    }
  });
});

// Vite Middleware for Dev Mode & Static Build Serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Athanasia Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Athanasia Server Error]', err);
});
