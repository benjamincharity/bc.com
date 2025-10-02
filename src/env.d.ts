/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Cloudflare runtime environment
type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    // Additional custom locals can be added here if needed
  }
}

// Define Cloudflare environment variables and bindings
interface Env {
  BUTTONDOWN_API_KEY: string;
  // Add other Cloudflare bindings here as needed
  // DB?: D1Database;
  // MY_KV?: KVNamespace;
}
