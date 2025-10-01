import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

const CLOUDINARY_ACCOUNT = 'da2exoho7';

const imageBreakpoints = [640, 800, 1024, 1280];

function getURLParams(src: string): Record<string, string> {
  const queryString = src.split('?')[1];
  if (!queryString) {
    return {};
  }

  const params = new URLSearchParams(queryString);
  const paramsObj: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    paramsObj[key] = value;
  }
  return paramsObj;
}

function generateSizes(breakpoints: number[]): string {
  return breakpoints
    .reverse()
    .map((bp, index, arr) => {
      if (index === arr.length - 1) {
        return `${bp}px`;
      }
      return `(min-width: ${bp}px) ${bp}px`;
    })
    .join(', ');
}

function generateSrcset(
  src: string,
  isHighRes?: boolean,
  height?: number,
  width?: number
): string {
  const viewportBreakpoints = imageBreakpoints;
  const breakpoints = isHighRes
    ? viewportBreakpoints.map((size) => size * 2)
    : viewportBreakpoints;
  const hString = height ? `h_${height},` : '';
  return breakpoints
    .map(
      (size, i) =>
        `https://res.cloudinary.com/${CLOUDINARY_ACCOUNT}/image/upload/c_scale,${hString}w_${width ?? size}/f_auto/article-content/${src} ${viewportBreakpoints[i]}w`
    )
    .join(', ');
}

export default function rehypeCloudinaryImages() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // Handle gif-player elements
      if (node.tagName === 'gif-player') {
        const src = node.properties?.src as string;
        if (src && !src.startsWith('http')) {
          node.properties = {
            ...node.properties,
            src: `https://res.cloudinary.com/${CLOUDINARY_ACCOUNT}/image/upload/article-content/${src}`,
          };
        }
        return;
      }

      // Handle img elements
      if (node.tagName === 'img') {
        const src = node.properties?.src as string;
        const alt = node.properties?.alt || '';

        if (src && !src.startsWith('http')) {
          const isGif = src.toLowerCase().endsWith('.gif');

          if (isGif) {
            // GIFs get simple Cloudinary URL without srcset to preserve aspect ratio
            const finalSrc = `https://res.cloudinary.com/${CLOUDINARY_ACCOUNT}/image/upload/article-content/${src}`;
            node.properties = {
              ...node.properties,
              alt,
              src: finalSrc,
              // Remove srcset and sizes if they exist
              srcset: undefined,
              sizes: undefined,
              // Preserve natural dimensions
              loading: 'lazy',
            };
            // Remove undefined properties
            Object.keys(node.properties).forEach(key => {
              if (node.properties![key] === undefined) {
                delete node.properties![key];
              }
            });
            return;
          }

          // Process non-GIF images with responsive srcset
          let customHeight: number | undefined = undefined;
          let customWidth: number | undefined = undefined;
          let isHighRes = false;
          const result = getURLParams(src);

          if (result.height) customHeight = Number(result.height);
          if (result.width) customWidth = Number(result.width);
          if (result.isHighRes) isHighRes = Boolean(result.isHighRes);

          const srcset = generateSrcset(
            src,
            isHighRes,
            customHeight,
            customWidth
          );
          const hString = customHeight ? `h_${customHeight},` : '';
          const w = customWidth ?? imageBreakpoints[imageBreakpoints.length - 1];
          const finalSrc = `https://res.cloudinary.com/${CLOUDINARY_ACCOUNT}/image/upload/c_scale,${hString}w_${w}/f_auto/article-content/${src}`;
          const sizes = generateSizes(imageBreakpoints);

          node.properties = {
            ...node.properties,
            alt,
            sizes,
            src: finalSrc,
            srcset,
          };
        }
      }
    });
  };
}
