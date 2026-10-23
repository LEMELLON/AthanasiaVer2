import React, { useState } from 'react';
import { BoardTile, GameRoom, PlayerState, RealmType } from '../../types/game';
import { CANONICAL_BOARD_TILES } from '../../data/canonicalCards';
import { CANONICAL_MAP_DATA } from '../../data/canonicalMap';
import { TileMapRenderer } from './TileMapRenderer';
import { Shield, Lock, Unlock, HelpCircle, Shuffle, Footprints, Crown, Sparkles, Flame, Droplets, Wind, Mountain, Eye, Map, LayoutGrid } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../utils/i18n';

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
  const { t } = useLanguage();
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [viewMode, setViewMode] = useState<'tile_map' | 'simple_track'>(() => {
    return (localStorage.getItem('athanasia_board_view_mode') as 'tile_map' | 'simple_track') || 'tile_map';
  });

  const handleToggleView = (mode: 'tile_map' | 'simple_track') => {
    sounds.playClick();
    setViewMode(mode);
    localStorage.setItem('athanasia_board_view_mode', mode);
  };

  const activeMapData = room.mapData || CANONICAL_MAP_DATA;
  const boardTiles = activeMapData.tiles || CANONICAL_BOARD_TILES;

  const realmColors: Record<RealmType, { border: string; bg: string; text: string; glow: string; name: string }> = {
    talvaris: {
      border: 'border-emerald-500/60',
      bg: 'bg-emerald-950/70',
      text: 'text-emerald-300',
      glow: 'shadow-emerald-900/40',
      name: 'Talvaris — Lupa (Earth)',
    },
    alabarya: {
      border: 'border-amber-500/60',
      bg: 'bg-amber-950/70',
      text: 'text-amber-300',
      glow: 'shadow-amber-900/40',
      name: 'Alabarya — Apoy (Fire)',
    },
    alonawon: {
      border: 'border-cyan-500/60',
      bg: 'bg-cyan-950/70',
      text: 'text-cyan-300',
      glow: 'shadow-cyan-900/40',
      name: 'Alonawon — Tubig (Water)',
    },
    himaraya: {
      border: 'border-purple-500/60',
      bg: 'bg-purple-950/70',
      text: 'text-purple-300',
      glow: 'shadow-purple-900/40',
      name: 'Himaraya — Hangin (Air)',
    },
    aetherya: {
      border: 'border-yellow-400',
      bg: 'bg-gradient-to-br from-yellow-950/90 via-amber-900/80 to-slate-900',
      text: 'text-yellow-200',
      glow: 'shadow-yellow-500/50',
      name: 'Aetherya — Huling Lupain (Sanctuary)',
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
      {/* Top Header: Realm Breadcrumbs & Dual-View Mode Switcher */}
      <div className="flex items-center justify-between mb-3 px-2 text-xs text-slate-400 gap-2 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Mountain className="w-3.5 h-3.5" /> Talvaris
          </span>
          <span className="text-slate-600">➔</span>
          <span className="flex items-center gap-1 text-amber-400 font-medium">
            <Flame className="w-3.5 h-3.5" /> Alabarya
          </span>
          <span className="text-slate-600">➔</span>
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <Droplets className="w-3.5 h-3.5" /> Alonawon
          </span>
          <span className="text-slate-600">➔</span>
          <span className="flex items-center gap-1 text-purple-400 font-medium">
            <Wind className="w-3.5 h-3.5" /> Himaraya
          </span>
          <span className="text-slate-600">➔</span>
          <span className="flex items-center gap-1 text-yellow-300 font-bold">
            <Crown className="w-3.5 h-3.5" /> Aetherya
          </span>
        </div>

        {/* Dual-View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 p-0.5 rounded-xl shrink-0">
          <button
            onClick={() => handleToggleView('tile_map')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-cinzel transition-all cursor-pointer ${
              viewMode === 'tile_map'
                ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{t.tileMapView}</span>
          </button>
          <button
            onClick={() => handleToggleView('simple_track')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-cinzel transition-all cursor-pointer ${
              viewMode === 'simple_track'
                ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.trackView}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Authentic Mahiwagang Serpentine Tile Map (Tessellated SVG) */}
      {viewMode === 'tile_map' ? (
        <TileMapRenderer
          mapData={activeMapData}
          room={room}
          currentPlayer={currentPlayer}
          selectedTile={selectedTile}
          onSelectTile={handleTileSelect}
        />
      ) : (
        /* VIEW 2: Payak na Serpentine Track (Grid Rows) */
        <div className="min-w-[1050px] p-4 rounded-3xl bg-slate-950/80 border border-slate-800/80 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/10 via-amber-950/10 to-purple-950/10 rounded-3xl pointer-events-none" />

          {/* Serpentine Rows (0 to 4) */}
          {[0, 1, 2, 3, 4].map((rowIdx) => {
            const rowTiles = boardTiles.filter((t) => t.gridY === rowIdx).sort((a, b) => {
              return rowIdx % 2 === 0 ? a.gridX - b.gridX : b.gridX - a.gridX;
            });

            return (
              <div key={rowIdx} className="flex items-center justify-start gap-2 mb-3 relative">
                {/* Row Realm Label */}
                <div className="w-20 shrink-0 text-left pl-1">
                  <span className="font-cinzel text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    {rowIdx === 0 && 'Lupa'}
                    {rowIdx === 1 && 'Apoy'}
                    {rowIdx === 2 && 'Tubig'}
                    {rowIdx === 3 && 'Hangin'}
                    {rowIdx === 4 && 'Aetherya'}
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
                            ? `w-16 h-18 border-2 ${meta.border} ${meta.bg} shadow-lg ${meta.glow}`
                            : `w-14 h-16 border ${meta.border} bg-slate-900/90 hover:bg-slate-800`
                        } ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950' : ''}`}
                      >
                        {/* Tile Number Header */}
                        <div className="w-full flex items-center justify-between text-[10px] font-mono px-0.5">
                          <span className="text-slate-400">#{tile.index}</span>
                          {tile.type === 'pintuan' && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">GATE</span>
                          )}
                        </div>

                        {/* Tile Center Icon */}
                        <div className="my-auto">{getTileIcon(tile)}</div>

                        {/* Tile Footer Title */}
                        <div className="w-full text-center">
                          <span className="text-[9px] font-semibold truncate block max-w-full text-slate-300">
                            {tile.type === 'pintuan' ? 'Tarangkahan' : tile.type === 'pagsubok' ? 'Hamon' : tile.type === 'kapalaran' ? 'Tadhana' : 'Daan'}
                          </span>
                        </div>

                        {/* Player Avatars on this tile */}
                        {playersOnTile.length > 0 && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center -space-x-1.5 z-10">
                            {playersOnTile.map((p) => {
                              const isPturn = room.players[room.currentTurnIndex]?.id === p.id;
                              return (
                                <div
                                  key={p.id}
                                  className={`relative rounded-full transition-transform ${isPturn ? 'animate-token-hop scale-110' : ''}`}
                                  title={`${p.name} (Tile #${p.currentTile})`}
                                >
                                  <img
                                    src={p.avatar}
                                    alt={p.name}
                                    className={`w-6 h-6 rounded-full object-cover border-2 shadow-md ${
                                      isPturn ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-300'
                                    }`}
                                  />
                                  {p.hasShield && (
                                    <Shield className="w-2.5 h-2.5 text-cyan-400 absolute -bottom-0.5 -right-0.5" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Tile Inspector Drawer */}
      {selectedTile && (
        <div className="mt-3 p-3 rounded-2xl bg-slate-900/90 border border-amber-600/40 backdrop-blur-md flex items-center justify-between text-xs gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40">
              {getTileIcon(selectedTile)}
            </div>
            <div>
              <div className="font-bold text-amber-200 flex items-center gap-2">
                <span>{selectedTile.title}</span>
                <span className="font-mono text-[10px] text-slate-400">Tile #{selectedTile.index}</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                {selectedTile.description || (
                  selectedTile.type === 'pintuan'
                    ? `Pintuan ng ${selectedTile.realm.toUpperCase()}. Kailangang sagutin ang Pahiwatig upang mabuksan.`
                    : selectedTile.type === 'pagsubok'
                    ? 'Magbubunot ng Pagsubok Card (Bugtong o Logic). Tagumpay ay nagbibigay ng Biyaya.'
                    : selectedTile.type === 'kapalaran'
                    ? 'Sangandaan ng Kapalaran. Pagpipilian sa pagitan ng panganib at gantimpala.'
                    : 'Karaniwang daanan ng paglalakbay.'
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedTile(null)}
            className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded-lg bg-slate-800"
          >
            {t.close}
          </button>
        </div>
      )}
    </div>
  );
};
