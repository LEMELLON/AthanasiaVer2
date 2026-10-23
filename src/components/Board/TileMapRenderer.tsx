import React from 'react';
import { BoardTile, GameRoom, PlayerState, RealmType, TileMapData } from '../../types/game';
import { CANONICAL_MAP_DATA } from '../../data/canonicalMap';
import { cellPts, hexPts } from '../../utils/aetheryaLattice';
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

  // Fallback triangle points generator if grid coordinates are not on lattice
  const getTrianglePoints = (cx: number, cy: number, orientation: 'up' | 'down' = 'up', size = 26 * sizeMult): string => {
    const h = size * 1.15;
    const w = size * 1.15;
    if (orientation === 'up') {
      return `${cx},${cy - h} ${cx - w},${cy + h * 0.7} ${cx + w},${cy + h * 0.7}`;
    } else {
      return `${cx},${cy + h} ${cx - w},${cy - h * 0.7} ${cx + w},${cy - h * 0.7}`;
    }
  };

  // Helper to generate regular hexagon SVG polygon points
  const getHexagonPoints = (cx: number, cy: number, r = 32 * sizeMult): string => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  // Build sequential energy trail connecting sorted tiles
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
          {/* Radial Realm Glows matching AetheryaMapCanvas */}
          <radialGradient id="renderTalvarisGlow" cx="20%" cy="15%" r="65%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.02" />
          </radialGradient>
          <radialGradient id="renderAlabaryaGlow" cx="80%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0.02" />
          </radialGradient>
          <radialGradient id="renderAlonawonGlow" cx="20%" cy="65%" r="65%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.02" />
          </radialGradient>
          <radialGradient id="renderHimarayaGlow" cx="80%" cy="90%" r="65%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2e1065" stopOpacity="0.02" />
          </radialGradient>
          <radialGradient id="renderAetheryaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#d97706" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0b0f17" stopOpacity="0.0" />
          </radialGradient>

          {/* Daan Slate/Navy Gradient */}
          <linearGradient id="renderDaanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Pagsubok Amethyst Gradient */}
          <linearGradient id="renderPagsubokGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="50%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>

          {/* Kapalaran Ruby Flame Gradient */}
          <linearGradient id="renderKapalaranGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="50%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>

          {/* Gate Hexagon Gradient */}
          <radialGradient id="renderGateGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#eab308" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#713f12" stopOpacity="0.85" />
          </radialGradient>

          {/* Finale Varyndor Hexagon Gradient */}
          <radialGradient id="renderFinaleGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fef9c3" stopOpacity="1" />
            <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.95" />
          </radialGradient>

          {/* Animated Glow Filter */}
          <filter id="tileGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Territory Backgrounds */}
        {territories.map((terr) => {
          let fillUrl = terr.color;
          if (terr.realm === 'talvaris') fillUrl = 'url(#renderTalvarisGlow)';
          else if (terr.realm === 'alabarya') fillUrl = 'url(#renderAlabaryaGlow)';
          else if (terr.realm === 'alonawon') fillUrl = 'url(#renderAlonawonGlow)';
          else if (terr.realm === 'himaraya') fillUrl = 'url(#renderHimarayaGlow)';
          else if (terr.realm === 'aetherya') fillUrl = 'url(#renderAetheryaGlow)';

          return (
            <g key={terr.realm}>
              <path
                d={terr.path}
                fill={fillUrl}
                stroke={realmTheme[terr.realm].border}
                strokeWidth="1.5"
                strokeDasharray="6,4"
                opacity="0.65"
              />
              <text
                x={terr.labelX}
                y={terr.labelY}
                fill={realmTheme[terr.realm].text}
                fontSize={isLargeLattice ? "22" : "13"}
                fontFamily="Cinzel, serif"
                fontWeight="bold"
                letterSpacing="2"
                opacity="0.85"
              >
                {terr.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* 2. Connecting Energy Trail (Serpentine Flow) */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(245, 158, 11, 0.55)"
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

          // Use exact cell points if grid coordinates exist on lattice
          const hasGridCoords = tile.gridY !== undefined && tile.gridX !== undefined && isLargeLattice;
          const polygonPts = hasGridCoords 
            ? cellPts(tile.gridY, tile.gridX) 
            : getTrianglePoints(cx, cy, tile.orientation || 'up', 24 * sizeMult);

          // Players on this tile
          const playersHere = room.players.filter((p) => p.currentTile === tile.index && !p.isEliminated);
          const isCurrentTurnHere = room.players[room.currentTurnIndex]?.currentTile === tile.index;

          let fill = 'url(#renderDaanGrad)';
          let stroke = '#64748b';
          let baybayinSigil = 'ᜇ'; // Baybayin 'Da' for Daan

          if (tile.type === 'pagsubok') {
            fill = 'url(#renderPagsubokGrad)';
            stroke = '#a855f7';
            baybayinSigil = 'ᜉ'; // Baybayin 'Pa' for Pagsubok
          } else if (tile.type === 'kapalaran') {
            fill = 'url(#renderKapalaranGrad)';
            stroke = '#f43f5e';
            baybayinSigil = 'ᜃ'; // Baybayin 'Ka' for Kapalaran
          }

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
                  r={(isAetherya ? 52 : isGate ? 42 : 36) * (isLargeLattice ? 1.0 : sizeMult)}
                  fill="none"
                  stroke={isSelected ? '#fbbf24' : '#60a5fa'}
                  strokeWidth="2.5"
                  strokeDasharray="4,3"
                  className="animate-spin"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* TILE SHAPES */}
              {isAetherya ? (
                /* AETHERYA SANCTUARY (Large Glowing Sun Hexagon matching Editor) */
                <g>
                  <polygon
                    points={isLargeLattice ? hexPts(cx, cy, 48) : getHexagonPoints(cx, cy, 42 * sizeMult)}
                    fill="url(#renderFinaleGrad)"
                    stroke="#eab308"
                    strokeWidth="3.5"
                    filter="url(#tileGlow)"
                  />
                  <polygon
                    points={isLargeLattice ? hexPts(cx, cy, 36) : getHexagonPoints(cx, cy, 32 * sizeMult)}
                    fill="#451a03"
                    stroke="#fef08a"
                    strokeWidth="1.5"
                  />
                  <text
                    x={cx}
                    y={cy - 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fef08a"
                    fontSize={isLargeLattice ? "26" : "18"}
                  >
                    👑
                  </text>
                  <text
                    x={cx}
                    y={cy + (isLargeLattice ? 22 : 16)}
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
                /* DIWALING GATE (Double-Bordered Hexagon matching Editor) */
                <g>
                  <polygon
                    points={isLargeLattice ? hexPts(cx, cy, 36) : getHexagonPoints(cx, cy, 29 * sizeMult)}
                    fill={isGateUnlocked ? '#064e3b' : 'url(#renderGateGrad)'}
                    stroke={isGateUnlocked ? '#10b981' : '#f59e0b'}
                    strokeWidth="2.8"
                    filter="url(#tileGlow)"
                  />
                  <polygon
                    points={isLargeLattice ? hexPts(cx, cy, 26) : getHexagonPoints(cx, cy, 21 * sizeMult)}
                    fill={isGateUnlocked ? '#047857' : '#27170a'}
                    stroke={isGateUnlocked ? '#34d399' : '#fbbf24'}
                    strokeWidth="1.2"
                  />
                  <text
                    x={cx}
                    y={cy - 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isGateUnlocked ? '#6ee7b7' : '#fbbf24'}
                    fontSize={isLargeLattice ? "18" : "12"}
                  >
                    {isGateUnlocked ? '🔓' : '🔒'}
                  </text>
                  <text
                    x={cx}
                    y={cy + (isLargeLattice ? 24 : 16)}
                    textAnchor="middle"
                    fill="#fcd34d"
                    fontSize={isLargeLattice ? "11" : "7"}
                    fontFamily="Cinzel, serif"
                    fontWeight="bold"
                  >
                    GATE #{tile.index}
                  </text>
                </g>
              ) : (
                /* TRIANGULAR TILES (Matching Editor Lattice Geometry and Sigils) */
                <g>
                  <polygon
                    points={polygonPts}
                    fill={fill}
                    stroke={isSelected ? '#fbbf24' : stroke}
                    strokeWidth={isSelected ? "3.2" : "2.2"}
                    filter={isSelected ? 'url(#tileGlow)' : undefined}
                    opacity="0.95"
                  />
                  {/* Inner Motif Disc */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isLargeLattice ? 14 : 10 * sizeMult}
                    fill="rgba(0, 0, 0, 0.55)"
                    stroke={stroke}
                    strokeWidth="1"
                  />
                  {/* Baybayin Emblem */}
                  <text
                    x={cx}
                    y={cy + (isLargeLattice ? 4 : 3)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={
                      tile.type === 'pagsubok'
                        ? '#e9d5ff'
                        : tile.type === 'kapalaran'
                        ? '#fecaca'
                        : '#cbd5e1'
                    }
                    fontSize={isLargeLattice ? "14" : "10"}
                    fontWeight="bold"
                  >
                    {baybayinSigil}
                  </text>
                </g>
              )}

              {/* TILE INDEX BADGE */}
              <text
                x={cx}
                y={tile.orientation === 'down' ? cy + (isLargeLattice ? 28 : 20) : cy - (isLargeLattice ? 26 : 18)}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={isLargeLattice ? "11" : "8"}
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
                    const tokenOffset = (pIdx - (playersHere.length - 1) / 2) * (24 * sizeMult);
                    return (
                      <g
                        key={p.id}
                        transform={`translate(${tokenOffset}, ${-(34 * sizeMult)})`}
                        className={isPturn ? 'animate-bounce' : ''}
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r={14 * sizeMult}
                          fill="#0f172a"
                          stroke={isPturn ? '#f59e0b' : '#38bdf8'}
                          strokeWidth="2.5"
                        />
                        <clipPath id={`avatarClip_${p.id}_${tile.index}`}>
                          <circle cx="0" cy="0" r={13 * sizeMult} />
                        </clipPath>
                        <image
                          href={p.avatar}
                          x={-(13 * sizeMult)}
                          y={-(13 * sizeMult)}
                          width={26 * sizeMult}
                          height={26 * sizeMult}
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
