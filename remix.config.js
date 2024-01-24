/** @type {import('@remix-run/dev').AppConfig} */
/** @type {import('@remix-pwa/dev').WorkerConfig} */

const cacheDirectory = './node_modules/.cache/remix'
const ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}']
const serverBuildTarget = 'vercel'
const serverDependenciesToBundle = [/@remix-pwa\/.*/, /^remix-utils.*/]

export default {
  cacheDirectory,
  ignoredRouteFiles,
  serverBuildTarget,
  serverDependenciesToBundle,
  tailwind: true,
  //
  // Remix PWA Settings
  //
  // entryWorkerFile: '<appDir>/entry.worker.ts',
  // worker: '@remix-pwa/runtime',
  workerName: 'sw',
  workerMinify: true,
  // workerBuildDirectory: './build',
  // workerSourcemap: false,
}
