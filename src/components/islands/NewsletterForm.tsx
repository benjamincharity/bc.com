import { useState } from 'react';
import { isValidEmail } from '~/utils/validators';

interface NewsletterFormProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
}

interface FormState {
  email: string;
  status: 'idle' | 'error';
  message: string;
}

export default function NewsletterForm({
  className = '',
  placeholder = 'Your email',
  buttonText = 'Subscribe',
}: NewsletterFormProps) {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    status: 'idle',
    message: '',
  });


  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      email: event.target.value,
      status: 'idle',
      message: '',
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { email } = formState;

    // Client-side validation only
    if (!email.trim()) {
      event.preventDefault();
      setFormState((prev) => ({
        ...prev,
        status: 'error',
        message: 'Email address is required.',
      }));
      return;
    }

    if (!isValidEmail(email)) {
      event.preventDefault();
      setFormState((prev) => ({
        ...prev,
        status: 'error',
        message: 'Please enter a valid email address.',
      }));
      return;
    }

    // If validation passes, let the form submit naturally to Buttondown
    // This will redirect to Buttondown's success page
  };

  const { email, status, message } = formState;

  return (
    <section
      className={`mx-auto w-full max-w-md ${className}`}
      aria-labelledby="newsletter-heading"
    >
      <h2 id="newsletter-heading" className="sr-only">
        Newsletter Subscription
      </h2>
      <form
        action="https://buttondown.com/api/emails/embed-subscribe/benjamincharity"
        method="POST"
        onSubmit={handleSubmit}
        className="space-y-2"
      >
        <input type="hidden" name="embed" value="1" />
        <input type="hidden" name="tag" value="website" />
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          placeholder={placeholder}
          className={`
            h-full w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-[16px] outline-none transition
            focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50
            dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600
            ${status === 'error' ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-300' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}
          `}
          aria-describedby="newsletter-message"
          aria-invalid={status === 'error'}
        />

        <button
          type="submit"
          disabled={!email.trim()}
          className={`
            animate-gradient w-full justify-center rounded-lg bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-5 py-4 text-center text-sm font-medium text-white
            focus:ring-4 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-purple-800
          `}
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-[16px] fill-white"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
            </svg>
            {buttonText}
          </span>
        </button>

        {/* Error message */}
        {message && status === 'error' && (
          <div
            id="newsletter-message"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="flex items-start space-x-2">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{message}</span>
            </div>
          </div>
        )}
      </form>

      <p className="py-2 text-center text-xs text-slate-500 dark:text-slate-300">
        No data sharing. Unsubscribe at any time.
      </p>
    </section>
  );
}
