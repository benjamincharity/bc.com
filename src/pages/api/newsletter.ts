import type { APIRoute } from 'astro';
import { validateEmail } from '~/utils/email-validator';
import { rateLimit } from '~/utils/rate-limiter';
import { logger } from '~/utils/logger';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress, locals }) => {
  try {
    // Rate limiting
    const identifier = clientAddress || request.headers.get('CF-Connecting-IP') || 'unknown';
    const limit = rateLimit(identifier, 5, 60000); // 5 requests per minute

    if (!limit.allowed) {
      logger.warn('Rate limit exceeded for newsletter subscription', {
        identifier,
        retryAfter: limit.retryAfter,
      });

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many subscription attempts. Please try again in a moment.',
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: limit.retryAfter,
            resetAt: new Date(limit.resetAt).toISOString(),
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(limit.retryAfter || 60),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(limit.remaining),
            'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
          },
        }
      );
    }

    const { email, source } = await request.json();

    // Validate email
    const validation = validateEmail(email);
    if (!validation.valid) {
      logger.debug('Invalid email submission', {
        error: validation.error,
      });

      return new Response(
        JSON.stringify({
          success: false,
          message: validation.error,
          error: {
            code: 'INVALID_EMAIL',
            message: validation.error,
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Use normalized email
    const normalizedEmail = validation.normalized!;

    // Check for Buttondown API key
    // In Cloudflare Pages, use runtime.env for server-side env vars
    // Falls back to import.meta.env for local development
    const apiKey = locals.runtime?.env?.BUTTONDOWN_API_KEY || import.meta.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      logger.warn('Newsletter API key not configured', {
        endpoint: '/api/newsletter',
        action: 'subscription_attempt',
      });

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Newsletter service is currently unavailable. Please try again later.',
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'API key not configured'
          }
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Subscribe to Buttondown
    const buttondownResponse = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        tags: source ? [source] : ['website'],
        referrer_url: source || 'website'
      }),
    });

    if (buttondownResponse.status === 409) {
      logger.info('Duplicate newsletter subscription attempt', {
        email: normalizedEmail,
        source,
      });

      return new Response(
        JSON.stringify({
          success: false,
          message: 'This email is already subscribed to our newsletter.',
          error: {
            code: 'ALREADY_SUBSCRIBED',
            message: 'Email already exists'
          }
        }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!buttondownResponse.ok) {
      logger.error('External newsletter service error', {
        service: 'buttondown',
        statusCode: buttondownResponse.status,
        statusText: buttondownResponse.statusText,
      });

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to subscribe. Please try again later.',
          error: {
            code: 'SERVICE_ERROR',
            message: 'External service error'
          }
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const subscriberData = await buttondownResponse.json();

    logger.info('Newsletter subscription successful', {
      email: normalizedEmail,
      source,
      subscriberId: subscriberData.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed! Check your email for confirmation.',
        subscriptionId: subscriberData.id
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    logger.error('Newsletter subscription error', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
      } : 'Unknown error',
    });

    return new Response(
      JSON.stringify({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: {
          code: 'SERVICE_ERROR',
          message: 'Internal server error'
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};