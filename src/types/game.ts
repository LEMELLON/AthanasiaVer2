/**
 * Core Type Definitions for ATHANASIA: Ang Hiwaga ng Diwa
 */

export type CardDeckType = 
  | 'role' 
  | 'sumpa' 
  | 'pahiwatig' 
  | 'pagsubok' 
  | 'biyaya' 
  | 'kapalaran' 
  | 'accusation';

export type RealmType = 'talvaris' | 'alabarya' | 'alonawon' | 'himaraya' | 'aetherya';

export type TileShape = 'pentagon' | 'triangle' | 'sanctuary';

export type TileType = 'pintuan' | 'daan' | 'pagsubok' | 'kapalaran' | 'aetherya';

export type PagsubokCategory = 
  | 'bugtong' 
  | 'sagisag' 
  | 'kasabihan' 
  | 'speed_trivia' 
  | 'tongue_twister' 
  | 'idiom';

export type CardEffectType = 
  | 'MOVE_FORWARD'
  | 'MOVE_BACKWARD'
  | 'DRAW_BIYAYA'
  | 'DISCARD_BIYAYA'
  | 'SKIP_TURN'
  | 'EXTRA_TURN'
  | 'ANTING_ANTING_SHIELD'
  | 'SWAP_PLAYERS_SAME_REALM'
  | 'SWAP_PLAYER_FURTHEST'
  | 'HALVE_NEXT_ROLL'
  | 'PEEK_PAHIWATIG'
  | 'AUTO_CORRECT_PAGSUBOK'
  | 'TELEPORT_REALM_START';

export interface CardEffect {
  type: CardEffectType;
  value?: number;
  target?: 'self' | 'target_player' | 'all_opponents' | 'adjacent_player';
  condition?: string;
  description: string;
}

export interface ChoiceOption {
  label: string;
  text: string;
  effects: CardEffect[];
}

export interface GameCard {
  id: string;
  deck: CardDeckType;
  title: string;
  subtitle?: string;
  realm?: RealmType | 'all';
  category?: PagsubokCategory | 'action' | 'curse' | 'clue' | 'role';
  flavorText?: string;
  question?: string;
  answer?: string;
  options?: string[]; // for quiz/trivia choices
  choices?: ChoiceOption[]; // for Kapalaran choices
  effects?: CardEffect[]; // for Biyaya or triggered effects
  hint?: string; // for Sumpa cards
  matchingSumpaId?: string; // for Pahiwatig cards
  artworkUrl?: string;
  custom?: boolean;
}

export interface BoardTile {
  index: number; // 0 (start) to 50 (Aetherya)
  realm: RealmType;
  shape: TileShape;
  type: TileType;
  title: string;
  description?: string;
  guardianName?: string;
  gridX: number; // coordinate for visual layout
  gridY: number;
  orientation?: 'up' | 'down'; // triangular orientation
  posX?: number; // canvas X (0 - 1200)
  posY?: number; // canvas Y (0 - 700)
}

export interface RealmTerritory {
  realm: RealmType;
  name: string;
  path: string; // SVG path
  labelX: number;
  labelY: number;
  color: string;
}

export interface TileMapData {
  id: string;
  name: string;
  description: string;
  author: string;
  createdAt: number;
  updatedAt: number;
  tiles: BoardTile[];
  territories?: RealmTerritory[];
}

export interface PilgrimProfile {
  playerName: string;
  characterName: string;
  avatarUrl: string;
}

export interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isBot: boolean;
  role: 'aninag' | 'impostor';
  currentTile: number; // 0 to 50
  hand: GameCard[]; // Biyaya cards held secretly
  sumpaCard?: GameCard; // Secret Sumpa card
  hasUsedAccusation: boolean;
  hasShield: boolean;
  skipNextTurn: boolean;
  halveNextRoll: boolean;
  isBlockedRound: boolean;
  isEliminated: boolean;
}

export type TurnPhase = 
  | 'roll' 
  | 'moving' 
  | 'tile_event' 
  | 'action' 
  | 'gate_challenge' 
  | 'accusation' 
  | 'ended';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  type: 'chat' | 'system' | 'accusation' | 'card';
}

export interface GateVote {
  playerId: string;
  suspectedPlayerId: string;
}

export interface ImpostorAccusationEvent {
  accuserPlayerId: string;
  accusedPlayerId: string;
  accusedRole: 'aninag' | 'impostor';
  isSuccess: boolean;
}

export interface GameRoom {
  code: string;
  name: string;
  hostId: string;
  maxPlayers: number;
  status: 'lobby' | 'playing' | 'ended';
  players: PlayerState[];
  currentTurnIndex: number;
  turnTimeLimit: number;
  turnSecondsRemaining: number;
  turnPhase: TurnPhase;
  activeDiceRoll?: number;
  activeEventCard?: GameCard;
  activeGateRealm?: RealmType;
  gateVotes?: GateVote[];
  activeAccusation?: ImpostorAccusationEvent;
  chatMessages: ChatMessage[];
  diwalingGatesUnlocked: Record<RealmType, boolean>;
  winner?: 'aninag' | 'impostor';
  historyLog: string[];
  cardsDataVersion: number;
  mapId?: string;
  mapData?: TileMapData;
  viewMode?: 'tile_map' | 'simple_track';
}

export interface AdminSettings {
  systemPassword: string;
  characterAvatars: { id: string; name: string; url: string }[];
  realmBackgrounds: Record<RealmType, string>;
  cardFrameStyle: 'ancient' | 'minimal' | 'gilded';
  cards: GameCard[];
}
