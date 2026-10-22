import React, { useState } from 'react';
import { BoardTile, GameRoom, PlayerState, RealmType } from '../../types/game';
import { CANONICAL_BOARD_TILES } from '../../data/canonicalCards';
import { Shield, Lock, Unlock, HelpCircle, Shuffle, Footprints, Crown, Flame, Droplets, Wind, Mountain } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../context/LanguageContext';

interface GameBoardProps {
  room: GameRoom;
  currentPlayer: PlayerState | null;
  onTileClick?: (tile: BoardTile) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  room,
  currentPlayer,
  onTileClick,
}) => {
  const { t, language } = useLanguage();
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);

  const realmColors: Record<RealmType, { border: string; bg: string; text: string; glow: string; name: string }> = {
    talvaris: {
      border: 'border-emerald-500/60',
      bg: 'bg-emerald-950/70',
      text: 'text-emerald-300',
      glow: 'shadow-emerald-900/40',
      name: language === 'tl' ? 'Talvaris — Lupa' : 'Talvaris — Earth',
    },
    alabarya: {
      border: 'border-amber-500/60',
      bg: 'bg-amber-950/70',
      text: 'text-amber-300',
      glow: 'shadow-amber-900/40',
      name: language === 'tl' ? 'Alabarya — Apoy' : 'Alabarya — Fire',
    },
    alonawon: {
      border: 'border-cyan-500/60',
      bg: 'bg-cyan-950/70',
      text: 'text-cyan-300',
      glow: 'shadow-cyan-900/40',
      name: language === 'tl' ? 'Alonawon — Tubig' : 'Alonawon — Water',
    },
    himaraya: {
      border: 'border-purple-500/60',
      bg: 'bg-purple-950/70',
      text: 'text-purple-300',
      glow: 'shadow-purple-900/40',
      name: language === 'tl' ? 'Himaraya — Hangin' : 'Himaraya — Air',
    },
    aetherya: {
      border: 'border-yellow-400',
      bg: 'bg-gradient-to-br from-yellow-950/90 via-amber-900/80 to-slate-900',
      text: 'text-yellow-200',
      glow: 'shadow-yellow-500/50',
      name: language === 'tl' ? 'Aetherya — Huling Lupain (Sanctuary)' : 'Aetherya — Final Realm (Sanctuary)',
    },
  };

  const getTileIcon = (tile: BoardTile) => {
    if (tile.type === 'aetherya') {
      return <Crown className="w-5 h-5 text-yellow-300 animate-bounce" />;
    }
    if (tile.type === 'pintuan') {
      const isUnlocked = room.diwalingGatesUnlocked[tile.realm];
      return isUnlocked ? (
        <Unlock className="w-4 h-4 text-emerald-400" />
      ) : (
        <Lock className="w-4 h-4 text-amber-400 animate-pulse" />
      );
    }
    if (tile.type === 'pagsubok') {
      return <HelpCircle className="w-3.5 h-3.5 text-amber-300" />;
    }
    if (tile.type === 'kapalaran') {
      return <Shuffle className="w-3.5 h-3.5 text-violet-300" />;
    }
    return <Footprints className="w-3 h-3 text-slate-400 opacity-60" />;
  };

  const handleTileSelect = (tile: BoardTile) => {
    sounds.playClick();
    setSelectedTile(tile);
    if (onTileClick) onTileClick(tile);
  };

  return (
    <div className="relative w-full overflow-x-auto overflow-y-hidden pb-4">
      {/* Realm Breadcrumb Header */}
      <div className="flex items-center justify-between mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Mountain className="w-3.5 h-3.5" /> Talvaris (Tiles 1-17)
          </span>
          <span className="text-slate-600">➔</span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <Flame className="w-3.5 h-3.5" /> Alabarya (Tiles 18-31)
          </span>
          <span className="text-slate-600">➔</span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Droplets className="w-3.5 h-3.5" /> Alonawon (Tiles 32-42)
          </span>
          <span className="text-slate-600">➔</span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <Wind className="w-3.5 h-3.5" /> Himaraya (Tiles 43-49)
          </span>
          <span className="text-slate-600">➔</span>
          <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
            <Crown className="w-3.5 h-3.5" /> Aetherya (Tile 50)
          </span>
        </div>
      </div>

      {/* 50-Tile Serpentine Grid Layout */}
      <div className="min-w-[1050px] p-4 rounded-3xl bg-slate-950/80 border border-slate-800/80 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/10 via-amber-950/10 to-purple-950/10 rounded-3xl pointer-events-none" />

        {/* Serpentine Rows (0 to 4) */}
        {[0, 1, 2, 3, 4].map((rowIdx) => {
          const rowTiles = CANONICAL_BOARD_TILES.filter(t => t.gridY === rowIdx).sort((a, b) => {
            return rowIdx % 2 === 0 ? a.gridX - b.gridX : b.gridX - a.gridX;
          });

          return (
            <div key={rowIdx} className="flex items-center justify-start gap-2 mb-3 relative">
              {/* Row Realm Label */}
              <div className="w-20 shrink-0 text-left pl-1">
                <span className="font-cinzel text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  {rowIdx === 0 && t.rowEarth}
                  {rowIdx === 1 && t.rowFire}
                  {rowIdx === 2 && t.rowWater}
                  {rowIdx === 3 && t.rowAir}
                  {rowIdx === 4 && t.rowSanctuary}
                </span>
              </div>

              {/* Tiles in this row */}
              <div className="flex items-center gap-2 flex-wrap">
                {rowTiles.map((tile) => {
                  const meta = realmColors[tile.realm];
                  const playersOnTile = room.players.filter(p => p.currentTile === tile.index && !p.isEliminated);
                  const isCurrentTurnPlayerHere = room.players[room.currentTurnIndex]?.currentTile === tile.index;
                  const isUserHere = currentPlayer?.currentTile === tile.index;
                  const isSelected = selectedTile?.index === tile.index;

                  return (
                    <button
                      key={tile.index}
                      onClick={() => handleTileSelect(tile)}
                      className={`relative group transition-all duration-300 rounded-xl flex flex-col items-center justify-between p-1.5 cursor-pointer ${
                        tile.type === 'aetherya'
                          ? 'w-24 h-24 border-2 border-yellow-400 shadow-xl shadow-yellow-500/20 bg-gradient-to-b from-yellow-950 via-slate-900 to-amber-950 animate-pulse-glow'
                          : tile.type === 'pintuan'
                          ? 'w-14 h-16 border-2 shadow-lg ' + meta.border + ' ' + meta.bg
                          : 'w-12 h-14 border border-slate-700/60 hover:border-slate-400 bg-slate-900/90 ' + meta.glow
                      } ${isSelected ? 'ring-2 ring-amber-400 scale-105 z-20' : ''}`}
                    >
                      {/* Tile Header: Number */}
                      <div className="w-full flex items-center justify-between px-0.5">
                        <span className="font-mono text-[10px] text-slate-400 font-bold">
                          {tile.index === 0 ? t.startTileLabel : `#${tile.index}`}
                        </span>
                        {tile.type === 'pintuan' && (
                          <span className="text-[9px] font-bold uppercase text-amber-300 font-cinzel">GATE</span>
                        )}
                      </div>

                      {/* Tile Center Icon */}
                      <div className="my-auto flex items-center justify-center">
                        {getTileIcon(tile)}
                      </div>

                      {/* Tile Label */}
                      <div className="text-[9px] truncate w-full text-center text-slate-300 font-medium">
                        {tile.type === 'aetherya' ? t.endTileLabel : tile.type === 'pintuan' ? tile.guardianName?.split(' ')[0] : tile.type.toUpperCase()}
                      </div>

                      {/* Players on this Tile */}
                      {playersOnTile.length > 0 && (
                        <div className="absolute -top-3 -right-2 flex -space-x-2 z-30">
                          {playersOnTile.map((p) => {
                            const isPturn = room.players[room.currentTurnIndex]?.id === p.id;
                            return (
                              <div
                                key={p.id}
                                className={`relative rounded-full transition-transform ${isPturn ? 'scale-125 animate-token-hop z-30' : ''}`}
                                title={`${p.name} (${p.role === 'impostor' && p.id === currentPlayer?.id ? 'IMPOSTOR' : 'Aninag'})`}
                              >
                                <img
                                  src={p.avatar}
                                  alt={p.name}
                                  className={`w-6 h-6 rounded-full object-cover border-2 ${
                                    isPturn 
                                      ? 'border-amber-400 shadow-md shadow-amber-500/80' 
                                      : 'border-slate-800'
                                  }`}
                                />
                                {p.hasShield && (
                                  <Shield className="w-3 h-3 text-cyan-400 absolute -bottom-1 -right-1 drop-shadow" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Active Player Glow Ring */}
                      {(isCurrentTurnPlayerHere || isUserHere) && (
                        <div className="absolute inset-0 rounded-xl border-2 border-amber-400/80 animate-ping pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tile Inspection Card Modal */}
      {selectedTile && (
        <div className="mt-3 p-3 rounded-2xl bg-slate-900/95 border border-amber-500/30 flex items-center justify-between gap-4 max-w-xl mx-auto backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300">
              {getTileIcon(selectedTile)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-sm font-bold text-amber-200">{selectedTile.title}</span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">Tile #{selectedTile.index}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedTile.description || `${t.realmPrefix} ${realmColors[selectedTile.realm].name}. ${t.typePrefix}: ${selectedTile.type.toUpperCase()}`}
              </p>
              {selectedTile.guardianName && (
                <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                  🛡️ {t.guardianPrefix}: {selectedTile.guardianName}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setSelectedTile(null)}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      )}
    </div>
  );
};
