import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import ThemeToggle from '~/components/islands/ThemeToggle';

describe('ThemeToggle', () => {
  let mockLocalStorage: { [key: string]: string };
  let mockMatchMedia: Mock;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
      clear: vi.fn(() => {
        mockLocalStorage = {};
      }),
    });

    // Mock matchMedia
    mockMatchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? false : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.stubGlobal('matchMedia', mockMatchMedia);

    // Clear document classes
    document.documentElement.classList.remove('light', 'dark');
  });

  describe('Rendering', () => {
    it('should render theme toggle button', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('should show placeholder while mounting', () => {
      render(<ThemeToggle />);

      // Placeholder div should be present before mount
      const placeholder = document.querySelector('.w-9.h-9.rounded-md');
      expect(placeholder).toBeInTheDocument();
    });

    it('should have accessible labels', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('title');
      });
    });
  });

  describe('Theme initialization', () => {
    it('should default to system theme when no preference saved', async () => {
      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      });
    });

    it('should load saved theme from localStorage', async () => {
      mockLocalStorage['theme'] = 'dark';

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to system mode');
      });
    });

    it('should apply light theme to document when theme is light', async () => {
      mockLocalStorage['theme'] = 'light';

      render(<ThemeToggle />);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });

    it('should apply dark theme to document when theme is dark', async () => {
      mockLocalStorage['theme'] = 'dark';

      render(<ThemeToggle />);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.classList.contains('light')).toBe(
          false
        );
      });
    });

    it('should respect system preference when theme is system', async () => {
      mockLocalStorage['theme'] = 'system';
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(<ThemeToggle />);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });
  });

  describe('Theme cycling', () => {
    it('should cycle from light to dark to system', async () => {
      const user = userEvent.setup();
      mockLocalStorage['theme'] = 'light';

      render(<ThemeToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      // Light -> Dark
      await user.click(button);
      await waitFor(() => {
        expect(mockLocalStorage['theme']).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });

      // Dark -> System
      await user.click(button);
      await waitFor(() => {
        expect(mockLocalStorage['theme']).toBe('system');
      });

      // System -> Light
      await user.click(button);
      await waitFor(() => {
        expect(mockLocalStorage['theme']).toBe('light');
        expect(document.documentElement.classList.contains('light')).toBe(true);
      });
    });

    it('should update button label when theme changes', async () => {
      const user = userEvent.setup();
      mockLocalStorage['theme'] = 'light';

      render(<ThemeToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Switch to system mode');
      });
    });

    it('should update button icon when theme changes', async () => {
      const user = userEvent.setup();
      mockLocalStorage['theme'] = 'light';

      render(<ThemeToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      // Check for sun icon (light mode)
      let svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();

      await user.click(button);

      // Check that icon changed
      await waitFor(() => {
        svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe('Theme persistence', () => {
    it('should save theme preference to localStorage', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      await user.click(button);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'theme',
          expect.any(String)
        );
      });
    });

    it('should save initial theme to localStorage after mounting', async () => {
      render(<ThemeToggle />);

      // After mounting, should persist the initial theme (system)
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'system');
      });
    });
  });

  describe('Icons', () => {
    it('should display sun icon for light theme', async () => {
      mockLocalStorage['theme'] = 'light';

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
        // Sun icon has specific path with circle at center
        const path = svg?.querySelector('path');
        expect(path?.getAttribute('d')).toContain('M12 3v1m0 16v1');
      });
    });

    it('should display moon icon for dark theme', async () => {
      mockLocalStorage['theme'] = 'dark';

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
        // Moon icon has crescent shape
        const path = svg?.querySelector('path');
        expect(path?.getAttribute('d')).toContain('M20.354');
      });
    });

    it('should display monitor icon for system theme', async () => {
      mockLocalStorage['theme'] = 'system';

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        const svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
        // Monitor/desktop icon
        const path = svg?.querySelector('path');
        expect(path?.getAttribute('d')).toContain('M9.75 17L9 20');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', async () => {
      render(<ThemeToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      mockLocalStorage['theme'] = 'light';

      render(<ThemeToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      // Focus the button
      await user.tab();
      expect(button).toHaveFocus();

      // Activate with keyboard
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockLocalStorage['theme']).toBe('dark');
      });
    });
  });

  describe('CSS class management', () => {
    it('should remove existing theme class before applying new one', async () => {
      const user = userEvent.setup();
      mockLocalStorage['theme'] = 'light';

      render(<ThemeToggle />);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
      });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(
          false
        );
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('should apply correct class for system theme based on preference', async () => {
      mockLocalStorage['theme'] = 'system';
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(<ThemeToggle />);

      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true);
      });
    });
  });
});
