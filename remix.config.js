/** @type {import('@remix-run/dev').AppConfig} */
/** @type {import('@remix-pwa/dev').WorkerConfig} */

const cacheDirectory = './node_modules/.cache/remix'
const ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}']
const serverBuildTarget = 'vercel'
const serverDependenciesToBundle = [/^@remix-pwa*/]

export default {
    cacheDirectory,
    ignoredRouteFiles,
    serverBuildTarget,
    serverDependenciesToBundle,
}
