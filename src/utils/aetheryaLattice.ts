/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RealmType } from '../types/game';

export const LATTICE_WIDTH = 1700;
export const LATTICE_HEIGHT = 1700;
export const TILE_W = 72;
export const TILE_HT = TILE_W * 0.8660254; // ~62.3538px equilateral height

export const MAX_ROWS = Math.ceil(LATTICE_HEIGHT / TILE_HT); // ~28
export const MAX_COLS = Math.ceil(LATTICE_WIDTH / (TILE_W / 2)); // ~48

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Determines whether a triangular cell in row `r` and column `c` points upwards.
 */
export function isUp(r: number, c: number): boolean {
  return (r + c) % 2 === 0;
}

/**
 * Calculates the 3 corners of the equilateral triangular cell (r, c).
 */
export function corners(r: number, c: number): [Point2D, Point2D, Point2D] {
  const halfW = TILE_W / 2;
  const up = isUp(r, c);

  if (up) {
    // Apex at top, horizontal base at bottom (r + 1) * HT
    return [
      { x: (c + 1) * halfW, y: r * TILE_HT },
      { x: (c + 2) * halfW, y: (r + 1) * TILE_HT },
      { x: c * halfW, y: (r + 1) * TILE_HT },
    ];
  } else {
    // Horizontal base at top r * HT, apex at bottom (r + 1) * HT
    return [
      { x: c * halfW, y: r * TILE_HT },
      { x: (c + 2) * halfW, y: r * TILE_HT },
      { x: (c + 1) * halfW, y: (r + 1) * TILE_HT },
    ];
  }
}

/**
 * Returns SVG points attribute string for polygon rendering.
 */
export function cellPts(r: number, c: number): string {
  const pts = corners(r, c);
  return `${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)} ${pts[1].x.toFixed(1)},${pts[1].y.toFixed(1)} ${pts[2].x.toFixed(1)},${pts[2].y.toFixed(1)}`;
}

/**
 * Computes the geometric centroid of the triangle (r, c).
 */
export function centroid(r: number, c: number): Point2D {
  const halfW = TILE_W / 2;
  const cx = (c + 1) * halfW;
  const cy = isUp(r, c)
    ? (r + 2 / 3) * TILE_HT
    : (r + 1 / 3) * TILE_HT;
  return { x: cx, y: cy };
}

/**
 * Tests if point (px, py) is inside triangle defined by p0, p1, p2.
 */
function isPointInTriangle(p: Point2D, a: Point2D, b: Point2D, c: Point2D): boolean {
  const area = 0.5 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
  const s = 1 / (2 * area) * (a.y * c.x - a.x * c.y + (c.y - a.y) * p.x + (a.x - c.x) * p.y);
  const t = 1 / (2 * area) * (a.x * b.y - a.y * b.x + (a.y - b.y) * p.x + (b.x - a.x) * p.y);
  return s >= -0.01 && t >= -0.01 && (s + t) <= 1.01;
}

/**
 * Detects which triangular cell contains the coordinate (x, y).
 */
export function hitCell(x: number, y: number): { r: number; c: number } | null {
  if (x < 0 || x > LATTICE_WIDTH || y < 0 || y > LATTICE_HEIGHT) return null;

  const r = Math.floor(y / TILE_HT);
  const approxC = Math.floor(x / (TILE_W / 2));

  // Test candidate columns in row r
  for (let c = Math.max(0, approxC - 2); c <= Math.min(MAX_COLS, approxC + 2); c++) {
    const pts = corners(r, c);
    if (isPointInTriangle({ x, y }, pts[0], pts[1], pts[2])) {
      return { r, c };
    }
  }

  return { r, c: Math.max(0, approxC) };
}

/**
 * Detects if click is near a lattice vertex for hexagon gate placement.
 */
export function hitVertex(x: number, y: number, tolerance = 32): { vx: number; vy: number; r: number; k: number } | null {
  const r = Math.round(y / TILE_HT);
  const k = Math.round(x / (TILE_W / 2));

  // In our lattice, vertices occur where (r + k) is even
  const validK = (r + k) % 2 === 0 ? k : (Math.abs(x - (k - 1) * (TILE_W / 2)) < Math.abs(x - (k + 1) * (TILE_W / 2)) ? k - 1 : k + 1);

  const vx = validK * (TILE_W / 2);
  const vy = r * TILE_HT;

  const distSq = (x - vx) * (x - vx) + (y - vy) * (y - vy);
  if (distSq <= tolerance * tolerance) {
    return { vx, vy, r, k: validK };
  }

  return null;
}

/**
 * Returns the 6 triangles that share vertex (vx, vy).
 */
export function cellsAtVertex(r: number, k: number): { r: number; c: number }[] {
  return [
    { r: r - 1, c: k - 2 },
    { r: r - 1, c: k - 1 },
    { r: r - 1, c: k },
    { r, c: k - 2 },
    { r, c: k - 1 },
    { r, c: k },
  ];
}

/**
 * Returns SVG polygon points for a gate hexagon centered at (vx, vy).
 */
export function hexPts(vx: number, vy: number, radius = TILE_W): string {
  const pts: Point2D[] = [
    { x: vx + radius, y: vy },
    { x: vx + radius / 2, y: vy + TILE_HT },
    { x: vx - radius / 2, y: vy + TILE_HT },
    { x: vx - radius, y: vy },
    { x: vx - radius / 2, y: vy - TILE_HT },
    { x: vx + radius / 2, y: vy - TILE_HT },
  ];
  return pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

/**
 * Determines realm territory based on coordinate (y).
 */
export function getRealmAtCoordinate(x: number, y: number): RealmType {
  // Aetherya sanctum in the central-bottom golden plateau
  if (x >= 650 && x <= 1050 && y >= 750 && y <= 1150) {
    return 'aetherya';
  }

  if (y < 460) return 'talvaris';
  if (y < 880) return 'alabarya';
  if (y < 1260) return 'alonawon';
  return 'himaraya';
}

/**
 * Quota definitions for the 5 realms
 */
export interface RealmQuota {
  realm: RealmType;
  name: string;
  gateTarget: number;
  daanTarget: number;
  pagsubokTarget: number;
  kapalaranTarget: number;
  totalTarget: number;
  color: string;
}

export const REALM_QUOTAS: Record<RealmType, RealmQuota> = {
  talvaris: {
    realm: 'talvaris',
    name: 'Talvaris (Lupa)',
    gateTarget: 1,
    daanTarget: 8,
    pagsubokTarget: 4,
    kapalaranTarget: 4,
    totalTarget: 17,
    color: '#059669',
  },
  alabarya: {
    realm: 'alabarya',
    name: 'Alabarya (Apoy)',
    gateTarget: 1,
    daanTarget: 7,
    pagsubokTarget: 3,
    kapalaranTarget: 3,
    totalTarget: 14,
    color: '#dc2626',
  },
  alonawon: {
    realm: 'alonawon',
    name: 'Alonawon (Tubig)',
    gateTarget: 1,
    daanTarget: 5,
    pagsubokTarget: 3,
    kapalaranTarget: 2,
    totalTarget: 11,
    color: '#0284c7',
  },
  himaraya: {
    realm: 'himaraya',
    name: 'Himaraya (Hangin)',
    gateTarget: 1,
    daanTarget: 4,
    pagsubokTarget: 2,
    kapalaranTarget: 1,
    totalTarget: 8,
    color: '#9333ea',
  },
  aetherya: {
    realm: 'aetherya',
    name: 'Aetherya (Sanctuary)',
    gateTarget: 0,
    daanTarget: 0,
    pagsubokTarget: 0,
    kapalaranTarget: 0,
    totalTarget: 1, // Finale hexagon
    color: '#f59e0b',
  },
};
