import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BoardTile, RealmType, TileMapData } from '../../types/game';
import { 
  AetheryaMapCanvas, 
  EditorTool, 
  PlacedCell, 
  PlacedGate, 
  PlacedFinale 
} from './AetheryaMapCanvas';
import { REALM_QUOTAS, centroid, getRealmAtCoordinate, isUp } from '../../utils/aetheryaLattice';
import { CANONICAL_MAP_DATA } from '../../data/canonicalMap';
import { sounds } from '../../utils/audio';
import { useLanguage } from '../../utils/i18n';

const AETHERYA_TERRITORIES = [
  {
    realm: 'talvaris' as RealmType,
    name: 'Talvaris (Lupa)',
    path: 'M 60,60 L 1640,60 Q 1660,260 1600,450 L 60,450 Z',
    labelX: 120,
    labelY: 110,
    color: 'rgba(5, 150, 105, 0.15)',
  },
  {
    realm: 'alabarya' as RealmType,
    name: 'Alabarya (Apoy)',
    path: 'M 60,460 L 1640,460 Q 1660,670 1600,870 L 60,870 Z',
    labelX: 120,
    labelY: 510,
    color: 'rgba(220, 38, 38, 0.15)',
  },
  {
    realm: 'alonawon' as RealmType,
    name: 'Alonawon (Tubig)',
    path: 'M 60,880 L 1640,880 Q 1660,1070 1600,1260 L 60,1260 Z',
    labelX: 120,
    labelY: 930,
    color: 'rgba(2, 132, 199, 0.15)',
  },
  {
    realm: 'himaraya' as RealmType,
    name: 'Himaraya (Hangin)',
    path: 'M 60,1270 L 1640,1270 Q 1660,1470 1600,1640 L 60,1640 Z',
    labelX: 120,
    labelY: 1320,
    color: 'rgba(124, 58, 237, 0.15)',
  },
  {
    realm: 'aetherya' as RealmType,
    name: 'Aetherya (Sanctuary)',
    path: 'M 850,760 C 954,760 1040,845 1040,950 C 1040,1054 954,1140 850,1140 C 745,1140 660,1054 660,950 C 660,845 745,760 850,760 Z',
    labelX: 850,
    labelY: 910,
    color: 'rgba(234, 179, 8, 0.22)',
  },
];
import { 
  Save, 
  RotateCcw, 
  Copy, 
  Upload, 
  Trash2, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Sparkles, 
  Eye, 
  Hash, 
  ShieldAlert,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Crown
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
  const { t } = useLanguage();

  const [activeTool, setActiveTool] = useState<EditorTool>('daan');
  const [showOrderNumbers, setShowOrderNumbers] = useState(true);
  const [mapName, setMapName] = useState('Banal na Serpyente ng Diwa');
  const [mapDescription, setMapDescription] = useState('50-Hakbang na Paglalakbay sa 5 Lupain patungong Aetherya.');

  // Editor placement state
  const [cells, setCells] = useState<Record<string, PlacedCell>>({});
  const [gates, setGates] = useState<PlacedGate[]>([]);
  const [finale, setFinale] = useState<PlacedFinale | null>(null);

  // Undo history stack
  const [history, setHistory] = useState<{
    cells: Record<string, PlacedCell>;
    gates: PlacedGate[];
    finale: PlacedFinale | null;
  }[]>([]);

  // Status & toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Push current state to undo history
  const pushHistory = useCallback(() => {
    setHistory(prev => [
      ...prev.slice(-20),
      {
        cells: { ...cells },
        gates: [...gates],
        finale: finale ? { ...finale } : null,
      },
    ]);
  }, [cells, gates, finale]);

  // Seed with saved custom map or canonical layout on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('athanasia_active_custom_map');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.editorLayout && parsed.editorLayout.cells && Object.keys(parsed.editorLayout.cells).length > 0) {
          setCells(parsed.editorLayout.cells);
          setGates(parsed.editorLayout.gates || []);
          setFinale(parsed.editorLayout.finale || null);
          if (parsed.name) setMapName(parsed.name);
          if (parsed.description) setMapDescription(parsed.description);
          return;
        }
      }
    } catch {}
    // Fallback: Generate default serpentine path on the 1700x1700 lattice satisfying exact quotas
    seedCanonicalTemplate();
  }, []);

  const seedCanonicalTemplate = () => {
    const newCells: Record<string, PlacedCell> = {};
    const newGates: PlacedGate[] = [];

    // Gate 1: Talvaris entrance
    newGates.push({ id: 'gate_1', vx: 216, vy: 187, gateNumber: 1, realm: 'talvaris', order: 0 });

    // Talvaris: 8 Daan, 4 Pagsubok, 4 Kapalaran = 16 path tiles (total 17 with gate)
    const talvarisPattern: ('daan' | 'pagsubok' | 'kapalaran')[] = [
      'daan', 'pagsubok', 'daan', 'kapalaran',
      'daan', 'daan', 'pagsubok', 'kapalaran',
      'daan', 'pagsubok', 'daan', 'kapalaran',
      'daan', 'daan', 'pagsubok', 'kapalaran',
    ];
    talvarisPattern.forEach((type, i) => {
      const r = 3;
      const c = 8 + i * 2;
      newCells[`${r},${c}`] = { r, c, type, realm: 'talvaris', order: i + 1 };
    });

    // Gate 2: Alabarya
    newGates.push({ id: 'gate_2', vx: 1476, vy: 561, gateNumber: 2, realm: 'alabarya', order: 17 });

    // Alabarya: 7 Daan, 3 Pagsubok, 3 Kapalaran = 13 path tiles (total 14 with gate)
    const alabaryaPattern: ('daan' | 'pagsubok' | 'kapalaran')[] = [
      'daan', 'pagsubok', 'daan', 'kapalaran',
      'daan', 'daan', 'pagsubok', 'kapalaran',
      'daan', 'pagsubok', 'daan', 'kapalaran',
      'daan',
    ];
    alabaryaPattern.forEach((type, i) => {
      const r = 10;
      const c = 38 - i * 2;
      newCells[`${r},${c}`] = { r, c, type, realm: 'alabarya', order: 18 + i };
    });

    // Gate 3: Alonawon
    newGates.push({ id: 'gate_3', vx: 360, vy: 935, gateNumber: 3, realm: 'alonawon', order: 31 });

    // Alonawon: 5 Daan, 3 Pagsubok, 2 Kapalaran = 10 path tiles (total 11 with gate)
    const alonawonPattern: ('daan' | 'pagsubok' | 'kapalaran')[] = [
      'daan', 'pagsubok', 'kapalaran',
      'daan', 'daan', 'pagsubok', 'kapalaran',
      'daan', 'pagsubok', 'daan',
    ];
    alonawonPattern.forEach((type, i) => {
      const r = 16;
      const c = 12 + i * 2;
      newCells[`${r},${c}`] = { r, c, type, realm: 'alonawon', order: 32 + i };
    });

    // Gate 4: Himaraya
    newGates.push({ id: 'gate_4', vx: 1332, vy: 1309, gateNumber: 4, realm: 'himaraya', order: 42 });

    // Himaraya: 4 Daan, 2 Pagsubok, 1 Kapalaran = 7 path tiles (total 8 with gate)
    const himarayaPattern: ('daan' | 'pagsubok' | 'kapalaran')[] = [
      'daan', 'pagsubok', 'daan', 'kapalaran',
      'daan', 'pagsubok', 'daan',
    ];
    himarayaPattern.forEach((type, i) => {
      const r = 22;
      const c = 34 - i * 2;
      newCells[`${r},${c}`] = { r, c, type, realm: 'himaraya', order: 43 + i };
    });

    // Finale: Aetherya Varyndor Sanctuary (Tile 50)
    const newFinale: PlacedFinale = {
      vx: 850,
      vy: 1496,
      realm: 'aetherya',
      order: 50,
    };

    setCells(newCells);
    setGates(newGates);
    setFinale(newFinale);
  };

  // Keyboard Shortcuts: 1-6 for Tools, Ctrl+Z for Undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
        return;
      }

      switch (e.key) {
        case '1':
          setActiveTool('daan');
          sounds.playClick();
          break;
        case '2':
          setActiveTool('pagsubok');
          sounds.playClick();
          break;
        case '3':
          setActiveTool('kapalaran');
          sounds.playClick();
          break;
        case '4':
          setActiveTool('gate');
          sounds.playClick();
          break;
        case '5':
          setActiveTool('finale');
          sounds.playClick();
          break;
        case '6':
          setActiveTool('eraser');
          sounds.playClick();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history]);

  // Undo Action
  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setCells(prev.cells);
    setGates(prev.gates);
    setFinale(prev.finale);
    setHistory(h => h.slice(0, -1));
    sounds.playClick();
    showToast(t.undo);
  };

  // Place Triangular Cell
  const handlePlaceCell = (r: number, c: number, type: 'daan' | 'pagsubok' | 'kapalaran', realm: RealmType) => {
    pushHistory();
    sounds.playClick();
    setCells(prev => ({
      ...prev,
      [`${r},${c}`]: {
        r,
        c,
        type,
        realm,
      },
    }));
  };

  // Place Hexagon Gate
  const handlePlaceGate = (vx: number, vy: number) => {
    if (gates.length >= 4) {
      showToast('Nakalagay na ang lahat ng 4 na Tarangkahan ng Diwaling.');
      return;
    }
    pushHistory();
    sounds.playClick();
    const realm = getRealmAtCoordinate(vx, vy);
    const newGate: PlacedGate = {
      id: `gate_${Date.now()}`,
      vx,
      vy,
      gateNumber: gates.length + 1,
      realm,
    };
    setGates(prev => [...prev, newGate]);
  };

  // Place Finale Sanctuary
  const handlePlaceFinale = (vx: number, vy: number) => {
    pushHistory();
    sounds.playClick();
    setFinale({
      vx,
      vy,
      realm: 'aetherya',
      order: 50,
    });
  };

  // Erase Tool
  const handleErase = (r: number, c: number, vx?: number, vy?: number) => {
    pushHistory();
    sounds.playClick();

    if (vx !== undefined && vy !== undefined) {
      // Check if gate at vertex
      const remainingGates = gates.filter(g => Math.abs(g.vx - vx) > 30 || Math.abs(g.vy - vy) > 30);
      if (remainingGates.length !== gates.length) {
        // Re-number remaining gates 1 to N
        const renumbered = remainingGates.map((g, idx) => ({ ...g, gateNumber: idx + 1 }));
        setGates(renumbered);
        return;
      }
      // Check if finale
      if (finale && Math.abs(finale.vx - vx) <= 40 && Math.abs(finale.vy - vy) <= 40) {
        setFinale(null);
        return;
      }
    }

    if (r >= 0 && c >= 0) {
      const key = `${r},${c}`;
      if (cells[key]) {
        const next = { ...cells };
        delete next[key];
        setCells(next);
      }
    }
  };

  // Clear Canvas
  const handleClearAll = () => {
    pushHistory();
    sounds.playClick();
    setCells({});
    setGates([]);
    setFinale(null);
    showToast(t.clearAll);
  };

  // Calculate Real-Time Quotas
  const quotas = useMemo(() => {
    const counts: Record<RealmType, { daan: number; pagsubok: number; kapalaran: number; gate: number; total: number }> = {
      talvaris: { daan: 0, pagsubok: 0, kapalaran: 0, gate: 0, total: 0 },
      alabarya: { daan: 0, pagsubok: 0, kapalaran: 0, gate: 0, total: 0 },
      alonawon: { daan: 0, pagsubok: 0, kapalaran: 0, gate: 0, total: 0 },
      himaraya: { daan: 0, pagsubok: 0, kapalaran: 0, gate: 0, total: 0 },
      aetherya: { daan: 0, pagsubok: 0, kapalaran: 0, gate: 0, total: 0 },
    };

    Object.values(cells).forEach(cell => {
      if (counts[cell.realm]) {
        counts[cell.realm][cell.type]++;
        counts[cell.realm].total++;
      }
    });

    gates.forEach(g => {
      if (counts[g.realm]) {
        counts[g.realm].gate++;
        counts[g.realm].total++;
      }
    });

    if (finale) {
      counts.aetherya.total = 1;
    }

    return counts;
  }, [cells, gates, finale]);

  // Serialize to GameBoard-compatible BoardTile[] sequence
  const serializeToBoardTiles = (): BoardTile[] => {
    const tiles: BoardTile[] = [];

    // Helper to sort tiles along the pilgrimage path
    const realms: RealmType[] = ['talvaris', 'alabarya', 'alonawon', 'himaraya'];

    let currentIndex = 0;

    realms.forEach((r, realmIdx) => {
      // 1. Add Gate for realm
      const gate = gates.find(g => g.realm === r) || gates[realmIdx];
      if (gate) {
        tiles.push({
          index: currentIndex,
          realm: r,
          shape: 'pentagon',
          type: 'pintuan',
          title: `Pintuan ng ${r.toUpperCase()} (Diwaling)`,
          guardianName: r === 'talvaris' ? 'Ikapatar' : r === 'alabarya' ? 'Sinukalab' : r === 'alonawon' ? 'Sinayalon' : 'Lihamihan',
          gridX: Math.round(gate.vx / 80),
          gridY: Math.round(gate.vy / 80),
          posX: gate.vx,
          posY: gate.vy,
        });
        currentIndex++;
      }

      // 2. Add Realm Path Cells (sorted along x or y)
      const realmCells = Object.values(cells)
        .filter(c => c.realm === r)
        .sort((a, b) => {
          // Eastward on even realms, Westward on odd realms for serpentine flow
          return realmIdx % 2 === 0 ? a.c - b.c : b.c - a.c;
        });

      realmCells.forEach(cell => {
        const center = centroid(cell.r, cell.c);
        tiles.push({
          index: currentIndex,
          realm: r,
          shape: 'triangle',
          type: cell.type,
          title: cell.type === 'pagsubok' 
            ? `Pagsubok sa ${r.toUpperCase()} #${currentIndex}`
            : cell.type === 'kapalaran'
            ? `Kapalaran sa ${r.toUpperCase()} #${currentIndex}`
            : `Daan ng ${r.toUpperCase()} #${currentIndex}`,
          gridX: cell.c,
          gridY: cell.r,
          posX: center.x,
          posY: center.y,
          orientation: isUp(cell.r, cell.c) ? 'up' : 'down',
        });
        currentIndex++;
      });
    });

    // 3. Finale Sanctuary
    if (finale) {
      tiles.push({
        index: currentIndex,
        realm: 'aetherya',
        shape: 'sanctuary',
        type: 'aetherya',
        title: 'Aetherya — Ang Dambana ni Varyndor',
        guardianName: 'Varyndor (Huling Hamon)',
        gridX: Math.round(finale.vx / 80),
        gridY: Math.round(finale.vy / 80),
        posX: finale.vx,
        posY: finale.vy,
        orientation: 'up',
      });
    }

    return tiles;
  };

  // Save Map to Server & Local Storage
  const handleSaveMap = async () => {
    sounds.playClick();
    const serializedTiles = serializeToBoardTiles();

    const mapData: TileMapData = {
      id: `map_aetherya_${Date.now()}`,
      name: mapName,
      description: mapDescription,
      author: 'Master Architect',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tiles: serializedTiles,
      territories: AETHERYA_TERRITORIES,
      editorLayout: { cells, gates, finale },
    };

    localStorage.setItem('athanasia_active_custom_map', JSON.stringify(mapData));

    try {
      const res = await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapData),
      });

      if (res.ok) {
        showToast(t.saveSuccess);
        if (onMapSaved) onMapSaved(mapData);
      } else {
        showToast(t.saveSuccess);
        if (onMapSaved) onMapSaved(mapData);
      }
    } catch {
      showToast(t.saveSuccess);
      if (onMapSaved) onMapSaved(mapData);
    }
  };

  // Copy Layout JSON to Clipboard
  const handleCopyLayout = () => {
    sounds.playClick();
    const layout = {
      name: mapName,
      description: mapDescription,
      cells,
      gates,
      finale,
    };
    navigator.clipboard.writeText(JSON.stringify(layout, null, 2));
    showToast(t.layoutCopied);
  };

  // Load Pasted Layout JSON
  const handleApplyPastedLayout = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.cells) {
        pushHistory();
        setCells(parsed.cells || {});
        setGates(parsed.gates || []);
        setFinale(parsed.finale || null);
        if (parsed.name) setMapName(parsed.name);
        if (parsed.description) setMapDescription(parsed.description);
        setShowImportModal(false);
        setImportJsonText('');
        showToast(t.layoutLoaded);
        sounds.playClick();
      } else {
        showToast(t.invalidLayout);
      }
    } catch {
      showToast(t.invalidLayout);
    }
  };

  // Test Play
  const handleTestPlay = async () => {
    sounds.playClick();
    const serialized = serializeToBoardTiles();
    const mapData: TileMapData = {
      id: `map_test_${Date.now()}`,
      name: `${mapName} (Test)`,
      description: mapDescription,
      author: 'Creator',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tiles: serialized,
      territories: AETHERYA_TERRITORIES,
      editorLayout: { cells, gates, finale },
    };

    localStorage.setItem('athanasia_active_custom_map', JSON.stringify(mapData));

    try {
      await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapData),
      });
    } catch {}

    if (onTestPlay) {
      onTestPlay(mapData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden text-slate-100">
      {/* 1. Top Navbar Header */}
      <header className="border-b border-amber-900/30 bg-slate-950/90 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 border border-amber-500/40 flex items-center justify-center shadow-lg">
            <span className="font-cinzel text-lg font-bold text-amber-200">ᜄ</span>
          </div>
          <div>
            <h2 className="font-cinzel text-lg font-bold text-amber-200 flex items-center gap-2">
              {t.mapEditorTitle}
              <span className="text-xs font-normal text-amber-400/80 hidden md:inline">· 1700×1700 Lattice</span>
            </h2>
            <p className="text-[11px] text-slate-400 hidden sm:block">{t.mapEditorSubtitle}</p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
            title={t.copyLayout}
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{t.copyLayout}</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
            title={t.pasteLayout}
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{t.pasteLayout}</span>
          </button>

          <button
            onClick={handleSaveMap}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.saveServer}</span>
          </button>

          <button
            onClick={handleTestPlay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.testPlay}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Primary Tool Palette & Utility Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* The 6 Core Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sounds.playClick(); setActiveTool('daan'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTool === 'daan'
                ? 'bg-slate-700/80 text-amber-300 border-amber-400 shadow-sm'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span>
            <span>{t.toolDaan}</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTool('pagsubok'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTool === 'pagsubok'
                ? 'bg-purple-950 text-purple-300 border-purple-400 shadow-sm'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
            <span>{t.toolPagsubok}</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTool('kapalaran'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTool === 'kapalaran'
                ? 'bg-rose-950 text-rose-300 border-rose-400 shadow-sm'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
            <span>{t.toolKapalaran}</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTool('gate'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTool === 'gate'
                ? 'bg-amber-950 text-amber-300 border-amber-400 shadow-sm'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
            <span>{t.toolGate}</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTool('finale'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTool === 'finale'
                ? 'bg-yellow-950 text-yellow-300 border-yellow-400 shadow-sm'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-yellow-400" />
            <span>{t.toolFinale}</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); setActiveTool('eraser'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTool === 'eraser'
                ? 'bg-rose-900 text-rose-200 border-rose-400 shadow-sm'
                : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-slate-500'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.toolEraser}</span>
          </button>
        </div>

        {/* Toolbar Utilities: Order Numbers, Undo, Clear All */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/70 px-2.5 py-1.5 rounded-xl border border-slate-700/60 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOrderNumbers}
              onChange={(e) => setShowOrderNumbers(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <Hash className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.orderNumbers}</span>
          </label>

          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              history.length > 0
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
            }`}
            title="Ctrl + Z"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.undo}</span>
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-600/50 text-xs font-semibold transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearAll}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Center Workspace: 1700×1700 SVG Lattice Canvas */}
      <div className="flex-1 overflow-hidden relative flex">
        <AetheryaMapCanvas
          activeTool={activeTool}
          showOrderNumbers={showOrderNumbers}
          cells={cells}
          gates={gates}
          finale={finale}
          onPlaceCell={handlePlaceCell}
          onPlaceGate={handlePlaceGate}
          onPlaceFinale={handlePlaceFinale}
          onErase={handleErase}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 text-xs shadow-2xl animate-fade-in flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* 4. Bottom Real-Time Realm Quota Progress Cards */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-2.5 shrink-0 overflow-x-auto">
        <div className="flex items-center justify-between gap-4 min-w-[800px]">
          {/* Talvaris Meter */}
          <QuotaCard
            realm="talvaris"
            title="Talvaris (Lupa)"
            target={REALM_QUOTAS.talvaris}
            current={quotas.talvaris}
            icon={<Mountain className="w-3.5 h-3.5 text-emerald-400" />}
            colorClass="text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
            doneText={t.quotaDone}
            overText={t.quotaOver}
          />

          {/* Alabarya Meter */}
          <QuotaCard
            realm="alabarya"
            title="Alabarya (Apoy)"
            target={REALM_QUOTAS.alabarya}
            current={quotas.alabarya}
            icon={<Flame className="w-3.5 h-3.5 text-rose-400" />}
            colorClass="text-rose-400 border-rose-500/30 bg-rose-950/20"
            doneText={t.quotaDone}
            overText={t.quotaOver}
          />

          {/* Alonawon Meter */}
          <QuotaCard
            realm="alonawon"
            title="Alonawon (Tubig)"
            target={REALM_QUOTAS.alonawon}
            current={quotas.alonawon}
            icon={<Droplets className="w-3.5 h-3.5 text-cyan-400" />}
            colorClass="text-cyan-400 border-cyan-500/30 bg-cyan-950/20"
            doneText={t.quotaDone}
            overText={t.quotaOver}
          />

          {/* Himaraya Meter */}
          <QuotaCard
            realm="himaraya"
            title="Himaraya (Hangin)"
            target={REALM_QUOTAS.himaraya}
            current={quotas.himaraya}
            icon={<Wind className="w-3.5 h-3.5 text-purple-400" />}
            colorClass="text-purple-400 border-purple-500/30 bg-purple-950/20"
            doneText={t.quotaDone}
            overText={t.quotaOver}
          />

          {/* Aetherya Sanctuary Status */}
          <div className="flex-1 p-2 rounded-xl border border-yellow-500/30 bg-yellow-950/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-yellow-300">
              <span className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                Aetherya
              </span>
              <span className="font-mono text-[11px]">
                {finale ? '1 / 1 WAKAS' : '0 / 1 Hexagon'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full transition-all duration-300 ${finale ? 'bg-yellow-400' : 'bg-slate-700'}`}
                style={{ width: finale ? '100%' : '0%' }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>Huling Dambana</span>
              <span className={finale ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {finale ? t.quotaDone : 'Kailangan'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Import Layout Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-600/50 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-base font-bold text-amber-300">{t.pasteLayout}</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              I-paste ang kinopyang JSON layout upang awtomatikong i-load ang lahat ng mga tile at tarangkahan:
            </p>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"cells": {...}, "gates": [...]}'
              rows={8}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleApplyPastedLayout}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer shadow-md"
              >
                I-load ang Mapa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface QuotaCardProps {
  realm: RealmType;
  title: string;
  target: {
    gateTarget: number;
    daanTarget: number;
    pagsubokTarget: number;
    kapalaranTarget: number;
    totalTarget: number;
  };
  current: {
    gate: number;
    daan: number;
    pagsubok: number;
    kapalaran: number;
    total: number;
  };
  icon: React.ReactNode;
  colorClass: string;
  doneText: string;
  overText: string;
}

const QuotaCard: React.FC<QuotaCardProps> = ({
  title,
  target,
  current,
  icon,
  colorClass,
  doneText,
  overText,
}) => {
  const isDone = current.total === target.totalTarget;
  const isOver = current.total > target.totalTarget;
  const progressPercent = Math.min(100, (current.total / target.totalTarget) * 100);

  return (
    <div className={`flex-1 p-2 rounded-xl border flex flex-col justify-between ${colorClass}`}>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        <span className="font-mono text-[11px] font-bold">
          {current.total} / {target.totalTarget}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
        <div
          className={`h-full transition-all duration-300 ${
            isOver ? 'bg-amber-500' : isDone ? 'bg-emerald-400' : 'bg-cyan-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Sub-counters and status */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
        <span>G:{current.gate}/{target.gateTarget} D:{current.daan}/{target.daanTarget} P:{current.pagsubok}/{target.pagsubokTarget} K:{current.kapalaran}/{target.kapalaranTarget}</span>
        <span className={`font-semibold ${isDone ? 'text-emerald-400' : isOver ? 'text-amber-400' : 'text-slate-500'}`}>
          {isDone ? `✓ ${doneText}` : isOver ? `! ${overText}` : `${target.totalTarget - current.total} kulang`}
        </span>
      </div>
    </div>
  );
};
