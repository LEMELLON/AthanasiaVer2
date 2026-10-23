import { BoardTile, RealmTerritory, TileMapData } from '../types/game';
import { CANONICAL_BOARD_TILES } from './canonicalCards';

/**
 * Builds the canonical 50-space serpentine interlocking tile map with exact
 * geometric coordinates (triangular tessellation and hexagonal gates).
 */
export function buildCanonicalMapData(): TileMapData {
  // Pre-calculate visual coordinates for the 50-tile serpentine path on a 1150 x 700 canvas.
  // Row 0: Talvaris (Eastward) - Tiles 0 to 17
  // Row 1: Alabarya (Westward) - Tiles 18 to 31
  // Row 2: Alonawon (Eastward) - Tiles 32 to 42
  // Row 3: Himaraya (Westward) - Tiles 43 to 49
  // Row 4: Aetherya (Center goal) - Tile 50

  const enhancedTiles: BoardTile[] = CANONICAL_BOARD_TILES.map((t) => {
    let posX = 100;
    let posY = 100;
    let orientation: 'up' | 'down' = (t.index % 2 === 0) ? 'up' : 'down';

    if (t.realm === 'talvaris') {
      // Row 0, X spreads from 100 to 1020
      const step = t.index; // 0 to 17
      posX = 110 + step * 52;
      posY = 110 + (step % 2 === 1 ? 12 : -12);
      orientation = step % 2 === 0 ? 'up' : 'down';
    } else if (t.realm === 'alabarya') {
      // Row 1, Westward from 1020 down to 260
      const step = t.index - 18; // 0 to 13
      posX = 990 - step * 56;
      posY = 245 + (step % 2 === 1 ? 12 : -12);
      orientation = step % 2 === 0 ? 'down' : 'up';
    } else if (t.realm === 'alonawon') {
      // Row 2, Eastward from 260 to 860
      const step = t.index - 32; // 0 to 10
      posX = 280 + step * 58;
      posY = 380 + (step % 2 === 1 ? 12 : -12);
      orientation = step % 2 === 0 ? 'up' : 'down';
    } else if (t.realm === 'himaraya') {
      // Row 3, Westward from 860 down to 480
      const step = t.index - 43; // 0 to 6
      posX = 830 - step * 60;
      posY = 510 + (step % 2 === 1 ? 12 : -12);
      orientation = step % 2 === 0 ? 'down' : 'up';
    } else {
      // Aetherya (Tile 50)
      posX = 420;
      posY = 580;
      orientation = 'up';
    }

    return {
      ...t,
      posX,
      posY,
      orientation,
    };
  });

  const territories: RealmTerritory[] = [
    {
      realm: 'talvaris',
      name: 'Talvaris (Lupa)',
      path: 'M 50,40 L 1080,40 Q 1110,110 1080,180 L 50,180 Z',
      labelX: 80,
      labelY: 70,
      color: 'rgba(5, 150, 105, 0.15)',
    },
    {
      realm: 'alabarya',
      name: 'Alabarya (Apoy)',
      path: 'M 190,190 L 1080,190 Q 1110,245 1050,310 L 190,310 Z',
      labelX: 1040,
      labelY: 220,
      color: 'rgba(220, 38, 38, 0.15)',
    },
    {
      realm: 'alonawon',
      name: 'Alonawon (Tubig)',
      path: 'M 210,320 L 960,320 Q 980,380 940,440 L 210,440 Z',
      labelX: 240,
      labelY: 350,
      color: 'rgba(2, 132, 199, 0.15)',
    },
    {
      realm: 'himaraya',
      name: 'Himaraya (Hangin)',
      path: 'M 350,450 L 930,450 Q 950,510 910,570 L 350,570 Z',
      labelX: 890,
      labelY: 480,
      color: 'rgba(124, 58, 237, 0.15)',
    },
    {
      realm: 'aetherya',
      name: 'Aetherya (Sanctuary)',
      path: 'M 320,530 L 550,530 Q 570,610 520,670 L 300,670 Z',
      labelX: 430,
      labelY: 660,
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
    tiles: enhancedTiles,
    territories,
  };
}

export const CANONICAL_MAP_DATA: TileMapData = buildCanonicalMapData();
