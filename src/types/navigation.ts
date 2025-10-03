/**
 * Navigation state type definitions
 */

export interface NavigationState {
  history: string[];
  scrollPositions: Map<string, number>;
  currentPath: string;
  previousPath: string | null;
}

export interface ScrollBehavior {
  behavior: 'smooth' | 'instant' | 'auto';
  respectsReducedMotion: boolean;
}

export interface CanvasConfig {
  width: number;
  height: number;
  dpr: number;
  animationSpeed: number;
  colorPalette: string[];
}

export interface CanvasState {
  isPaused: boolean;
  isVisible: boolean;
  isPartyModeEnabled: boolean;
  isInteracting: boolean;
}

export interface CanvasInteraction {
  type: 'mouse' | 'touch' | 'keyboard';
  x?: number;
  y?: number;
  intensity: number;
}

export interface CanvasBackgroundProps {
  config?: Partial<CanvasConfig>;
  className?: string;
  fallbackColor?: string;
}
