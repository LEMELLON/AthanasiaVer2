/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useMemo } from 'react';
import { 
  LATTICE_WIDTH, 
  LATTICE_HEIGHT, 
  corners, 
  cellPts, 
  centroid, 
  hitCell, 
  hitVertex, 
  hexPts, 
  getRealmAtCoordinate,
  Point2D
} from '../../utils/aetheryaLattice';
import { RealmType } from '../../types/game';

export type EditorTool = 'daan' | 'pagsubok' | 'kapalaran' | 'gate' | 'finale' | 'eraser';

export interface PlacedCell {
  r: number;
  c: number;
  type: 'daan' | 'pagsubok' | 'kapalaran';
  realm: RealmType;
  order?: number;
}

export interface PlacedGate {
  id: string;
  vx: number;
  vy: number;
  gateNumber: number; // 1 to 4
  realm: RealmType;
  order?: number;
}

export interface PlacedFinale {
  vx: number;
  vy: number;
  realm: 'aetherya';
  order?: number;
}

interface AetheryaMapCanvasProps {
  activeTool: EditorTool;
  showOrderNumbers: boolean;
  cells: Record<string, PlacedCell>;
  gates: PlacedGate[];
  finale: PlacedFinale | null;
  onPlaceCell: (r: number, c: number, type: 'daan' | 'pagsubok' | 'kapalaran', realm: RealmType) => void;
  onPlaceGate: (vx: number, vy: number) => void;
  onPlaceFinale: (vx: number, vy: number) => void;
  onErase: (r: number, c: number, vx?: number, vy?: number) => void;
}

export const AetheryaMapCanvas: React.FC<AetheryaMapCanvasProps> = ({
  activeTool,
  showOrderNumbers,
  cells,
  gates,
  finale,
  onPlaceCell,
  onPlaceGate,
  onPlaceFinale,
  onErase,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);
  const [hoverVertex, setHoverVertex] = useState<{ vx: number; vy: number } | null>(null);

  // Convert client mouse event to SVG 1700x1700 coordinate space
  const getSvgCoordinates = (e: React.MouseEvent<SVGSVGElement>): Point2D | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = LATTICE_WIDTH / rect.width;
    const scaleY = LATTICE_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgCoordinates(e);
    if (!pt) return;

    if (activeTool === 'gate' || activeTool === 'finale') {
      const v = hitVertex(pt.x, pt.y, 48);
      if (v) {
        setHoverVertex({ vx: v.vx, vy: v.vy });
        setHoverCell(null);
      } else {
        setHoverVertex(null);
      }
    } else {
      const c = hitCell(pt.x, pt.y);
      setHoverCell(c);
      setHoverVertex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverCell(null);
    setHoverVertex(null);
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgCoordinates(e);
    if (!pt) return;

    if (activeTool === 'eraser') {
      // Check if clicking near a gate or finale first
      const v = hitVertex(pt.x, pt.y, 56);
      if (v) {
        onErase(-1, -1, v.vx, v.vy);
        return;
      }
      // Otherwise erase triangular cell
      const c = hitCell(pt.x, pt.y);
      if (c) {
        onErase(c.r, c.c);
      }
      return;
    }

    if (activeTool === 'gate') {
      const v = hitVertex(pt.x, pt.y, 56);
      if (v) {
        onPlaceGate(v.vx, v.vy);
      }
      return;
    }

    if (activeTool === 'finale') {
      const v = hitVertex(pt.x, pt.y, 70);
      if (v) {
        onPlaceFinale(v.vx, v.vy);
      }
      return;
    }

    // Standard tile placement (daan, pagsubok, kapalaran)
    const c = hitCell(pt.x, pt.y);
    if (c) {
      const realm = getRealmAtCoordinate(pt.x, pt.y);
      onPlaceCell(c.r, c.c, activeTool as 'daan' | 'pagsubok' | 'kapalaran', realm);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-auto bg-slate-950 p-2 select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${LATTICE_WIDTH} ${LATTICE_HEIGHT}`}
        className="w-full max-w-[900px] h-auto aspect-square border border-amber-900/40 rounded-3xl shadow-2xl bg-[#090d14] cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <defs>
          {/* Subtle Realm Gradients */}
          <radialGradient id="talvarisGlow" cx="20%" cy="15%" r="60%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.01" />
          </radialGradient>
          <radialGradient id="alabaryaGlow" cx="80%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.01" />
          </radialGradient>
          <radialGradient id="alonawonGlow" cx="20%" cy="65%" r="60%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.01" />
          </radialGradient>
          <radialGradient id="himarayaGlow" cx="80%" cy="85%" r="60%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.01" />
          </radialGradient>
          <radialGradient id="aetheryaGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </radialGradient>

          {/* Daan Filigree Motif Filter / Pattern */}
          <linearGradient id="daanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Pagsubok Sun Sigil Gradient */}
          <linearGradient id="pagsubokGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b21a8" />
            <stop offset="50%" stopColor="#4c1d95" />
            <stop offset="100%" stopColor="#2e1065" />
          </linearGradient>

          {/* Kapalaran Ruby Flame Gradient */}
          <linearGradient id="kapalaranGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="50%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>

          {/* Gate Hexagon Gradient */}
          <radialGradient id="gateGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#eab308" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#713f12" stopOpacity="0.8" />
          </radialGradient>

          {/* Finale Varyndor Hexagon Gradient */}
          <radialGradient id="finaleGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fef9c3" stopOpacity="1" />
            <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* 1. Serpentine Realm Territories Background Polygons */}
        <g id="realm-territories">
          {/* Talvaris Territory (Top) */}
          <path
            d="M 60,60 L 1640,60 Q 1660,260 1600,450 L 60,450 Z"
            fill="url(#talvarisGlow)"
            stroke="#059669"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.6"
          />
          <text x="120" y="110" fill="#34d399" fontSize="22" fontFamily="Cinzel" fontWeight="bold" opacity="0.7">
            TALVARIS — LUPA (EARTH REALM)
          </text>

          {/* Alabarya Territory (Upper Mid) */}
          <path
            d="M 60,460 L 1640,460 Q 1660,670 1600,870 L 60,870 Z"
            fill="url(#alabaryaGlow)"
            stroke="#dc2626"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.6"
          />
          <text x="120" y="510" fill="#f87171" fontSize="22" fontFamily="Cinzel" fontWeight="bold" opacity="0.7">
            ALABARYA — APOY (FIRE REALM)
          </text>

          {/* Alonawon Territory (Lower Mid) */}
          <path
            d="M 60,880 L 1640,880 Q 1660,1070 1600,1260 L 60,1260 Z"
            fill="url(#alonawonGlow)"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.6"
          />
          <text x="120" y="930" fill="#38bdf8" fontSize="22" fontFamily="Cinzel" fontWeight="bold" opacity="0.7">
            ALONAWON — TUBIG (WATER REALM)
          </text>

          {/* Himaraya Territory (Bottom) */}
          <path
            d="M 60,1270 L 1640,1270 Q 1660,1470 1600,1640 L 60,1640 Z"
            fill="url(#himarayaGlow)"
            stroke="#9333ea"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.6"
          />
          <text x="120" y="1320" fill="#c084fc" fontSize="22" fontFamily="Cinzel" fontWeight="bold" opacity="0.7">
            HIMARAYA — HANGIN (AIR REALM)
          </text>

          {/* Aetherya Sanctuary Center Zone */}
          <circle
            cx="850"
            cy="950"
            r="190"
            fill="url(#aetheryaGlow)"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity="0.8"
          />
          <text x="850" y="910" textAnchor="middle" fill="#fde047" fontSize="24" fontFamily="Cinzel" fontWeight="900" opacity="0.85">
            AETHERYA
          </text>
          <text x="850" y="934" textAnchor="middle" fill="#fef08a" fontSize="13" fontFamily="Plus Jakarta Sans" letterSpacing="3" opacity="0.7">
            VARYNDOR SANCTUARY
          </text>
        </g>

        {/* 2. Background Triangular Lattice Mesh (Subtle Guidelines) */}
        <g id="lattice-mesh" opacity="0.14" stroke="#475569" strokeWidth="0.8" fill="none">
          {Array.from({ length: 26 }).map((_, r) => (
            <React.Fragment key={`row-${r}`}>
              {Array.from({ length: 44 }).map((_, c) => (
                <polygon key={`grid-${r}-${c}`} points={cellPts(r + 1, c + 2)} />
              ))}
            </React.Fragment>
          ))}
        </g>

        {/* 3. Placed Triangular Cells (Daan, Pagsubok, Kapalaran) */}
        <g id="placed-cells">
          {Object.entries(cells).map(([key, cell]) => {
            const pts = cellPts(cell.r, cell.c);
            const center = centroid(cell.r, cell.c);

            let fill = 'url(#daanGrad)';
            let stroke = '#64748b';
            let iconText = 'ᜇ'; // Baybayin 'Da' for Daan

            if (cell.type === 'pagsubok') {
              fill = 'url(#pagsubokGrad)';
              stroke = '#a855f7';
              iconText = 'ᜉ'; // Baybayin 'Pa' for Pagsubok
            } else if (cell.type === 'kapalaran') {
              fill = 'url(#kapalaranGrad)';
              stroke = '#f43f5e';
              iconText = 'ᜃ'; // Baybayin 'Ka' for Kapalaran
            }

            return (
              <g key={key} className="transition-all hover:brightness-125 cursor-pointer">
                {/* Base Triangle Polygon */}
                <polygon
                  points={pts}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2.5"
                  className="filter drop-shadow-md"
                />

                {/* Inner Decorative Sigil */}
                <circle
                  cx={center.x}
                  cy={center.y}
                  r="13"
                  fill="#000000"
                  fillOpacity="0.45"
                  stroke={stroke}
                  strokeWidth="1"
                />

                {/* Baybayin Emblem */}
                <text
                  x={center.x}
                  y={center.y + 4.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  opacity="0.85"
                >
                  {iconText}
                </text>

                {/* Order Badge (if enabled) */}
                {showOrderNumbers && cell.order !== undefined && (
                  <g>
                    <rect
                      x={center.x - 14}
                      y={center.y - 24}
                      width="28"
                      height="15"
                      rx="4"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                    <text
                      x={center.x}
                      y={center.y - 13}
                      textAnchor="middle"
                      fill="#fef08a"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      #{cell.order}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 4. Placed Diwaling Guardian Gates (Hexagons) */}
        <g id="placed-gates">
          {gates.map((g) => {
            const hPoints = hexPts(g.vx, g.vy, 52);
            return (
              <g key={g.id} className="transition-all hover:brightness-125 cursor-pointer">
                {/* Outer Hexagon */}
                <polygon
                  points={hPoints}
                  fill="url(#gateGrad)"
                  stroke="#fef08a"
                  strokeWidth="3.5"
                  className="filter drop-shadow-xl"
                />

                {/* Inner Hexagon Border */}
                <polygon
                  points={hexPts(g.vx, g.vy, 40)}
                  fill="#1a1306"
                  stroke="#eab308"
                  strokeWidth="1.8"
                />

                {/* Gate Number & Guardian Title */}
                <text
                  x={g.vx}
                  y={g.vy - 7}
                  textAnchor="middle"
                  fill="#fef08a"
                  fontSize="13"
                  fontFamily="Cinzel"
                  fontWeight="900"
                >
                  GATE {g.gateNumber}
                </text>
                <text
                  x={g.vx}
                  y={g.vy + 12}
                  textAnchor="middle"
                  fill="#facc15"
                  fontSize="10"
                  fontFamily="Cinzel"
                  fontWeight="bold"
                  opacity="0.9"
                >
                  DIWALING
                </text>

                {/* Order Badge */}
                {showOrderNumbers && g.order !== undefined && (
                  <g>
                    <rect
                      x={g.vx - 16}
                      y={g.vy - 44}
                      width="32"
                      height="16"
                      rx="4"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                    />
                    <text
                      x={g.vx}
                      y={g.vy - 32}
                      textAnchor="middle"
                      fill="#fde047"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      #{g.order}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 5. Aetherya Finale Sanctuary (Grand Hexagon) */}
        {finale && (
          <g id="placed-finale" className="transition-all hover:scale-105 cursor-pointer">
            <polygon
              points={hexPts(finale.vx, finale.vy, 72)}
              fill="url(#finaleGrad)"
              stroke="#fef08a"
              strokeWidth="5"
              className="filter drop-shadow-2xl animate-pulse"
            />
            <polygon
              points={hexPts(finale.vx, finale.vy, 56)}
              fill="#2e1b04"
              stroke="#facc15"
              strokeWidth="2"
            />
            <text
              x={finale.vx}
              y={finale.vy - 6}
              textAnchor="middle"
              fill="#fef9c3"
              fontSize="16"
              fontFamily="Cinzel"
              fontWeight="900"
            >
              VARYNDOR
            </text>
            <text
              x={finale.vx}
              y={finale.vy + 14}
              textAnchor="middle"
              fill="#fde047"
              fontSize="11"
              fontFamily="Cinzel"
              fontWeight="bold"
              letterSpacing="2"
            >
              WAKAS · 50
            </text>
          </g>
        )}

        {/* 6. Active Hover Highlight */}
        {hoverCell && (activeTool === 'daan' || activeTool === 'pagsubok' || activeTool === 'kapalaran' || activeTool === 'eraser') && (
          <polygon
            points={cellPts(hoverCell.r, hoverCell.c)}
            fill={activeTool === 'eraser' ? '#f43f5e' : '#fef08a'}
            fillOpacity={activeTool === 'eraser' ? 0.35 : 0.28}
            stroke={activeTool === 'eraser' ? '#f43f5e' : '#f59e0b'}
            strokeWidth="3"
            strokeDasharray="4 2"
            pointerEvents="none"
          />
        )}

        {hoverVertex && (activeTool === 'gate' || activeTool === 'finale') && (
          <polygon
            points={hexPts(hoverVertex.vx, hoverVertex.vy, activeTool === 'finale' ? 72 : 52)}
            fill="#facc15"
            fillOpacity="0.3"
            stroke="#fde047"
            strokeWidth="3.5"
            strokeDasharray="6 3"
            pointerEvents="none"
          />
        )}
      </svg>
    </div>
  );
};
