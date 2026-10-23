import { BoardTile, RealmTerritory, TileMapData } from '../types/game';
import { CANONICAL_BOARD_TILES } from './canonicalCards';
import { centroid, isUp } from '../utils/aetheryaLattice';

/**
 * Builds the canonical 50-space serpentine interlocking tile map with exact
 * 1700x1700 geometric coordinates matching the Aetherya lattice editor.
 */
export function buildCanonicalMapData(): TileMapData {
  // Pre-calculated lattice coordinates for the 50-tile serpentine path matching seedCanonicalTemplate
  const tiles: BoardTile[] = CANONICAL_BOARD_TILES.map((t) => {
    let posX = 100;
    let posY = 100;
    let gridX = t.gridX ?? 0;
    let gridY = t.gridY ?? 0;
    let orientation: 'up' | 'down' = 'up';

    if (t.index === 0) {
      // Start tile right before Gate 1
      gridY = 3;
      gridX = 6;
      const c = centroid(3, 6);
      posX = c.x;
      posY = c.y;
      orientation = isUp(3, 6) ? 'up' : 'down';
    } else if (t.index === 1) {
      // Gate 1: Talvaris Entrance Hexagon
      gridY = 3;
      gridX = 7;
      posX = 216;
      posY = 187;
      orientation = 'up';
    } else if (t.index >= 2 && t.index <= 17) {
      // Talvaris Path: row 3, columns 8 to 38 (Eastward)
      const i = t.index - 2;
      gridY = 3;
      gridX = 8 + i * 2;
      const c = centroid(gridY, gridX);
      posX = c.x;
      posY = c.y;
      orientation = isUp(gridY, gridX) ? 'up' : 'down';
    } else if (t.index === 18) {
      // Gate 2: Alabarya Entrance Hexagon
      gridY = 10;
      gridX = 40;
      posX = 1476;
      posY = 561;
      orientation = 'up';
    } else if (t.index >= 19 && t.index <= 31) {
      // Alabarya Path: row 10, columns 38 down to 14 (Westward)
      const i = t.index - 19;
      gridY = 10;
      gridX = 38 - i * 2;
      const c = centroid(gridY, gridX);
      posX = c.x;
      posY = c.y;
      orientation = isUp(gridY, gridX) ? 'up' : 'down';
    } else if (t.index === 32) {
      // Gate 3: Alonawon Entrance Hexagon
      gridY = 16;
      gridX = 10;
      posX = 360;
      posY = 935;
      orientation = 'up';
    } else if (t.index >= 33 && t.index <= 42) {
      // Alonawon Path: row 16, columns 12 to 30 (Eastward)
      const i = t.index - 33;
      gridY = 16;
      gridX = 12 + i * 2;
      const c = centroid(gridY, gridX);
      posX = c.x;
      posY = c.y;
      orientation = isUp(gridY, gridX) ? 'up' : 'down';
    } else if (t.index === 43) {
      // Gate 4: Himaraya Entrance Hexagon
      gridY = 22;
      gridX = 36;
      posX = 1332;
      posY = 1309;
      orientation = 'up';
    } else if (t.index >= 44 && t.index <= 49) {
      // Himaraya Path: row 22, columns 34 down to 24 (Westward)
      const i = t.index - 44;
      gridY = 22;
      gridX = 34 - i * 2;
      const c = centroid(gridY, gridX);
      posX = c.x;
      posY = c.y;
      orientation = isUp(gridY, gridX) ? 'up' : 'down';
    } else {
      // Index 50: Aetherya Sanctuary Finale
      gridY = 16;
      gridX = 24;
      posX = 850;
      posY = 950;
      orientation = 'up';
    }

    return {
      ...t,
      posX,
      posY,
      gridX,
      gridY,
      orientation,
    };
  });

  const territories: RealmTerritory[] = [
    {
      realm: 'talvaris',
      name: 'Talvaris (Lupa)',
      path: 'M 60,60 L 1640,60 Q 1660,260 1600,450 L 60,450 Z',
      labelX: 120,
      labelY: 110,
      color: 'rgba(5, 150, 105, 0.15)',
    },
    {
      realm: 'alabarya',
      name: 'Alabarya (Apoy)',
      path: 'M 60,460 L 1640,460 Q 1660,670 1600,870 L 60,870 Z',
      labelX: 120,
      labelY: 510,
      color: 'rgba(220, 38, 38, 0.15)',
    },
    {
      realm: 'alonawon',
      name: 'Alonawon (Tubig)',
      path: 'M 60,880 L 1640,880 Q 1660,1070 1600,1260 L 60,1260 Z',
      labelX: 120,
      labelY: 930,
      color: 'rgba(2, 132, 199, 0.15)',
    },
    {
      realm: 'himaraya',
      name: 'Himaraya (Hangin)',
      path: 'M 60,1270 L 1640,1270 Q 1660,1470 1600,1640 L 60,1640 Z',
      labelX: 120,
      labelY: 1320,
      color: 'rgba(124, 58, 237, 0.15)',
    },
    {
      realm: 'aetherya',
      name: 'Aetherya (Sanctuary)',
      path: 'M 850,760 C 954,760 1040,845 1040,950 C 1040,1054 954,1140 850,1140 C 745,1140 660,1054 660,950 C 660,845 745,760 850,760 Z',
      labelX: 850,
      labelY: 910,
      color: 'rgba(234, 179, 8, 0.22)',
    },
  ];

  return {
    id: 'map_canonical_diwa_50',
    name: 'Canonical Diwa Sanctuary (50 Tiles)',
    description: 'Ang opisyal na serpentine mosaic na mapa na may 5 kaharian, 4 Tarangkahan ng Diwaling, at ang Huling Dambana ng Aetherya.',
    author: 'Babaylan Tala',
    createdAt: 1713800000000,
    updatedAt: 1713800000000,
    tiles,
    territories,
  };
}

export const CANONICAL_MAP_DATA: TileMapData = buildCanonicalMapData();
