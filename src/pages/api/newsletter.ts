import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, source } = await request.json();

    // Basic email validation
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please enter a valid email address.',
          error: {
            code: 'INVALID_EMAIL',
            message: 'Invalid email format'
          }
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check for Buttondown API key
    const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      console.error('BUTTONDOWN_API_KEY not configured');
      // For development/testing, return a success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully subscribed! (Demo mode - no actual subscription created)',
          subscriptionId: 'demo-' + Date.now()
        }),
        {
          status: 200,
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
        email: email.trim().toLowerCase(),
        tags: source ? [source] : ['website'],
        referrer_url: source || 'website'
      }),
    });

    if (buttondownResponse.status === 409) {
      // Email already exists
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
      const errorData = await buttondownResponse.text();
      console.error('Buttondown API error:', errorData);
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
    console.error('Newsletter subscription error:', error);
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