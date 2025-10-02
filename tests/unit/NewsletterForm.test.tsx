import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterForm from '~/components/islands/NewsletterForm';

// Mock fetch
global.fetch = vi.fn();

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<NewsletterForm />);

      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<NewsletterForm placeholder="Enter your email address" />);

      expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
    });

    it('should render with custom button text', () => {
      render(<NewsletterForm buttonText="Join Newsletter" />);

      expect(screen.getByRole('button', { name: /join newsletter/i })).toBeInTheDocument();
    });

    it('should render privacy notice', () => {
      render(<NewsletterForm />);

      expect(screen.getByText(/no data sharing/i)).toBeInTheDocument();
      expect(screen.getByText(/unsubscribe at any time/i)).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('should disable submit button when email is empty', () => {
      render(<NewsletterForm />);
      const button = screen.getByRole('button', { name: /subscribe/i });

      expect(button).toBeDisabled();
    });

    it('should enable submit button when email is entered', async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      const button = screen.getByRole('button', { name: /subscribe/i });

      expect(button).toBeDisabled();

      await user.type(input, 'test@example.com');

      expect(button).not.toBeDisabled();
    });

    it('should show error for empty email after trimming', async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      const button = screen.getByRole('button', { name: /subscribe/i });

      await user.type(input, '   ');

      // Button should be disabled for whitespace-only input
      expect(button).toBeDisabled();
    });
  });

  describe('Form submission', () => {
    it('should call API with valid email', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/newsletter',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'test@example.com' }),
          })
        );
      });
    });

    it('should use custom API endpoint when provided', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      render(<NewsletterForm apiEndpoint="/api/custom-newsletter" />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/custom-newsletter',
          expect.anything()
        );
      });
    });

    it('should show success message on successful submission', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument();
      });

      // Email input should be cleared
      expect(input).toHaveValue('');
    });

    it('should show custom success message', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      render(<NewsletterForm successMessage="You're on the list!" />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText("You're on the list!")).toBeInTheDocument();
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: any) => void;
      const fetchPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(fetchPromise);

      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      const button = screen.getByRole('button', { name: /subscribe/i });

      await user.type(input, 'test@example.com');
      await user.click(button);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/subscribing/i)).toBeInTheDocument();
        expect(button).toBeDisabled();
        expect(input).toBeDisabled();
      });

      // Resolve the promise to clean up
      resolvePromise!({
        ok: true,
        json: async () => ({ success: true }),
      });
    });
  });

  describe('Error handling', () => {
    it('should show error message from API', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Server error' }),
      } as Response);

      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
    });

    it('should show generic error message when API response has no message', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      } as Response);

      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed to subscribe/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should clear error when user starts typing again', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error occurred' }),
      } as Response);

      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
      });

      // Start typing again to clear error
      await user.clear(input);
      await user.type(input, 'new@example.com');

      expect(screen.queryByText(/error occurred/i)).not.toBeInTheDocument();
    });
  });

  describe('User feedback', () => {
    it('should show visual feedback for successful submission', async () => {
      const user = userEvent.setup();
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      // User should see success message
      await waitFor(() => {
        expect(screen.getByText(/thanks for subscribing/i)).toBeInTheDocument();
      });
    });
  });
});
