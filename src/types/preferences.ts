/**
 * User preferences type definitions
 */

export type Theme = 'light' | 'dark' | 'system';
export type ViewMode = 'grid' | 'compact';

export interface UserPreferences {
  theme: Theme;
  viewMode: ViewMode;
  reducedMotion: boolean;
  canvasEnabled: boolean;
  partyMode: boolean;
}

export interface ThemeState {
  current: Theme;
  resolved: 'light' | 'dark';
  isSystem: boolean;
}

export interface ThemeToggleProps {
  initialTheme?: Theme;
  className?: string;
}

export interface ViewToggleProps {
  initialView?: ViewMode;
  className?: string;
  onViewChange?: (view: ViewMode) => void;
}