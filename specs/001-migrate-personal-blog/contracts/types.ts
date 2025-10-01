/**
 * TypeScript Contracts for Remix to Astro Migration
 *
 * These interfaces define the shape of data throughout the application.
 * All components and functions must adhere to these contracts.
 */

// ===============================
// Content Collection Types
// ===============================

export interface ArticleFrontmatter {
  title: string;
  date: Date;
  tags: string[];
  description: string;
  image?: string;
  draft?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  data: ArticleFrontmatter;
  body: string;
  readingTime: number;
  render(): Promise<{
    Content: any;
    headings: { depth: number; slug: string; text: string }[];
  }>;
}

export interface ArticleMetadata {
  id: string;
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  description: string;
  image?: string;
  readingTime: number;
}

// ===============================
// User Preference Types
// ===============================

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
  resolved: 'light' | 'dark'; // After system preference resolution
  isSystem: boolean;
}

// ===============================
// Navigation Types
// ===============================

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

// ===============================
// Newsletter Types
// ===============================

export interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
  source: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
}

export interface NewsletterFormData {
  email: string;
  source?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  error?: string;
}

// ===============================
// Canvas Background Types
// ===============================

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

// ===============================
// PWA Cache Types
// ===============================

export interface CacheState {
  version: string;
  assets: string[];
  documents: string[];
  data: string[];
  lastUpdated: Date;
}

export interface CacheStrategy {
  type: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  maxAge: number;
  maxEntries?: number;
}

// ===============================
// Component Props
// ===============================

export interface ThemeToggleProps {
  initialTheme?: Theme;
  className?: string;
}

export interface ViewToggleProps {
  initialView?: ViewMode;
  className?: string;
  onViewChange?: (view: ViewMode) => void;
}

export interface NewsletterFormProps {
  source?: string;
  className?: string;
  onSuccess?: (data: NewsletterResponse) => void;
  onError?: (error: string) => void;
}

export interface CanvasBackgroundProps {
  config?: Partial<CanvasConfig>;
  className?: string;
  fallbackColor?: string;
}

export interface ArticleCardProps {
  article: ArticleMetadata;
  viewMode: ViewMode;
  className?: string;
}

export interface ArticleListProps {
  articles: ArticleMetadata[];
  viewMode: ViewMode;
  className?: string;
}

// ===============================
// API Contracts
// ===============================

export interface EdgeFunctionRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export interface EdgeFunctionResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface NewsletterApiRequest {
  email: string;
  source?: string;
}

export interface NewsletterApiResponse {
  success: boolean;
  message: string;
  subscriptionId?: string;
  error?: {
    code: string;
    message: string;
  };
}

// ===============================
// Build & Performance Types
// ===============================

export interface BuildMetadata {
  buildTime: Date;
  gitHash: string;
  version: string;
  articlesCount: number;
  buildDuration: number;
}

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export interface LighthouseReport {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

// ===============================
// Validation Schemas
// ===============================

export interface ValidationRule<T> {
  field: keyof T;
  validator: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

// ===============================
// Migration Specific Types
// ===============================

export interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  dependencies: string[];
  estimatedDuration: number;
}

export interface MigrationReport {
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  totalDuration: number;
  errors: Array<{
    step: string;
    error: string;
  }>;
}

// ===============================
// Error Handling
// ===============================

export interface AppError {
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
}

// ===============================
// SEO & Meta
// ===============================

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  url: string;
  type: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  tags?: string[];
}

export interface JsonLd {
  '@context': string;
  '@type': string;
  [key: string]: any;
}