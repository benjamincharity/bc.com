/** @type {import('@remix-run/dev').AppConfig} */
/** @type {import('@remix-pwa/dev').WorkerConfig} */

const cacheDirectory = './node_modules/.cache/remix';
const ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'];
const serverBuildTarget = 'vercel';
const serverDependenciesToBundle = [
  /@remix-pwa\/.*/,
  /^remix-utils.*/,
  /@benjc\/rehype-gif-controls.*/,
];

export default {
  cacheDirectory,
  ignoredRouteFiles,
  serverBuildTarget,
  serverDependenciesToBundle,
  tailwind: true,
  browserNodeBuiltinsPolyfill: { modules: { buffer: true } },
  watchPaths: ['./tailwind.config.ts'],
  workerName: 'sw',
  workerMinify: true,
};
