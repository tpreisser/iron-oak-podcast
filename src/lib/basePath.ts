// Prefix for all static assets.
// Previously deployed to GitHub Pages at /iron-oak-podcast.
// Now deployed to Cloudflare Pages at root domain — no basePath needed.
export const BASE_PATH = '';

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
