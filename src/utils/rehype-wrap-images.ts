import type { Element, Parent, Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Custom rehype plugin to wrap images in figure/figcaption
 * while preserving all Cloudinary attributes (srcset, sizes, etc.)
 *
 * Only displays caption if a title attribute is explicitly provided.
 * Alt text remains for screen readers only.
 */
export default function rehypeWrapImages() {
  return (tree: Root) => {
    visit(
      tree,
      'element',
      (node: Element, index, parent: Parent | undefined) => {
        if (node.tagName === 'img' && parent && typeof index === 'number') {
          // Only use title attribute for caption (not alt)
          const title = node.properties?.title as string | undefined;

          // Remove title from img properties (it's now in the caption)
          const imgProperties = { ...node.properties };
          if (title) {
            delete imgProperties.title;
          }

          // Build the figure children - always include the image container
          const figureChildren: Element[] = [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['rsi-container'] },
              children: [
                {
                  type: 'element',
                  tagName: 'img',
                  properties: {
                    ...imgProperties,
                    className: ['rsi-image'],
                  },
                  children: [],
                },
              ],
            },
          ];

          // Only add figcaption if title exists
          if (title) {
            figureChildren.push({
              type: 'element',
              tagName: 'figcaption',
              properties: { className: ['rsi-figcaption'] },
              children: [
                {
                  type: 'text',
                  value: title,
                },
              ],
            });
          }

          // Create the figure structure
          const figure: Element = {
            type: 'element',
            tagName: 'figure',
            properties: { className: ['rsi-figure'] },
            children: figureChildren,
          };

          // Replace the img node with the figure
          parent.children[index] = figure;
        }
      }
    );
  };
}
