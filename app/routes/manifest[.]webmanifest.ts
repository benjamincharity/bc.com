import { json } from '@remix-run/node';

export const loader = async () => {
  return json(
    {
      short_name: 'BC',
      name: 'Benjamin Charity',
      start_url: '/',
      display: 'standalone',
      background_color: '#f7f7f7',
      theme_color: '#2262a1',
      shortcuts: [
        {
          name: 'Homepage',
          url: '/',
          icons: [
            {
              src: '/icons/android-icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any monochrome',
            },
          ],
        },
      ],
      icons: [
        {
          src: '/icons/android-icon-36x36.png',
          sizes: '36x36',
          type: 'image/png',
          density: '0.75',
        },
        {
          src: '/icons/android-icon-48x48.png',
          sizes: '48x48',
          type: 'image/png',
          density: '1.0',
        },
        {
          src: '/icons/android-icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          density: '1.5',
        },
        {
          src: '/icons/android-icon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
          density: '2.0',
        },
        {
          src: '/icons/android-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          density: '3.0',
        },
        {
          src: '/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/android-chrome-256x256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        // Corrected asset paths
        {
          src: '/public/images/pwa/apple-icon-180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: '/public/images/pwa/apple-splash-1125-2436.jpg',
          sizes: '1125x2436',
          type: 'image/jpeg',
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    },
  );
};
