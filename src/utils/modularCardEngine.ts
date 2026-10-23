import { BoardTile, CardEffect, GameCard, GameRoom, PlayerState, RealmType } from '../types/game';

export function getPlayerRealm(tileIndex: number): RealmType {
  if (tileIndex <= 17) return 'talvaris';
  if (tileIndex <= 31) return 'alabarya';
  if (tileIndex <= 42) return 'alonawon';
  if (tileIndex <= 49) return 'himaraya';
  return 'aetherya';
}

export function isGateTile(tileIndex: number): { isGate: boolean; realm?: RealmType } {
  if (tileIndex === 1) return { isGate: true, realm: 'talvaris' };
  if (tileIndex === 18) return { isGate: true, realm: 'alabarya' };
  if (tileIndex === 32) return { isGate: true, realm: 'alonawon' };
  if (tileIndex === 43) return { isGate: true, realm: 'himaraya' };
  return { isGate: false };
}

/**
 * Checks if a player's movement would be blocked by an unopened Diwaling gate.
 * If blocked, stops the player exactly at the gate tile.
 */
export function calculateClampedMovement(
  currentTile: number,
  delta: number,
  gatesUnlocked: Record<RealmType, boolean>,
  customTiles?: BoardTile[]
): { finalTile: number; stoppedAtGate?: RealmType } {
  const maxTile = customTiles && customTiles.length > 0 ? customTiles[customTiles.length - 1].index : 50;
  let target = currentTile + delta;
  if (target < 0) target = 0;
  if (target > maxTile) target = maxTile;

  // Determine gates from map tiles or canonical defaults
  const gateMap: { index: number; realm: RealmType }[] = [];
  if (customTiles && customTiles.length > 0) {
    customTiles.forEach(t => {
      if (t.type === 'pintuan') {
        gateMap.push({ index: t.index, realm: t.realm });
      }
    });
  } else {
    gateMap.push(
      { index: 1, realm: 'talvaris' },
      { index: 18, realm: 'alabarya' },
      { index: 32, realm: 'alonawon' },
      { index: 43, realm: 'himaraya' }
    );
  }

  gateMap.sort((a, b) => a.index - b.index);

  // Check realm gates on forward movement
  if (delta > 0) {
    for (const gate of gateMap) {
      if (currentTile < gate.index && target >= gate.index && !gatesUnlocked[gate.realm]) {
        return { finalTile: gate.index, stoppedAtGate: gate.realm };
      }
    }
  }

  return { finalTile: target };
}

/**
 * Resolves an individual modular card effect on the game state.
 */
export function applyModularCardEffect(
  effect: CardEffect,
  sourcePlayerId: string,
  targetPlayerId: string | undefined,
  room: GameRoom,
  biyayaDeckPool: GameCard[]
): { updatedRoom: GameRoom; logs: string[] } {
  const roomClone: GameRoom = JSON.parse(JSON.stringify(room));
  const logs: string[] = [];

  const sourceIndex = roomClone.players.findIndex(p => p.id === sourcePlayerId);
  if (sourceIndex === -1) return { updatedRoom: room, logs };

  let targetIndex = sourceIndex;
  if (effect.target === 'target_player' && targetPlayerId) {
    const foundIdx = roomClone.players.findIndex(p => p.id === targetPlayerId);
    if (foundIdx !== -1) targetIndex = foundIdx;
  }

  const sourcePlayer = roomClone.players[sourceIndex];
  const targetPlayer = roomClone.players[targetIndex];

  // Negative effect defense check with Anting-Anting Shield
  const isNegativeEffect = 
    effect.type === 'MOVE_BACKWARD' || 
    effect.type === 'DISCARD_BIYAYA' || 
    effect.type === 'SKIP_TURN' || 
    effect.type === 'HALVE_NEXT_ROLL';

  if (isNegativeEffect && targetPlayer.hasShield && targetIndex !== sourceIndex) {
    targetPlayer.hasShield = false;
    logs.push(`🛡️ Nasangga ng Kalasag (Anting-Anting) ni ${targetPlayer.name} ang epekto ng baraha!`);
    roomClone.chatMessages.push({
      id: `sys_${Date.now()}_${Math.random()}`,
      sender: 'DIWA',
      text: `🛡️ Nasangga ng Kalasag ni ${targetPlayer.name} ang epekto!`,
      timestamp: Date.now(),
      type: 'system',
    });
    return { updatedRoom: roomClone, logs };
  }

  switch (effect.type) {
    case 'MOVE_FORWARD': {
      const val = effect.value || 1;
      const { finalTile, stoppedAtGate } = calculateClampedMovement(
        targetPlayer.currentTile,
        val,
        roomClone.diwalingGatesUnlocked
      );
      targetPlayer.currentTile = finalTile;
      logs.push(`${targetPlayer.name} ay sumulong ng ${val} hakbang (Nasa Tile ${finalTile}).`);
      if (stoppedAtGate) {
        logs.push(`⚠️ Nahinto sa Pintuan ng ${stoppedAtGate.toUpperCase()} dahil nakakandado pa ang Diwaling gate!`);
      }
      break;
    }

    case 'MOVE_BACKWARD': {
      const val = effect.value || 1;
      let newTile = targetPlayer.currentTile - val;
      if (newTile < 0) newTile = 0;
      targetPlayer.currentTile = newTile;
      logs.push(`${targetPlayer.name} ay napaatras ng ${val} hakbang (Nasa Tile ${newTile}).`);
      break;
    }

    case 'DRAW_BIYAYA': {
      const count = effect.value || 1;
      for (let i = 0; i < count; i++) {
        const randCard = biyayaDeckPool[Math.floor(Math.random() * biyayaDeckPool.length)];
        if (randCard) {
          targetPlayer.hand.push({ ...randCard, id: `${randCard.id}_${Date.now()}_${Math.random()}` });
        }
      }
      logs.push(`${targetPlayer.name} ay nakatanggap ng ${count} Biyaya card.`);
      break;
    }

    case 'DISCARD_BIYAYA': {
      const count = effect.value || 1;
      for (let i = 0; i < count; i++) {
        if (targetPlayer.hand.length > 0) {
          targetPlayer.hand.pop();
        }
      }
      logs.push(`${targetPlayer.name} ay nagtapon ng ${count} Biyaya card.`);
      break;
    }

    case 'SKIP_TURN': {
      targetPlayer.skipNextTurn = true;
      logs.push(`${targetPlayer.name} ay mawawalan ng susunod na tira (Skipped)!`);
      break;
    }

    case 'EXTRA_TURN': {
      // Set turn index to stay on current player for another roll
      logs.push(`✨ ${sourcePlayer.name} ay nakakuha ng dagdag na tira agad!`);
      break;
    }

    case 'ANTING_ANTING_SHIELD': {
      targetPlayer.hasShield = true;
      logs.push(`🛡️ Nagkaroon ng Kalasag (Anting-Anting Shield) si ${targetPlayer.name}!`);
      break;
    }

    case 'SWAP_PLAYERS_SAME_REALM': {
      // Find eligible target in same realm
      const sourceRealm = getPlayerRealm(sourcePlayer.currentTile);
      let swapped = false;
      for (let i = 0; i < roomClone.players.length; i++) {
        if (i !== sourceIndex && getPlayerRealm(roomClone.players[i].currentTile) === sourceRealm) {
          const tempTile = sourcePlayer.currentTile;
          sourcePlayer.currentTile = roomClone.players[i].currentTile;
          roomClone.players[i].currentTile = tempTile;
          logs.push(`🔄 Nagpalit ng pwesto si ${sourcePlayer.name} at si ${roomClone.players[i].name} sa lupain ng ${sourceRealm.toUpperCase()}!`);
          swapped = true;
          break;
        }
      }
      if (!swapped) {
        logs.push(`Walang ibang manlalaro sa parehong lupain para sa Palit-Pwesto.`);
      }
      break;
    }

    case 'SWAP_PLAYER_FURTHEST': {
      // Swap with player furthest behind
      let minTile = 999;
      let furthestIdx = -1;
      for (let i = 0; i < roomClone.players.length; i++) {
        if (i !== sourceIndex && roomClone.players[i].currentTile < minTile) {
          minTile = roomClone.players[i].currentTile;
          furthestIdx = i;
        }
      }
      if (furthestIdx !== -1) {
        const temp = sourcePlayer.currentTile;
        sourcePlayer.currentTile = roomClone.players[furthestIdx].currentTile;
        roomClone.players[furthestIdx].currentTile = temp;
        logs.push(`🔄 Nakipagpalit ng pwesto si ${sourcePlayer.name} sa pinakahuling manlalaro (${roomClone.players[furthestIdx].name}).`);
      }
      break;
    }

    case 'HALVE_NEXT_ROLL': {
      targetPlayer.halveNextRoll = true;
      logs.push(`Mababawasan sa kalahati ang susunod na roll ni ${targetPlayer.name}.`);
      break;
    }

    case 'PEEK_PAHIWATIG': {
      logs.push(`👁️ Nasilip ni ${sourcePlayer.name} ang susunod na Pahiwatig ng Diwaling.`);
      break;
    }

    case 'AUTO_CORRECT_PAGSUBOK': {
      logs.push(`🧠 Ang susunod na Pagsubok ni ${sourcePlayer.name} ay awtomatikong magiging tama!`);
      break;
    }

    case 'TELEPORT_REALM_START': {
      const realm = getPlayerRealm(targetPlayer.currentTile);
      let realmStart = 1;
      if (realm === 'alabarya') realmStart = 18;
      if (realm === 'alonawon') realmStart = 32;
      if (realm === 'himaraya') realmStart = 43;
      targetPlayer.currentTile = realmStart;
      logs.push(`Bumalik si ${targetPlayer.name} sa unang tile ng ${realm.toUpperCase()} (Tile ${realmStart}).`);
      break;
    }

    default:
      break;
  }

  return { updatedRoom: roomClone, logs };
}

/**
 * Executes all stacked modular effects on a card sequentially.
 */
export function executeCardEffects(
  card: GameCard,
  sourcePlayerId: string,
  targetPlayerId: string | undefined,
  room: GameRoom,
  biyayaDeckPool: GameCard[]
): { updatedRoom: GameRoom; logs: string[] } {
  let currentRoom = room;
  const allLogs: string[] = [];

  if (card.effects && card.effects.length > 0) {
    for (const eff of card.effects) {
      const res = applyModularCardEffect(eff, sourcePlayerId, targetPlayerId, currentRoom, biyayaDeckPool);
      currentRoom = res.updatedRoom;
      allLogs.push(...res.logs);
    }
  }

  return { updatedRoom: currentRoom, logs: allLogs };
}
