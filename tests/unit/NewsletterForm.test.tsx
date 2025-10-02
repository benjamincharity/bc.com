import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NewsletterForm from '~/components/islands/NewsletterForm';

describe('NewsletterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<NewsletterForm />);

      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /subscribe/i })
      ).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<NewsletterForm placeholder="Enter your email address" />);

      expect(
        screen.getByPlaceholderText('Enter your email address')
      ).toBeInTheDocument();
    });

    it('should render with custom button text', () => {
      render(<NewsletterForm buttonText="Join Newsletter" />);

      expect(
        screen.getByRole('button', { name: /join newsletter/i })
      ).toBeInTheDocument();
    });

    it('should render privacy notice', () => {
      render(<NewsletterForm />);

      expect(screen.getByText(/no data sharing/i)).toBeInTheDocument();
      expect(screen.getByText(/unsubscribe at any time/i)).toBeInTheDocument();
    });

    it('should have correct form action pointing to Buttondown', () => {
      const { container } = render(<NewsletterForm />);
      const form = container.querySelector('form');

      expect(form).toHaveAttribute(
        'action',
        'https://buttondown.com/api/emails/embed-subscribe/benjamincharity'
      );
      expect(form).toHaveAttribute('method', 'POST');
    });

    it('should include hidden embed field', () => {
      const { container } = render(<NewsletterForm />);
      const embedInput = container.querySelector('input[name="embed"]');

      expect(embedInput).toBeInTheDocument();
      expect(embedInput).toHaveAttribute('type', 'hidden');
      expect(embedInput).toHaveAttribute('value', '1');
    });

    it('should include hidden tag field', () => {
      const { container } = render(<NewsletterForm />);
      const tagInput = container.querySelector('input[name="tag"]');

      expect(tagInput).toBeInTheDocument();
      expect(tagInput).toHaveAttribute('type', 'hidden');
      expect(tagInput).toHaveAttribute('value', 'website');
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

    it('should keep button disabled for whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, '   ');

      const button = screen.getByRole('button', { name: /subscribe/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Email input', () => {
    it('should have email input with correct name attribute', () => {
      render(<NewsletterForm />);
      const input = screen.getByPlaceholderText('Your email');

      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('name', 'email');
    });

    it('should update input value as user types', async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');
      await user.type(input, 'test@example.com');

      expect(input).toHaveValue('test@example.com');
    });

    it('should allow typing and updating email value', async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      const input = screen.getByPlaceholderText('Your email');

      await user.type(input, 'test');
      expect(input).toHaveValue('test');

      await user.clear(input);
      await user.type(input, 'new@example.com');
      expect(input).toHaveValue('new@example.com');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<NewsletterForm />);
      const input = screen.getByPlaceholderText('Your email');

      expect(input).toHaveAttribute('aria-describedby', 'newsletter-message');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should maintain aria-describedby relationship', () => {
      render(<NewsletterForm />);
      const input = screen.getByPlaceholderText('Your email');

      // Check that aria-describedby points to the message container
      expect(input).toHaveAttribute('aria-describedby', 'newsletter-message');
    });
  });
});
