import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VisualService } from '../visualService';
import { TapEventData, ClimaxEventData } from '@/types/visuals';

describe('VisualService', () => {
  let visualService: VisualService;

  beforeEach(() => {
    vi.clearAllMocks();
    visualService = new VisualService();
  });

  describe('Tap Event Broadcast and NDC Conversion', () => {
    it('notifies registered tap listeners with accurate normalized device coordinates', () => {
      let receivedTap: TapEventData | null = null;
      visualService.onTap((tap) => {
        receivedTap = tap;
      });

      // Window center in mock environment (default fallback: 800x600 if window is not sized)
      visualService.triggerTap(400, 300, 1.0, 1, false);

      expect(receivedTap).not.toBeNull();
      expect((receivedTap as TapEventData | null)?.screenX).toBe(400);
      expect((receivedTap as TapEventData | null)?.screenY).toBe(300);
      expect((receivedTap as TapEventData | null)?.intensity).toBe(1.0);
      expect((receivedTap as TapEventData | null)?.tier).toBe(1);
    });

    it('unregisters tap listeners cleanly without memory leaks', () => {
      const listener = vi.fn();
      const unbind = visualService.onTap(listener);

      visualService.triggerTap(100, 100);
      expect(listener).toHaveBeenCalledTimes(1);

      unbind();
      visualService.triggerTap(100, 100);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Flow Mechanic Rhythm Calculation', () => {
    it('initializes flow on first tap', () => {
      const initialFlow = visualService.updateFlow(1000);
      expect(initialFlow).toBeGreaterThan(0);
      expect(initialFlow).toBeLessThanOrEqual(1.0);
    });

    it('builds flow when taps arrive in a steady, regular rhythm', () => {
      // 5 regular taps spaced by 1000ms
      let time = 1000;
      visualService.updateFlow(time);
      for (let i = 0; i < 5; i++) {
        time += 1000;
        visualService.updateFlow(time);
      }
      expect(visualService.currentFlow).toBeGreaterThan(0.5);
    });

    it('resets or dampens flow when tapping is erratic or too slow', () => {
      visualService.currentFlow = 0.8;
      // Tap after 6000ms pause (outside 500-2800ms cadence window)
      visualService.updateFlow(Date.now() + 6000);
      expect(visualService.currentFlow).toBeLessThan(0.8);
    });

    it('decays flow over time when idle', () => {
      visualService.currentFlow = 0.5;
      visualService.decayFlow();
      expect(visualService.currentFlow).toBeLessThan(0.5);
    });
  });

  describe('Climax Event Broadcast', () => {
    it('notifies registered climax listeners', () => {
      let receivedClimax: ClimaxEventData | null = null;
      visualService.onClimax((climax) => {
        receivedClimax = climax;
      });

      visualService.triggerClimax(false);
      expect(receivedClimax).not.toBeNull();
      expect((receivedClimax as ClimaxEventData | null)?.intensity).toBe(1.0);
    });
  });

  describe('Haptic Patterns', () => {
    it('triggers specific vibration patterns per tier', () => {
      const vibrateMock = vi.fn();
      vi.stubGlobal('navigator', { vibrate: vibrateMock });

      visualService.triggerTierHaptic(0);
      expect(vibrateMock).toHaveBeenCalledWith(12);

      visualService.triggerTierHaptic(1);
      expect(vibrateMock).toHaveBeenCalledWith(24);

      visualService.triggerTierHaptic(2);
      expect(vibrateMock).toHaveBeenCalledWith(36);
    });

    it('triggers rhythmic sacred burst vibration pattern on climax', () => {
      const vibrateMock = vi.fn();
      vi.stubGlobal('navigator', { vibrate: vibrateMock });

      visualService.triggerClimaxHaptic();
      expect(vibrateMock).toHaveBeenCalledWith([45, 60, 55, 60, 75]);
    });
  });
});
