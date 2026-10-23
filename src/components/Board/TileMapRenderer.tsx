import React from 'react';
import { BoardTile, GameRoom, PlayerState, RealmType, TileMapData } from '../../types/game';
import { CANONICAL_MAP_DATA } from '../../data/canonicalMap';
import { Shield, Lock, Unlock, HelpCircle, Shuffle, Footprints, Crown, Sparkles, Flame, Droplets, Wind, Mountain } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface TileMapRendererProps {
  mapData?: TileMapData;
  room: GameRoom;
  currentPlayer: PlayerState | null;
  selectedTile: BoardTile | null;
  onSelectTile: (tile: BoardTile) => void;
}

export const TileMapRenderer: React.FC<TileMapRendererProps> = ({
  mapData = CANONICAL_MAP_DATA,
  room,
  currentPlayer,
  selectedTile,
  onSelectTile,
}) => {
  const tiles = mapData.tiles || CANONICAL_MAP_DATA.tiles;
  const territories = mapData.territories || CANONICAL_MAP_DATA.territories || [];

  // Determine dynamic canvas bounds based on tile coordinates
  const isLargeLattice = tiles.some(t => (t.posX ?? 0) > 1120 || (t.posY ?? 0) > 670);
  const viewWidth = isLargeLattice ? 1750 : 1160;
  const viewHeight = isLargeLattice ? 1750 : 700;
  const sizeMult = isLargeLattice ? 1.45 : 1.0;

  // Realm styling palette
  const realmTheme: Record<RealmType, { border: string; fill: string; glow: string; text: string; icon: any }> = {
    talvaris: {
      border: '#059669',
      fill: '#064e3b',
      glow: 'rgba(5, 150, 105, 0.5)',
      text: '#6ee7b7',
      icon: Mountain,
    },
    alabarya: {
      border: '#dc2626',
      fill: '#7f1d1d',
      glow: 'rgba(220, 38, 38, 0.5)',
      text: '#fca5a5',
      icon: Flame,
    },
    alonawon: {
      border: '#0284c7',
      fill: '#0c4a6e',
      glow: 'rgba(2, 132, 199, 0.5)',
      text: '#7dd3fc',
      icon: Droplets,
    },
    himaraya: {
      border: '#7c3aed',
      fill: '#4c1d95',
      glow: 'rgba(124, 58, 237, 0.5)',
      text: '#c4b5fd',
      icon: Wind,
    },
    aetherya: {
      border: '#eab308',
      fill: '#78350f',
      glow: 'rgba(234, 179, 8, 0.7)',
      text: '#fef08a',
      icon: Crown,
    },
  };

  // Helper to generate triangle SVG polygon points
  const getTrianglePoints = (cx: number, cy: number, orientation: 'up' | 'down' = 'up', size = 24 * sizeMult): string => {
    const h = size * 1.15;
    const w = size * 1.15;
    if (orientation === 'up') {
      return `${cx},${cy - h} ${cx - w},${cy + h * 0.7} ${cx + w},${cy + h * 0.7}`;
    } else {
      return `${cx},${cy + h} ${cx - w},${cy - h * 0.7} ${cx + w},${cy - h * 0.7}`;
    }
  };

  // Helper to generate regular hexagon SVG polygon points for gates & sanctuary
  const getHexagonPoints = (cx: number, cy: number, r = 30 * sizeMult): string => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  // Build sequential path line connecting each tile (0 -> 1 -> ... -> max)
  const sortedTiles = [...tiles].sort((a, b) => a.index - b.index);
  const pathD = sortedTiles.reduce((acc, t, idx) => {
    const x = t.posX ?? 100;
    const y = t.posY ?? 100;
    return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
  }, '');

  return (
    <div className="relative w-full overflow-x-auto select-none rounded-3xl bg-[#080c14] border border-amber-500/30 p-2 shadow-2xl">
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="w-full min-w-[900px] h-auto drop-shadow-xl"
        style={{ filter: 'contrast(1.05)' }}
      >
        <defs>
          {/* Radial Glows */}
          <radialGradient id="aetheryaSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#eab308" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="gateGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
          </radialGradient>
          {/* Animated Dashed Glow Filter */}
          <filter id="tileGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Territory Backgrounds */}
        {territories.map((terr) => (
          <g key={terr.realm}>
            <path
              d={terr.path}
              fill={terr.color}
              stroke={realmTheme[terr.realm].border}
              strokeWidth="1.5"
              strokeDasharray="4,4"
              opacity="0.55"
            />
            <text
              x={terr.labelX}
              y={terr.labelY}
              fill={realmTheme[terr.realm].text}
              fontSize={isLargeLattice ? "20" : "12"}
              fontFamily="Cinzel, serif"
              fontWeight="bold"
              letterSpacing="2"
              opacity="0.85"
            >
              {terr.name.toUpperCase()}
            </text>
          </g>
        ))}

        {/* 2. Connecting Energy Trail */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(245, 158, 11, 0.4)"
          strokeWidth={isLargeLattice ? "4.5" : "3.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6,4"
        />

        {/* 3. Render Each Tile */}
        {sortedTiles.map((tile) => {
          const cx = tile.posX ?? 100;
          const cy = tile.posY ?? 100;
          const isSelected = selectedTile?.index === tile.index;
          const theme = realmTheme[tile.realm];
          const isGate = tile.type === 'pintuan';
          const isAetherya = tile.type === 'aetherya';
          const isGateUnlocked = isGate && room.diwalingGatesUnlocked[tile.realm];

          // Players on this tile
          const playersHere = room.players.filter((p) => p.currentTile === tile.index && !p.isEliminated);
          const isCurrentTurnHere = room.players[room.currentTurnIndex]?.currentTile === tile.index;

          return (
            <g
              key={tile.index}
              onClick={() => {
                sounds.playClick();
                onSelectTile(tile);
              }}
              className="cursor-pointer transition-transform duration-300"
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              {/* Highlight Halo if selected or current turn */}
              {(isSelected || isCurrentTurnHere) && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={(isAetherya ? 48 : isGate ? 38 : 32) * sizeMult}
                  fill="none"
                  stroke={isSelected ? '#fbbf24' : '#60a5fa'}
                  strokeWidth="2.5"
                  strokeDasharray="4,3"
                  className="animate-spin"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* TILE SHAPE */}
              {isAetherya ? (
                /* AETHERYA SANCTUARY (Large Glowing Sun Hexagon) */
                <g>
                  <polygon
                    points={getHexagonPoints(cx, cy, 42 * sizeMult)}
                    fill="url(#aetheryaSun)"
                    stroke="#eab308"
                    strokeWidth="3.5"
                    filter="url(#tileGlow)"
                  />
                  <polygon
                    points={getHexagonPoints(cx, cy, 32 * sizeMult)}
                    fill="#451a03"
                    stroke="#fef08a"
                    strokeWidth="1.5"
                  />
                  <text
                    x={cx}
                    y={cy - 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fef08a"
                    fontSize={isLargeLattice ? "24" : "18"}
                  >
                    👑
                  </text>
                  <text
                    x={cx}
                    y={cy + (isLargeLattice ? 24 : 18)}
                    textAnchor="middle"
                    fill="#fde047"
                    fontSize={isLargeLattice ? "12" : "8"}
                    fontFamily="Cinzel, serif"
                    fontWeight="bold"
                  >
                    AETHERYA
                  </text>
                </g>
              ) : isGate ? (
                /* DIWALING GATE (Double-Bordered Hexagon) */
                <g>
                  <polygon
                    points={getHexagonPoints(cx, cy, 29 * sizeMult)}
                    fill={isGateUnlocked ? '#064e3b' : '#1e1b4b'}
                    stroke={isGateUnlocked ? '#10b981' : '#f59e0b'}
                    strokeWidth="2.5"
                    filter="url(#tileGlow)"
                  />
                  <polygon
                    points={getHexagonPoints(cx, cy, 23 * sizeMult)}
                    fill={isGateUnlocked ? '#047857' : '#0f172a'}
                    stroke={isGateUnlocked ? '#34d399' : '#d97706'}
                    strokeWidth="1"
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isGateUnlocked ? '#6ee7b7' : '#fbbf24'}
                    fontSize={isLargeLattice ? "16" : "12"}
                  >
                    {isGateUnlocked ? '🔓' : '🔒'}
                  </text>
                  <text
                    x={cx}
                    y={cy + (isLargeLattice ? 22 : 16)}
                    textAnchor="middle"
                    fill="#fcd34d"
                    fontSize={isLargeLattice ? "10" : "7"}
                    fontFamily="Cinzel, serif"
                    fontWeight="bold"
                  >
                    GATE #{tile.index}
                  </text>
                </g>
              ) : (
                /* TRIANGULAR TILES (Upright ▲ or Inverted ▼) */
                <g>
                  <polygon
                    points={getTrianglePoints(cx, cy, tile.orientation || 'up', 24 * sizeMult)}
                    fill={
                      tile.type === 'pagsubok'
                        ? '#2e1065'
                        : tile.type === 'kapalaran'
                        ? '#450a0a'
                        : '#0f172a'
                    }
                    stroke={
                      tile.type === 'pagsubok'
                        ? '#a855f7'
                        : tile.type === 'kapalaran'
                        ? '#ef4444'
                        : theme.border
                    }
                    strokeWidth="2.2"
                    filter={isSelected ? 'url(#tileGlow)' : undefined}
                    opacity="0.95"
                  />
                  {/* Inner Motif */}
                  <circle
                    cx={cx}
                    cy={tile.orientation === 'down' ? cy - 2 : cy + 2}
                    r={10 * sizeMult}
                    fill="rgba(15, 23, 42, 0.7)"
                    stroke="rgba(245, 158, 11, 0.3)"
                    strokeWidth="0.8"
                  />
                  <text
                    x={cx}
                    y={tile.orientation === 'down' ? cy - 1 : cy + 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={
                      tile.type === 'pagsubok'
                        ? '#e9d5ff'
                        : tile.type === 'kapalaran'
                        ? '#fecaca'
                        : '#cbd5e1'
                    }
                    fontSize={isLargeLattice ? "13" : "9"}
                    fontWeight="bold"
                  >
                    {tile.type === 'pagsubok'
                      ? '?'
                      : tile.type === 'kapalaran'
                      ? '✦'
                      : tile.index === 0
                      ? 'S'
                      : tile.index}
                  </text>
                </g>
              )}

              {/* TILE INDEX BADGE */}
              <text
                x={cx}
                y={tile.orientation === 'down' ? cy + (isLargeLattice ? 30 : 21) : cy - (isLargeLattice ? 27 : 19)}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={isLargeLattice ? "10" : "7"}
                fontFamily="monospace"
                fontWeight="bold"
              >
                #{tile.index}
              </text>

              {/* PLAYERS ON THIS TILE (SVG Tokens) */}
              {playersHere.length > 0 && (
                <g transform={`translate(${cx}, ${cy})`}>
                  {playersHere.map((p, pIdx) => {
                    const isPturn = room.players[room.currentTurnIndex]?.id === p.id;
                    const offset = (pIdx - (playersHere.length - 1) / 2) * (20 * sizeMult);
                    return (
                      <g
                        key={p.id}
                        transform={`translate(${offset}, ${-(30 * sizeMult)})`}
                        className={isPturn ? 'animate-bounce' : ''}
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r={13 * sizeMult}
                          fill="#0f172a"
                          stroke={isPturn ? '#f59e0b' : '#38bdf8'}
                          strokeWidth="2.5"
                        />
                        <clipPath id={`avatarClip_${p.id}_${tile.index}`}>
                          <circle cx="0" cy="0" r={12 * sizeMult} />
                        </clipPath>
                        <image
                          href={p.avatar}
                          x={-(12 * sizeMult)}
                          y={-(12 * sizeMult)}
                          width={24 * sizeMult}
                          height={24 * sizeMult}
                          clipPath={`url(#avatarClip_${p.id}_${tile.index})`}
                        />
                      </g>
                    );
                  })}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
