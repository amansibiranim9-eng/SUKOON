import { describe, it, expect } from 'vitest';
import { generateTreeOfNoor, getGardenTimeTheme } from '../treeOfNoor';

describe('Tree of Noor Deterministic Generator', () => {
  it('generates identical branch geometry for the same seed and totals (deterministic)', () => {
    const tree1 = generateTreeOfNoor({
      totalCount: 150,
      completedCycles: 4,
      noorPoints: 12,
      seed: 12345,
    });

    const tree2 = generateTreeOfNoor({
      totalCount: 150,
      completedCycles: 4,
      noorPoints: 12,
      seed: 12345,
    });

    expect(tree1.branches.length).toBe(tree2.branches.length);
    expect(tree1.branches).toEqual(tree2.branches);
    expect(tree1.blossoms).toEqual(tree2.blossoms);
    expect(tree1.fireflies).toEqual(tree2.fireflies);
  });

  it('scales branch count and depth with higher total dhikr count', () => {
    const smallTree = generateTreeOfNoor({
      totalCount: 10,
      completedCycles: 1,
      noorPoints: 0,
    });

    const matureTree = generateTreeOfNoor({
      totalCount: 500,
      completedCycles: 10,
      noorPoints: 5,
    });

    expect(matureTree.branches.length).toBeGreaterThan(smallTree.branches.length);
    expect(matureTree.maxDepth).toBeGreaterThanOrEqual(smallTree.maxDepth);
  });

  it('lights blossoms matching completed cycles count', () => {
    const tree = generateTreeOfNoor({
      totalCount: 300,
      completedCycles: 5,
      noorPoints: 2,
    });

    expect(tree.blossoms.length).toBe(5);
  });

  it('generates fireflies matching Noor points count', () => {
    const tree = generateTreeOfNoor({
      totalCount: 100,
      completedCycles: 2,
      noorPoints: 8,
    });

    expect(tree.fireflies.length).toBe(8);
  });

  it('resolves garden time theme matching local time of day', () => {
    const dawn = new Date();
    dawn.setHours(6, 0, 0, 0);
    expect(getGardenTimeTheme(dawn).id).toBe('dawn');

    const day = new Date();
    day.setHours(12, 0, 0, 0);
    expect(getGardenTimeTheme(day).id).toBe('day');

    const dusk = new Date();
    dusk.setHours(18, 0, 0, 0);
    expect(getGardenTimeTheme(dusk).id).toBe('dusk');

    const night = new Date();
    night.setHours(23, 0, 0, 0);
    expect(getGardenTimeTheme(night).id).toBe('night');
  });
});
