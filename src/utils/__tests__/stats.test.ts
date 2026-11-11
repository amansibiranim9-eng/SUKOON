import { describe, it, expect } from 'vitest';
import { calculateStreak, getTodayCount, calculateStats, formatDateKey } from '../stats';
import { AUTHENTIC_ADHKAR, getSuggestedCategory } from '@/data/adhkar';

describe('Stats Utilities & Streak Logic', () => {
  it('formats Date key into YYYY-MM-DD properly', () => {
    const testDate = new Date(2025, 4, 15); // May 15, 2025
    expect(formatDateKey(testDate)).toBe('2025-05-15');
  });

  it('calculates streak 0 on empty history', () => {
    const streak = calculateStreak({});
    expect(streak).toBe(0);
  });

  it('calculates streak 1 when user only completed today', () => {
    const now = new Date();
    const todayKey = formatDateKey(now);
    const history = { [todayKey]: 33 };

    expect(calculateStreak(history, now)).toBe(1);
  });

  it('preserves streak from yesterday if user has not yet completed dhikr today', () => {
    const today = new Date(2025, 5, 10);
    const yesterday = new Date(2025, 5, 9);
    const twoDaysAgo = new Date(2025, 5, 8);

    const history = {
      [formatDateKey(yesterday)]: 50,
      [formatDateKey(twoDaysAgo)]: 33,
    };

    expect(calculateStreak(history, today)).toBe(2);
  });

  it('calculates consecutive multiple-day streak including today', () => {
    const d0 = new Date(2025, 5, 10);
    const d1 = new Date(2025, 5, 9);
    const d2 = new Date(2025, 5, 8);
    const d3 = new Date(2025, 5, 7);

    const history = {
      [formatDateKey(d0)]: 33,
      [formatDateKey(d1)]: 100,
      [formatDateKey(d2)]: 66,
      [formatDateKey(d3)]: 33,
    };

    expect(calculateStreak(history, d0)).toBe(4);
  });

  it('breaks streak on missed day in the past', () => {
    const d0 = new Date(2025, 5, 10);
    const d1 = new Date(2025, 5, 9);
    // d2 missed
    const d3 = new Date(2025, 5, 7);

    const history = {
      [formatDateKey(d0)]: 33,
      [formatDateKey(d1)]: 33,
      [formatDateKey(d3)]: 100,
    };

    expect(calculateStreak(history, d0)).toBe(2);
  });

  it('computes complete stats package and getTodayCount accurately', () => {
    const now = new Date();
    const todayKey = formatDateKey(now);
    const history = { [todayKey]: 45 };

    expect(getTodayCount(history, now)).toBe(45);
    expect(getTodayCount({}, now)).toBe(0);

    const stats = calculateStats(history, 150, 4, now);
    expect(stats.todayCount).toBe(45);
    expect(stats.totalCount).toBe(150);
    expect(stats.completedCycles).toBe(4);
    expect(stats.streakDays).toBe(1);
  });
});

describe('Adhkar Dataset & Suggestions', () => {
  it('contains well-structured authentic adhkar with sources and bilingual translations', () => {
    expect(AUTHENTIC_ADHKAR.length).toBeGreaterThan(10);
    AUTHENTIC_ADHKAR.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.arabic).toBeTruthy();
      expect(item.transliteration).toBeTruthy();
      expect(item.targetCount).toBeGreaterThan(0);
      expect(item.source).toBeTruthy();
      if (typeof item.translation === 'object') {
        expect(item.translation.ar).toBeTruthy();
        expect(item.translation.en).toBeTruthy();
      }
    });
  });

  it('suggests morning adhkar between 04:00 and 12:00', () => {
    const morningDate = new Date();
    morningDate.setHours(7, 30, 0, 0);
    expect(getSuggestedCategory(morningDate)).toBe('morning');
  });

  it('suggests evening adhkar in late afternoon and night', () => {
    const eveningDate = new Date();
    eveningDate.setHours(18, 0, 0, 0);
    expect(getSuggestedCategory(eveningDate)).toBe('evening');

    const lateNightDate = new Date();
    lateNightDate.setHours(1, 0, 0, 0);
    expect(getSuggestedCategory(lateNightDate)).toBe('evening');
  });

  it('suggests tasbih midday', () => {
    const midday = new Date();
    midday.setHours(13, 0, 0, 0);
    expect(getSuggestedCategory(midday)).toBe('tasbih');
  });
});
