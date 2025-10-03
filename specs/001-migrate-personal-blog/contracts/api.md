# API Contracts for Astro Migration

## Edge Function Endpoints

### Newsletter Subscription

**POST** `/api/newsletter/subscribe`

**Request**:

```typescript
interface NewsletterSubscribeRequest {
  email: string; // Required, valid email format
  source?: string; // Optional, referring page path
}
```

**Response**:

```typescript
interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
  subscriptionId?: string; // If successful
  error?: {
    code: 'INVALID_EMAIL' | 'ALREADY_SUBSCRIBED' | 'SERVICE_ERROR';
    message: string;
  };
}
```

**Status Codes**:

- 200: Success
- 400: Invalid request (bad email format)
- 409: Already subscribed
- 500: Internal server error

### Theme Preference

**GET/POST** `/api/theme`

**GET Response**:

```typescript
interface ThemeResponse {
  theme: 'light' | 'dark' | 'system';
  resolved: 'light' | 'dark';
}
```

**POST Request**:

```typescript
interface ThemeUpdateRequest {
  theme: 'light' | 'dark' | 'system';
}
```

### Performance Metrics

**POST** `/api/metrics`

**Request**:

```typescript
interface MetricsRequest {
  page: string;
  metrics: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
  userAgent: string;
  timestamp: string;
}
```

## Service Worker API

### Cache Management

```typescript
interface CacheAPI {
  // Check cache version
  getVersion(): Promise<string>;

  // Update cache with new content
  updateCache(version: string): Promise<void>;

  // Clear specific cache entries
  clearCache(pattern: string): Promise<void>;

  // Get cached resources
  getCachedResources(): Promise<CacheState>;
}
```

### Offline Handling

```typescript
interface OfflineAPI {
  // Check network status
  isOnline(): boolean;

  // Get offline pages
  getOfflinePages(): Promise<string[]>;

  // Cache page for offline
  cachePage(url: string): Promise<void>;
}
```

## Content Collection API

### Article Queries

```typescript
interface ContentAPI {
  // Get all published articles
  getAllArticles(): Promise<ArticleMetadata[]>;

  // Get article by slug
  getArticle(slug: string): Promise<Article | null>;

  // Get articles by tag
  getArticlesByTag(tag: string): Promise<ArticleMetadata[]>;

  // Get related articles
  getRelatedArticles(slug: string, limit: number): Promise<ArticleMetadata[]>;

  // Search articles
  searchArticles(query: string): Promise<ArticleMetadata[]>;
}
```

### Build-time Data

```typescript
interface BuildAPI {
  // Generate article metadata
  generateMetadata(): Promise<BuildMetadata>;

  // Validate content structure
  validateContent(): Promise<ValidationResult>;

  // Generate sitemap
  generateSitemap(): Promise<string>;

  // Generate RSS feed
  generateRSS(): Promise<string>;
}
```

## Component Contracts

### Interactive Island Props

```typescript
// Theme Toggle Component
interface ThemeToggleContract {
  props: ThemeToggleProps;
  events: {
    onThemeChange: (theme: Theme) => void;
  };
  methods: {
    getCurrentTheme(): Theme;
    setTheme(theme: Theme): void;
  };
}

// Canvas Background Component
interface CanvasBackgroundContract {
  props: CanvasBackgroundProps;
  events: {
    onInteraction: (interaction: CanvasInteraction) => void;
    onAnimationFrame: (timestamp: number) => void;
  };
  methods: {
    pause(): void;
    resume(): void;
    enablePartyMode(): void;
    disablePartyMode(): void;
  };
}

// Newsletter Form Component
interface NewsletterFormContract {
  props: NewsletterFormProps;
  events: {
    onSubmit: (data: NewsletterFormData) => void;
    onSuccess: (response: NewsletterResponse) => void;
    onError: (error: string) => void;
  };
  methods: {
    reset(): void;
    validate(): ValidationResult;
    submit(): Promise<NewsletterResponse>;
  };
}

// View Toggle Component
interface ViewToggleContract {
  props: ViewToggleProps;
  events: {
    onViewChange: (view: ViewMode) => void;
  };
  methods: {
    getCurrentView(): ViewMode;
    setView(view: ViewMode): void;
  };
}
```

## State Management Contracts

### User Preferences Store

```typescript
interface UserPreferencesStore {
  // State
  state: UserPreferences;

  // Actions
  setTheme(theme: Theme): void;
  setViewMode(mode: ViewMode): void;
  setReducedMotion(enabled: boolean): void;
  setCanvasEnabled(enabled: boolean): void;
  setPartyMode(enabled: boolean): void;

  // Selectors
  getTheme(): Theme;
  getResolvedTheme(): 'light' | 'dark';
  getViewMode(): ViewMode;
  shouldReduceMotion(): boolean;
  isCanvasEnabled(): boolean;
  isPartyModeEnabled(): boolean;

  // Persistence
  save(): void;
  load(): void;
  reset(): void;
}
```

### Navigation Store

```typescript
interface NavigationStore {
  // State
  state: NavigationState;

  // Actions
  navigate(path: string): void;
  saveScrollPosition(path: string, position: number): void;
  restoreScrollPosition(path: string): number | null;

  // Selectors
  getCurrentPath(): string;
  getPreviousPath(): string | null;
  getHistory(): string[];

  // Utilities
  canGoBack(): boolean;
  canGoForward(): boolean;
}
```

## Middleware Contracts

### Theme Middleware

```typescript
interface ThemeMiddleware {
  // Extract theme from cookies/headers
  getThemeFromRequest(request: Request): Theme;

  // Set theme cookie in response
  setThemeInResponse(response: Response, theme: Theme): Response;

  // Resolve system theme
  resolveSystemTheme(userAgent: string): 'light' | 'dark';
}
```

### Security Middleware

```typescript
interface SecurityMiddleware {
  // Validate CSRF tokens
  validateCSRF(request: Request): boolean;

  // Rate limiting
  checkRateLimit(ip: string, endpoint: string): boolean;

  // Content Security Policy
  setCSPHeaders(response: Response): Response;
}
```

## Error Handling Contracts

### Error Reporter

```typescript
interface ErrorReporter {
  // Report client errors
  reportError(error: AppError): Promise<void>;

  // Log performance issues
  reportPerformance(metrics: PerformanceMetrics): Promise<void>;

  // User feedback
  reportFeedback(feedback: {
    type: 'bug' | 'feature' | 'general';
    message: string;
    context?: Record<string, any>;
  }): Promise<void>;
}
```

### Error Recovery

```typescript
interface ErrorRecovery {
  // Attempt to recover from error
  recover(error: AppError): Promise<boolean>;

  // Fallback strategies
  getFallbackContent(path: string): Promise<string>;

  // Cache recovery
  recoverFromCache(key: string): Promise<any>;
}
```

---

_API contracts complete - ready for test generation_
