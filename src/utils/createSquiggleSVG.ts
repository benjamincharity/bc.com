/**
 * Escape HTML attribute value to prevent XSS attacks
 * @param str - The string to escape
 * @returns Escaped string safe for HTML attributes
 */
function escapeHtmlAttribute(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Generate the squiggle SVG with a specific color
 *
 * @param color - The color to use in the SVG (will be sanitized)
 * @returns The SVG string with escaped color value
 */
export function createSquiggleSVG(color: string): string {
  const safeColor = escapeHtmlAttribute(color);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 4"><style type="text/css">.squiggle{animation:shift .3s linear infinite;}@keyframes shift {from {transform:translateX(0);}to {transform:translateX(-20px);}}</style><path fill="none" stroke="${safeColor}" stroke-width="2" class="squiggle" d="M0 3.5c5 0 5-3 10-3s5 3 10 3c5 0 5-3 10-3s5 3 10 3"/></svg>`;
}