import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewToggle from '~/components/islands/ViewToggle';

describe('ViewToggle', () => {
  let mockLocalStorage: { [key: string]: string };

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

    // Mock window.dispatchEvent
    vi.spyOn(window, 'dispatchEvent');
  });

  afterEach(() => {
    // Always restore real timers after each test to prevent tests from affecting each other
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render view toggle button', async () => {
      render(<ViewToggle />);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });

    it('should show placeholder while mounting', () => {
      render(<ViewToggle />);

      const placeholder = document.querySelector('.w-9.h-9.rounded-md');
      expect(placeholder).toBeInTheDocument();
    });

    it('should render with default grid view', async () => {
      render(<ViewToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to compact view');
        expect(button).toHaveAttribute('aria-pressed', 'false');
      });
    });

    it('should render with custom default view', async () => {
      render(<ViewToggle defaultView="compact" />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to grid view');
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should apply custom className', async () => {
      render(<ViewToggle className="custom-class" />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
      });
    });
  });

  describe('Size variants', () => {
    it('should render small size', async () => {
      render(<ViewToggle size="sm" />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-7', 'h-7');
      });
    });

    it('should render medium size (default)', async () => {
      render(<ViewToggle size="md" />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-9', 'h-9');
      });
    });

    it('should render large size', async () => {
      render(<ViewToggle size="lg" />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-11', 'h-11');
      });
    });
  });

  describe('View initialization', () => {
    it('should default to grid view when no preference saved', async () => {
      render(<ViewToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to compact view');
      });
    });

    it('should load saved grid view from localStorage', async () => {
      mockLocalStorage['view-mode'] = 'grid';

      render(<ViewToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to compact view');
      });
    });

    it('should load saved compact view from localStorage', async () => {
      mockLocalStorage['view-mode'] = 'compact';

      render(<ViewToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to grid view');
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should ignore invalid localStorage values', async () => {
      mockLocalStorage['view-mode'] = 'invalid';

      render(<ViewToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button');
        // Should default to grid
        expect(button).toHaveAttribute('aria-label', 'Switch to compact view');
      });
    });
  });

  describe('View toggling', () => {
    it('should toggle from grid to compact', async () => {
      const user = userEvent.setup();
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      expect(button).toHaveAttribute('aria-label', 'Switch to compact view');

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Switch to grid view');
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should toggle from compact to grid', async () => {
      const user = userEvent.setup();
      mockLocalStorage['view-mode'] = 'compact';

      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      expect(button).toHaveAttribute('aria-pressed', 'true');

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-pressed', 'false');
      });
    });

    it('should update icon when toggling', async () => {
      const user = userEvent.setup();
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      // Icon should be present initially
      let svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();

      await user.click(button);

      // Icon should still be present after toggle (different icon)
      await waitFor(() => {
        svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe('Persistence', () => {
    it('should save view preference to localStorage', async () => {
      const user = userEvent.setup();
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      await user.click(button);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('view-mode', 'compact');
      });
    });

    it('should not save to localStorage before mounting', () => {
      render(<ViewToggle />);

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Callback prop', () => {
    it('should call onViewChange when view changes', async () => {
      const user = userEvent.setup();
      const onViewChange = vi.fn();

      render(<ViewToggle onViewChange={onViewChange} />);

      const button = await waitFor(() => screen.getByRole('button'));

      await user.click(button);

      await waitFor(() => {
        expect(onViewChange).toHaveBeenCalledWith('compact');
      });
    });

    it('should not call onViewChange before mounting', () => {
      const onViewChange = vi.fn();

      render(<ViewToggle onViewChange={onViewChange} />);

      expect(onViewChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom events', () => {
    it('should dispatch viewModeChanged event on toggle', async () => {
      const user = userEvent.setup();
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      await user.click(button);

      await waitFor(() => {
        expect(window.dispatchEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'viewModeChanged',
            detail: { view: 'compact' },
          })
        );
      });
    });

    it('should include correct view in event detail', async () => {
      const user = userEvent.setup();
      mockLocalStorage['view-mode'] = 'compact';

      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      await user.click(button);

      await waitFor(() => {
        expect(window.dispatchEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: { view: 'grid' },
          })
        );
      });
    });
  });

  describe('Screen reader announcements', () => {
    it('should announce view changes to screen readers', async () => {
      const user = userEvent.setup();
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      await user.click(button);

      await waitFor(() => {
        const announcement = screen.getByRole('status');
        expect(announcement).toHaveTextContent('View changed to compact mode');
      });
    });

    it('should have correct ARIA attributes on announcement', async () => {
      const user = userEvent.setup();
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      await user.click(button);

      await waitFor(() => {
        const announcement = screen.getByRole('status');
        expect(announcement).toHaveAttribute('aria-live', 'polite');
        expect(announcement).toHaveAttribute('aria-atomic', 'true');
      });
    });

    it('should show announcement when view changes', async () => {
      const user = userEvent.setup();

      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));
      const announcement = screen.getByRole('status');

      // Initially empty
      expect(announcement).toHaveTextContent('');

      await user.click(button);

      // Announcement appears after toggle
      await waitFor(() => {
        expect(announcement).toHaveTextContent('View changed to compact mode');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button label', async () => {
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
    });

    it('should use aria-pressed for toggle state', async () => {
      const user = userEvent.setup();
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<ViewToggle />);

      const button = await waitFor(() => screen.getByRole('button'));

      // Focus the button
      await user.tab();
      expect(button).toHaveFocus();

      // Activate with keyboard
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockLocalStorage['view-mode']).toBe('compact');
      });
    });

    it('should have screen reader announcement region', async () => {
      render(<ViewToggle />);

      await waitFor(() => {
        const announcement = screen.getByRole('status');
        expect(announcement).toBeInTheDocument();
      });
    });
  });
});
