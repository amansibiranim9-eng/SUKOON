/**
 * Pure Deterministic Procedural Generator for "Tree of Noor" (My Garden)
 *
 * Growth is derived from persisted stats:
 * - More Dhikr = more branches
 * - Completed cycles = glowing blossoms
 * - Noor points = drifting fireflies
 * - Local time determines celestial sky palette (dawn, day, dusk, night)
 */

export interface BranchSegment {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  depth: number;
}

export interface TreeBlossom {
  id: number;
  x: number;
  y: number;
  radius: number;
  glowColor: string;
}

export interface GardenFirefly {
  id: number;
  x: number;
  y: number;
  size: number;
  phase: number;
}

export interface TreeOfNoorData {
  branches: BranchSegment[];
  blossoms: TreeBlossom[];
  fireflies: GardenFirefly[];
  maxDepth: number;
}

export interface GardenTimeTheme {
  id: 'dawn' | 'day' | 'dusk' | 'night';
  nameAr: string;
  nameEn: string;
  skyGradient: [string, string];
  treeGlow: string;
  blossomGlow: string;
  fireflyColor: string;
}

// Pseudo-random deterministic generator using linear congruential generator (LCG)
function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getGardenTimeTheme(date: Date = new Date()): GardenTimeTheme {
  const hours = date.getHours();

  if (hours >= 4 && hours < 8) {
    // Dawn / Fajr
    return {
      id: 'dawn',
      nameAr: 'الفجر',
      nameEn: 'Dawn',
      skyGradient: ['#071426', '#1e293b'],
      treeGlow: '#60a5fa',
      blossomGlow: '#93c5fd',
      fireflyColor: '#e0f2fe',
    };
  } else if (hours >= 8 && hours < 17) {
    // Day
    return {
      id: 'day',
      nameAr: 'النهار',
      nameEn: 'Day',
      skyGradient: ['#030712', '#0c2340'],
      treeGlow: '#38bdf8',
      blossomGlow: '#ffffff',
      fireflyColor: '#bae6fd',
    };
  } else if (hours >= 17 && hours < 20) {
    // Dusk / Maghrib
    return {
      id: 'dusk',
      nameAr: 'الغسق',
      nameEn: 'Dusk',
      skyGradient: ['#030712', '#1e1b4b'],
      treeGlow: '#38bdf8',
      blossomGlow: '#60a5fa',
      fireflyColor: '#f0f9ff',
    };
  } else {
    // Night
    return {
      id: 'night',
      nameAr: 'الليل',
      nameEn: 'Night',
      skyGradient: ['#030407', '#071426'],
      treeGlow: '#2563eb',
      blossomGlow: '#38bdf8',
      fireflyColor: '#ffffff',
    };
  }
}

/**
 * Pure deterministic generation of Tree of Noor branches, blossoms, and fireflies.
 */
export function generateTreeOfNoor(options: {
  totalCount: number;
  completedCycles: number;
  noorPoints: number;
  seed?: number;
}): TreeOfNoorData {
  const { totalCount, completedCycles, noorPoints, seed = 42 } = options;
  const rng = createRng(seed);

  // Maximum depth of tree based on Dhikr count:
  // Base 3 levels, increases up to 7 levels with total Dhikr
  const maxDepth = Math.min(7, 3 + Math.floor(Math.log10(Math.max(1, totalCount) + 10) * 1.8));

  const branches: BranchSegment[] = [];
  const leafPositions: { x: number; y: number }[] = [];
  let segmentIdCounter = 0;

  function buildBranch(
    x: number,
    y: number,
    length: number,
    angle: number,
    depth: number,
    thickness: number
  ) {
    const x2 = x + Math.cos(angle) * length;
    const y2 = y + Math.sin(angle) * length;

    branches.push({
      id: segmentIdCounter++,
      x1: Math.round(x * 10) / 10,
      y1: Math.round(y * 10) / 10,
      x2: Math.round(x2 * 10) / 10,
      y2: Math.round(y2 * 10) / 10,
      thickness: Math.max(1, Math.round(thickness * 10) / 10),
      depth,
    });

    if (depth >= maxDepth) {
      leafPositions.push({ x: x2, y: y2 });
      return;
    }

    // Branching split (2 to 3 sub-branches)
    const branchCount = rng() > 0.65 ? 3 : 2;
    const spreadAngle = 0.42 + (rng() - 0.5) * 0.12;

    for (let i = 0; i < branchCount; i++) {
      const subAngle =
        angle +
        (i === 0
          ? -spreadAngle
          : i === 1
          ? spreadAngle
          : (rng() - 0.5) * 0.2);
      const nextLength = length * (0.7 + rng() * 0.12);
      const nextThickness = thickness * 0.68;

      buildBranch(x2, y2, nextLength, subAngle, depth + 1, nextThickness);
    }
  }

  // Trunk origin (Canvas center bottom: 250, 420)
  buildBranch(250, 430, 80, -Math.PI / 2, 1, 8.0);

  // Completed cycles generate glowing blossoms at leaf points
  const blossoms: TreeBlossom[] = [];
  const maxBlossoms = Math.min(completedCycles, leafPositions.length);
  for (let i = 0; i < maxBlossoms; i++) {
    const pos = leafPositions[i % leafPositions.length];
    const jitterX = (rng() - 0.5) * 8;
    const jitterY = (rng() - 0.5) * 8;
    blossoms.push({
      id: i,
      x: Math.round((pos.x + jitterX) * 10) / 10,
      y: Math.round((pos.y + jitterY) * 10) / 10,
      radius: 4.5 + (i % 3) * 1.2,
      glowColor: i % 2 === 0 ? '#38bdf8' : '#ffffff',
    });
  }

  // Noor points generate drifting fireflies
  const fireflies: GardenFirefly[] = [];
  const fireflyCount = Math.min(40, noorPoints);
  for (let i = 0; i < fireflyCount; i++) {
    fireflies.push({
      id: i,
      x: Math.round((60 + rng() * 380) * 10) / 10,
      y: Math.round((40 + rng() * 340) * 10) / 10,
      size: 1.8 + rng() * 2.2,
      phase: rng() * Math.PI * 2,
    });
  }

  return {
    branches,
    blossoms,
    fireflies,
    maxDepth,
  };
}
