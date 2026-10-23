import React, { useState, useRef } from 'react';
import { BoardTile, RealmTerritory, RealmType, TileMapData, TileType } from '../../types/game';
import { CANONICAL_MAP_DATA } from '../../data/canonicalMap';
import { sounds } from '../../utils/audio';
import { 
  Paintbrush, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  Crown, 
  Lock, 
  HelpCircle, 
  Shuffle, 
  Footprints,
  Compass,
  Layers,
  Play
} from 'lucide-react';

interface TileMapEditorProps {
  onClose: () => void;
  onMapSaved?: (map: TileMapData) => void;
  onTestPlay?: (map: TileMapData) => void;
}

export const TileMapEditor: React.FC<TileMapEditorProps> = ({
  onClose,
  onMapSaved,
  onTestPlay,
}) => {
  const [currentMap, setCurrentMap] = useState<TileMapData>(() => {
    const saved = localStorage.getItem('athanasia_active_custom_map');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(CANONICAL_MAP_DATA));
  });

  const [activeBrush, setActiveBrush] = useState<TileType>('daan');
  const [activeRealm, setActiveRealm] = useState<RealmType>('talvaris');
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);
  const [editorMode, setEditorMode] = useState<'paint' | 'select' | 'move'>('paint');
  const [draggedTileIdx, setDraggedTileIdx] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectedTile = currentMap.tiles.find((t) => t.index === selectedTileIndex);

  // Validate Map:
  const validateMap = (tiles: BoardTile[]): string[] => {
    const errors: string[] = [];
    if (!tiles.some((t) => t.index === 0)) {
      errors.push('Kulang ng panimulang tile (Tile #0).');
    }

    const realms: RealmType[] = ['talvaris', 'alabarya', 'alonawon', 'himaraya'];
    realms.forEach((r) => {
      const gate = tiles.find((t) => t.type === 'pintuan' && t.realm === r);
      if (!gate) {
        errors.push(`Kulang ng Tarangkahan ng Diwaling para sa lupain ng ${r.toUpperCase()}.`);
      }
    });

    if (!tiles.some((t) => t.type === 'aetherya')) {
      errors.push('Kulang ng Huling Dambana (Aetherya goal tile).');
    }

    if (tiles.length < 10) {
      errors.push('Masyadong kaunti ang tiles (kailangan ng hindi bababa sa 10 tiles).');
    }

    return errors;
  };

  // Handle Tile Click in Canvas
  const handleTileClick = (tile: BoardTile) => {
    sounds.playClick();
    if (editorMode === 'paint') {
      // Paint tile with active brush & active realm
      const updatedTiles = currentMap.tiles.map((t) => {
        if (t.index === tile.index) {
          const isGate = activeBrush === 'pintuan';
          const isAeth = activeBrush === 'aetherya';
          return {
            ...t,
            type: activeBrush,
            realm: isAeth ? 'aetherya' : activeRealm,
            shape: isAeth ? ('sanctuary' as const) : isGate ? ('pentagon' as const) : ('triangle' as const),
            title: isAeth
              ? 'Aetherya Sanctuary'
              : isGate
              ? `Pintuan ng ${activeRealm.toUpperCase()}`
              : activeBrush === 'pagsubok'
              ? `Pagsubok sa ${activeRealm} #${t.index}`
              : activeBrush === 'kapalaran'
              ? `Kapalaran sa ${activeRealm} #${t.index}`
              : `Daan ng ${activeRealm} #${t.index}`,
          };
        }
        return t;
      });
      setCurrentMap({ ...currentMap, tiles: updatedTiles });
      setSelectedTileIndex(tile.index);
    } else {
      setSelectedTileIndex(tile.index);
    }
  };

  // Invert orientation
  const handleToggleOrientation = () => {
    if (selectedTileIndex === null) return;
    sounds.playClick();
    const updated = currentMap.tiles.map((t) => {
      if (t.index === selectedTileIndex) {
        return {
          ...t,
          orientation: (t.orientation === 'up' ? 'down' : 'up') as 'up' | 'down',
        };
      }
      return t;
    });
    setCurrentMap({ ...currentMap, tiles: updated });
  };

  // Canvas Mouse Down for Dragging
  const handleMouseDown = (e: React.MouseEvent, tileIndex: number) => {
    if (editorMode === 'move') {
      setDraggedTileIdx(tileIndex);
    }
  };

  // Canvas Mouse Move for Dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedTileIdx === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 1160 / rect.width;
    const scaleY = 700 / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    const updated = currentMap.tiles.map((t) => {
      if (t.index === draggedTileIdx) {
        return { ...t, posX: Math.max(30, Math.min(1130, x)), posY: Math.max(30, Math.min(670, y)) };
      }
      return t;
    });
    setCurrentMap({ ...currentMap, tiles: updated });
  };

  const handleMouseUp = () => {
    if (draggedTileIdx !== null) {
      setDraggedTileIdx(null);
      sounds.playClick();
    }
  };

  // Add new tile at the end
  const handleAddTile = () => {
    sounds.playClick();
    const lastTile = currentMap.tiles[currentMap.tiles.length - 1];
    const newIdx = (lastTile?.index ?? -1) + 1;
    const newTile: BoardTile = {
      index: newIdx,
      realm: activeRealm,
      shape: activeBrush === 'pintuan' ? 'pentagon' : activeBrush === 'aetherya' ? 'sanctuary' : 'triangle',
      type: activeBrush,
      title: `Bagong Tile #${newIdx}`,
      gridX: (lastTile?.gridX ?? 0) + 1,
      gridY: lastTile?.gridY ?? 0,
      orientation: 'up',
      posX: Math.min(1080, (lastTile?.posX ?? 100) + 50),
      posY: lastTile?.posY ?? 200,
    };
    const updated = [...currentMap.tiles, newTile];
    setCurrentMap({ ...currentMap, tiles: updated });
    setSelectedTileIndex(newIdx);
  };

  // Delete selected tile
  const handleDeleteTile = () => {
    if (selectedTileIndex === null || currentMap.tiles.length <= 1) return;
    sounds.playClick();
    const filtered = currentMap.tiles.filter((t) => t.index !== selectedTileIndex);
    // Re-index remaining tiles sequentially
    const reindexed = filtered.map((t, idx) => ({ ...t, index: idx }));
    setCurrentMap({ ...currentMap, tiles: reindexed });
    setSelectedTileIndex(null);
  };

  // Save to Server & LocalStorage
  const handleSaveMap = async () => {
    const errors = validateMap(currentMap.tiles);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      sounds.playChallengeFail();
      return;
    }

    try {
      const res = await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMap),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('athanasia_active_custom_map', JSON.stringify(data.map));
        sounds.playChallengeSuccess();
        setStatusMessage('Matagumpay na nai-save ang mapa sa server at library!');
        setTimeout(() => setStatusMessage(null), 3500);
        if (onMapSaved) onMapSaved(data.map);
      }
    } catch {
      localStorage.setItem('athanasia_active_custom_map', JSON.stringify(currentMap));
      setStatusMessage('Nai-save sa lokal na library.');
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Reset to Canonical Map
  const handleResetCanonical = () => {
    sounds.playClick();
    const copy = JSON.parse(JSON.stringify(CANONICAL_MAP_DATA));
    setCurrentMap(copy);
    setSelectedTileIndex(null);
    setStatusMessage('Naibalik ang opisyal na 50-tile canonical map.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Export JSON
  const handleExportJSON = () => {
    sounds.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentMap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentMap.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.tiles && Array.isArray(parsed.tiles)) {
          setCurrentMap(parsed);
          sounds.playChallengeSuccess();
          setStatusMessage('Matagumpay na na-import ang bagong mapa!');
          setTimeout(() => setStatusMessage(null), 3000);
        }
      } catch {
        sounds.playChallengeFail();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[94vh] bg-[#0b0f17] border-2 border-amber-500/50 rounded-3xl p-4 shadow-2xl flex flex-col gap-3 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-lg font-bold text-amber-100">
                  Tagalikha ng Mapa ng Diwa (Tile Map Editor)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  {currentMap.tiles.length} TILES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-serif italic">
                Pumili ng tile brush, baguhin ang hugis o lupain, at ayusin ang geometric serpentine layout.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetCanonical}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-cinzel cursor-pointer"
              title="Ibalik ang orihinal na 50-tile map"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Canonical Preset</span>
            </button>
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-cinzel cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-cinzel cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleSaveMap}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 font-cinzel text-xs font-bold shadow-lg hover:brightness-110 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>I-SAVE ANG MAPA</span>
            </button>
            {onTestPlay && (
              <button
                onClick={() => onTestPlay(currentMap)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-cinzel text-xs font-bold shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Test Play</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Main Editor Body: Palette + Canvas + Property Inspector */}
        <div className="flex-1 flex gap-3 overflow-hidden">
          {/* Left Palette: Tile Brushes & Realm Territory Chooser */}
          <div className="w-64 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col gap-4 overflow-y-auto shrink-0">
            {/* Map Metadata Input */}
            <div>
              <label className="text-[11px] font-cinzel font-bold text-slate-400 block mb-1">
                Pangalan ng Mapa:
              </label>
              <input
                type="text"
                value={currentMap.name}
                onChange={(e) => setCurrentMap({ ...currentMap, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-200 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Editor Tool Mode (Paint, Move, Select) */}
            <div>
              <label className="text-[11px] font-cinzel font-bold text-slate-400 block mb-1">
                Kagamitan (Tool Mode):
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => { setEditorMode('paint'); sounds.playClick(); }}
                  className={`py-1 text-[11px] font-cinzel rounded-lg flex items-center justify-center gap-1 cursor-pointer ${
                    editorMode === 'paint' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Paintbrush className="w-3 h-3" />
                  <span>Brush</span>
                </button>
                <button
                  onClick={() => { setEditorMode('move'); sounds.playClick(); }}
                  className={`py-1 text-[11px] font-cinzel rounded-lg flex items-center justify-center gap-1 cursor-pointer ${
                    editorMode === 'move' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Move</span>
                </button>
                <button
                  onClick={() => { setEditorMode('select'); sounds.playClick(); }}
                  className={`py-1 text-[11px] font-cinzel rounded-lg flex items-center justify-center gap-1 cursor-pointer ${
                    editorMode === 'select' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Suriin</span>
                </button>
              </div>
            </div>

            {/* Tile Brushes */}
            <div>
              <label className="text-[11px] font-cinzel font-bold text-slate-400 block mb-1.5">
                Tile Brushes:
              </label>
              <div className="flex flex-col gap-1.5">
                {[
                  { type: 'daan', label: 'Daan (Normal Path)', icon: Footprints, color: 'text-slate-300' },
                  { type: 'pagsubok', label: 'Pagsubok (Challenge)', icon: HelpCircle, color: 'text-purple-400' },
                  { type: 'kapalaran', label: 'Kapalaran (Fate Dilemma)', icon: Shuffle, color: 'text-rose-400' },
                  { type: 'pintuan', label: 'Pintuan ng Diwaling (Gate)', icon: Lock, color: 'text-amber-400' },
                  { type: 'aetherya', label: 'Aetherya Sanctuary (Goal)', icon: Crown, color: 'text-yellow-300' },
                ].map((brush) => {
                  const Icon = brush.icon;
                  const isActive = activeBrush === brush.type;
                  return (
                    <button
                      key={brush.type}
                      onClick={() => { setActiveBrush(brush.type as TileType); sounds.playClick(); }}
                      className={`flex items-center gap-2.5 p-2 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'border-amber-400 bg-amber-950/40 font-bold text-amber-200 shadow'
                          : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${brush.color}`} />
                      <span className="truncate">{brush.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Realm Assignment */}
            <div>
              <label className="text-[11px] font-cinzel font-bold text-slate-400 block mb-1.5">
                Lupain / Kaharian (Realm Territory):
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { realm: 'talvaris', label: 'Talvaris (Lupa)', color: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' },
                  { realm: 'alabarya', label: 'Alabarya (Apoy)', color: 'bg-rose-950/60 border-rose-500/50 text-rose-300' },
                  { realm: 'alonawon', label: 'Alonawon (Tubig)', color: 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300' },
                  { realm: 'himaraya', label: 'Himaraya (Hangin)', color: 'bg-purple-950/60 border-purple-500/50 text-purple-300' },
                  { realm: 'aetherya', label: 'Aetherya (Sanctuary)', color: 'bg-amber-950/60 border-amber-500/50 text-amber-300 col-span-2' },
                ].map((r) => (
                  <button
                    key={r.realm}
                    onClick={() => { setActiveRealm(r.realm as RealmType); sounds.playClick(); }}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-cinzel text-center cursor-pointer transition-all ${
                      r.color
                    } ${activeRealm === r.realm ? 'ring-2 ring-amber-400 font-bold brightness-125' : 'opacity-70 hover:opacity-100'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tile Manipulation Controls */}
            <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
              <button
                onClick={handleAddTile}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-cinzel font-semibold border border-slate-700 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Magdagdag ng Tile</span>
              </button>
              {selectedTileIndex !== null && (
                <>
                  <button
                    onClick={handleToggleOrientation}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-cinzel border border-slate-700 cursor-pointer"
                  >
                    <ArrowUpDown className="w-4 h-4 text-amber-400" />
                    <span>Baligtarin Hugis (▲/▼)</span>
                  </button>
                  <button
                    onClick={handleDeleteTile}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-cinzel cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Burahin ang Tile #{selectedTileIndex}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Center Interactive SVG Canvas */}
          <div
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-auto p-2 flex flex-col items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 1160 700"
              className="w-full h-auto max-h-full drop-shadow-2xl"
            >
              {/* Territory Polygons */}
              {(currentMap.territories || CANONICAL_MAP_DATA.territories || []).map((terr) => (
                <g key={terr.realm}>
                  <path
                    d={terr.path}
                    fill={terr.color}
                    stroke="rgba(245, 158, 11, 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={terr.labelX}
                    y={terr.labelY}
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="Cinzel, serif"
                    fontWeight="bold"
                    letterSpacing="1"
                    opacity="0.8"
                  >
                    {terr.name.toUpperCase()}
                  </text>
                </g>
              ))}

              {/* Connecting Path Lines */}
              {(() => {
                const sorted = [...currentMap.tiles].sort((a, b) => a.index - b.index);
                const pathD = sorted.reduce((acc, t, idx) => {
                  const x = t.posX ?? 100;
                  const y = t.posY ?? 100;
                  return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
                }, '');
                return (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(245, 158, 11, 0.4)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="5,4"
                  />
                );
              })()}

              {/* Render Tiles */}
              {currentMap.tiles.map((tile) => {
                const cx = tile.posX ?? 100;
                const cy = tile.posY ?? 100;
                const isSelected = selectedTileIndex === tile.index;
                const isGate = tile.type === 'pintuan';
                const isAeth = tile.type === 'aetherya';

                // Helpers for SVG shapes
                const triPoints = (tile.orientation || 'up') === 'up'
                  ? `${cx},${cy - 30} ${cx - 26},${cy + 18} ${cx + 26},${cy + 18}`
                  : `${cx},${cy + 30} ${cx - 26},${cy - 18} ${cx + 26},${cy - 18}`;

                const hexPoints = (() => {
                  const r = isAeth ? 38 : 26;
                  const pts: string[] = [];
                  for (let i = 0; i < 6; i++) {
                    const ang = (Math.PI / 3) * i - Math.PI / 6;
                    pts.push(`${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`);
                  }
                  return pts.join(' ');
                })();

                return (
                  <g
                    key={tile.index}
                    onClick={() => handleTileClick(tile)}
                    onMouseDown={(e) => handleMouseDown(e, tile.index)}
                    className="cursor-pointer"
                  >
                    {/* Selected Glow Ring */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isAeth ? 46 : 34}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2.5"
                        strokeDasharray="4,4"
                      />
                    )}

                    {/* Shape */}
                    {isAeth ? (
                      <polygon points={hexPoints} fill="#78350f" stroke="#eab308" strokeWidth="3" />
                    ) : isGate ? (
                      <polygon points={hexPoints} fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2.5" />
                    ) : (
                      <polygon
                        points={triPoints}
                        fill={
                          tile.type === 'pagsubok'
                            ? '#2e1065'
                            : tile.type === 'kapalaran'
                            ? '#450a0a'
                            : '#0f172a'
                        }
                        stroke={
                          tile.type === 'pagsubok'
                            ? '#c084fc'
                            : tile.type === 'kapalaran'
                            ? '#f87171'
                            : '#059669'
                        }
                        strokeWidth="2"
                      />
                    )}

                    {/* Icon or Label */}
                    <text
                      x={cx}
                      y={cy + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#f8fafc"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {isAeth ? '👑' : isGate ? '🔒' : tile.type === 'pagsubok' ? '?' : tile.type === 'kapalaran' ? '✦' : tile.index}
                    </text>

                    {/* Number Badge */}
                    <text
                      x={cx}
                      y={(tile.orientation || 'up') === 'down' ? cy + 22 : cy - 20}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      #{tile.index}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Validation Errors Modal */}
        {showValidationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl p-5 max-w-md w-full shadow-2xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-400 font-cinzel font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Kailangang Ayusin sa Mapa:</span>
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
              <button
                onClick={() => setShowValidationModal(false)}
                className="mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-cinzel font-semibold cursor-pointer"
              >
                Bumalik sa Editor at Iwasto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
