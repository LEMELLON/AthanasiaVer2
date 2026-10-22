import { GameRoom, PlayerState, GameCard } from '../types/game';

/**
 * Returns a simulated delay in milliseconds for AI bot actions so humans can follow along.
 */
export function getBotThinkingDelay(): number {
  return 800 + Math.floor(Math.random() * 800);
}

/**
 * Selects an answer for an AI bot during a Pagsubok Challenge.
 */
export function botChoosePagsubokAnswer(card: GameCard, isImpostor: boolean): string {
  if (card.options && card.options.length > 0) {
    // 75% chance of picking correct answer if Aninag, 50% if Impostor (to subtly sabotage or blend in)
    const accuracy = isImpostor ? 0.5 : 0.8;
    if (Math.random() < accuracy) {
      return card.answer || card.options[0];
    } else {
      // Pick a random option
      const wrongOpts = card.options.filter(opt => opt !== card.answer);
      if (wrongOpts.length > 0) {
        return wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
      }
      return card.options[Math.floor(Math.random() * card.options.length)];
    }
  }
  return card.answer || 'Tama';
}

/**
 * Selects Choice A or Choice B for an AI bot during a Kapalaran dilemma.
 */
export function botChooseKapalaranIndex(card: GameCard): number {
  if (!card.choices || card.choices.length === 0) return 0;
  // Bot prefers safe or reward-leaning choices
  return Math.random() < 0.6 ? 0 : 1;
}

/**
 * Selects which player the bot suspects holds the matching Sumpa during a Diwaling Gate.
 */
export function botChooseGateTarget(
  pahiwatigCard: GameCard,
  room: GameRoom,
  botPlayer: PlayerState
): string {
  const matchingSumpaId = pahiwatigCard.matchingSumpaId;

  // Check if any player actually holds this Sumpa
  const correctPlayer = room.players.find(p => p.sumpaCard?.id === matchingSumpaId);

  // Aninag bots have 70% deduction accuracy based on hints read at start
  // Impostor bots will vote for an innocent or bluff
  if (botPlayer.role === 'impostor') {
    const innocents = room.players.filter(p => p.id !== botPlayer.id);
    if (innocents.length > 0) {
      return innocents[Math.floor(Math.random() * innocents.length)].id;
    }
  } else if (correctPlayer && Math.random() < 0.75) {
    return correctPlayer.id;
  }

  // Fallback random other player
  const others = room.players.filter(p => p.id !== botPlayer.id);
  if (others.length > 0) {
    return others[Math.floor(Math.random() * others.length)].id;
  }
  return room.players[0].id;
}

/**
 * Determines if a bot should play a Biyaya card during its action phase.
 */
export function botChooseBiyayaCard(botPlayer: PlayerState, room: GameRoom): { cardIndex: number; targetPlayerId?: string } | null {
  if (!botPlayer.hand || botPlayer.hand.length === 0) return null;

  // Scan hand for immediately beneficial cards
  for (let i = 0; i < botPlayer.hand.length; i++) {
    const card = botPlayer.hand[i];
    
    // Shield if unshielded
    if (card.effects?.some(e => e.type === 'ANTING_ANTING_SHIELD') && !botPlayer.hasShield) {
      return { cardIndex: i };
    }

    // Forward movement or extra turn
    if (card.effects?.some(e => e.type === 'MOVE_FORWARD' || e.type === 'EXTRA_TURN' || e.type === 'DRAW_BIYAYA')) {
      return { cardIndex: i };
    }

    // Discard / backward movement on leading opponent
    if (card.effects?.some(e => e.type === 'MOVE_BACKWARD' || e.type === 'SKIP_TURN')) {
      // Find leading opponent
      let maxTile = -1;
      let leaderId = '';
      for (const p of room.players) {
        if (p.id !== botPlayer.id && p.currentTile > maxTile) {
          maxTile = p.currentTile;
          leaderId = p.id;
        }
      }
      if (leaderId) {
        return { cardIndex: i, targetPlayerId: leaderId };
      }
    }
  }

  return null;
}
