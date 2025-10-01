import { useState } from 'react';

interface NewsletterFormProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  apiEndpoint?: string;
}

interface FormState {
  email: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function NewsletterForm({
  className = '',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing!',
  apiEndpoint = '/api/newsletter'
}: NewsletterFormProps) {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    status: 'idle',
    message: ''
  });

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      email: event.target.value,
      status: 'idle',
      message: ''
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { email } = formState;

    // Validation
    if (!email.trim()) {
      setFormState(prev => ({
        ...prev,
        status: 'error',
        message: 'Email address is required.'
      }));
      return;
    }

    if (!isValidEmail(email)) {
      setFormState(prev => ({
        ...prev,
        status: 'error',
        message: 'Please enter a valid email address.'
      }));
      return;
    }

    // Submit
    setFormState(prev => ({
      ...prev,
      status: 'loading',
      message: ''
    }));

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to subscribe. Please try again.');
      }

      setFormState(prev => ({
        ...prev,
        email: '',
        status: 'success',
        message: successMessage
      }));

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormState(prev => ({
          ...prev,
          status: 'idle',
          message: ''
        }));
      }, 5000);

    } catch (error) {
      setFormState(prev => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      }));
    }
  };

  const { email, status, message } = formState;

  return (
    <div className={`w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder={placeholder}
            disabled={status === 'loading'}
            className={`
              w-full px-4 py-3 pr-32 rounded-lg border text-sm
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              border-gray-300 dark:border-gray-700
              focus:border-pink-500 dark:focus:border-pink-400
              focus:ring-2 focus:ring-pink-500/20 dark:focus:ring-pink-400/20
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              ${status === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${status === 'success' ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : ''}
            `}
            aria-describedby={message ? 'newsletter-message' : undefined}
            aria-invalid={status === 'error'}
          />

          <button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className={`
              absolute right-2 top-1/2 -translate-y-1/2
              px-4 py-1.5 rounded-md text-sm font-medium
              bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-pink-500/50
              transition-all duration-200
              ${status === 'loading' ? 'cursor-wait' : ''}
            `}
          >
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>...</span>
              </div>
            ) : (
              buttonText
            )}
          </button>
        </div>

        {message && (
          <div
            id="newsletter-message"
            className={`
              text-sm p-3 rounded-md
              ${status === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }
            `}
            role={status === 'error' ? 'alert' : 'status'}
          >
            <div className="flex items-start space-x-2">
              {status === 'success' ? (
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        Subscribe to get notified about new articles and insights. No spam, unsubscribe anytime.
      </p>
    </div>
  );
}