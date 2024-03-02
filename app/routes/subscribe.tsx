import { redirect } from '@remix-run/node';
import { LoaderFunction } from '@remix-run/server-runtime';
import { ActionFunction, json } from '@vercel/remix';

interface SubscriberShape {
  email: string;
  tags: string[];
  referrer?: string;
}

export interface ActionResponse {
  ok?: boolean;
  error?: string;
}

export const action: ActionFunction = async ({ request }) => {
  console.log('********: ', request);
  const formData = await request.formData();
  const email = formData.get('email');
  const tags = formData.get('tags') as string | null;
  const referrer = request.headers.get('Referer');

  try {
    const response = await fetch(
      'https://api.buttondown.email/v1/subscribers',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${process.env.BUTTONDOWN_TOKEN}`,
        },
        body: JSON.stringify({
          email,
          referrer,
          tags: tags ? tags.split(',') : [],
        }),
      }
    );
    console.log('response: ', response.status);

    if (response.status === 401) {
      // return json({ error: 'Unauthorized' });
      return redirect(`${referrer}?subscribe-error=unauthorized`);
    }
  } catch (error) {
    return json({ error });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  // You can decide what you want to do here. For example, you might want to redirect to the homepage
  // or just return a simple message indicating that this route is not meant to be accessed via GET.
  return new Response(
    'This route is for newsletter subscriptions. Please use the form to subscribe.',
    {
      status: 200, // OK status, but you might want to use a different status code or redirect
    }
  );
};
