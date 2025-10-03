import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BrowseByTags, { Tags } from '~/components/islands/BrowseByTags';

describe('BrowseByTags', () => {
  const mockTags: [string, number][] = [
    ['typescript', 10],
    ['javascript', 5],
    ['react', 8],
  ];

  describe('Rendering', () => {
    it('should render tags list', () => {
      render(<BrowseByTags tags={mockTags} />);

      expect(screen.getByText('typescript')).toBeInTheDocument();
      expect(screen.getByText('javascript')).toBeInTheDocument();
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    it('should render tag counts', () => {
      render(<BrowseByTags tags={mockTags} />);

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should render with custom heading', () => {
      render(<BrowseByTags tags={mockTags} heading="Browse Articles" />);

      expect(screen.getByText('Browse Articles')).toBeInTheDocument();
    });

    it('should render without heading when not provided', () => {
      render(<BrowseByTags tags={mockTags} />);

      const headings = screen.queryAllByRole('heading');
      expect(headings).toHaveLength(0);
    });

    it('should render with custom id', () => {
      const { container } = render(
        <BrowseByTags tags={mockTags} id="custom-tags" />
      );

      const aside = container.querySelector('#custom-tags');
      expect(aside).toBeInTheDocument();
    });

    it('should render empty list when no tags provided', () => {
      render(<BrowseByTags tags={[]} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.children).toHaveLength(0);
    });
  });

  describe('Tag sorting', () => {
    it('should sort tags alphabetically', () => {
      const unsortedTags: [string, number][] = [
        ['zebra', 1],
        ['apple', 2],
        ['banana', 3],
      ];

      render(<BrowseByTags tags={unsortedTags} />);

      const tagElements = screen.getAllByRole('listitem');
      const tagTexts = tagElements.map((el) => el.textContent);

      // Check that 'apple' comes before 'banana' which comes before 'zebra'
      const appleIndex = tagTexts.findIndex((text) => text?.includes('apple'));
      const bananaIndex = tagTexts.findIndex((text) =>
        text?.includes('banana')
      );
      const zebraIndex = tagTexts.findIndex((text) => text?.includes('zebra'));

      expect(appleIndex).toBeLessThan(bananaIndex);
      expect(bananaIndex).toBeLessThan(zebraIndex);
    });

    it('should handle case-insensitive sorting', () => {
      const tags: [string, number][] = [
        ['Zebra', 1],
        ['apple', 2],
        ['Banana', 3],
      ];

      render(<BrowseByTags tags={tags} />);

      const tagElements = screen.getAllByRole('listitem');
      const tagTexts = tagElements.map((el) => el.textContent);

      const appleIndex = tagTexts.findIndex((text) => text?.includes('apple'));
      const bananaIndex = tagTexts.findIndex((text) =>
        text?.includes('Banana')
      );
      const zebraIndex = tagTexts.findIndex((text) => text?.includes('Zebra'));

      expect(appleIndex).toBeLessThan(bananaIndex);
      expect(bananaIndex).toBeLessThan(zebraIndex);
    });
  });

  describe('Tag links', () => {
    it('should render tags as links when not current', () => {
      render(<BrowseByTags tags={mockTags} currentTag="other" />);

      const typescriptLink = screen.getByRole('link', { name: /typescript/ });
      expect(typescriptLink).toHaveAttribute(
        'href',
        '/articles/tags/typescript'
      );
    });

    it('should render current tag as plain text', () => {
      render(<BrowseByTags tags={mockTags} currentTag="typescript" />);

      // Current tag should not be a link
      const typescriptLink = screen.queryByRole('link', {
        name: /^typescript/,
      });
      expect(typescriptLink).not.toBeInTheDocument();

      // But text should still be present
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });

    it('should apply correct styling to current tag', () => {
      render(<BrowseByTags tags={mockTags} currentTag="typescript" />);

      // Get the list item containing typescript
      const listItems = screen.getAllByRole('listitem');
      const typescriptItem = listItems.find((item) =>
        item.textContent?.includes('typescript')
      );

      // Current tag should be a span, not a link
      const span = typescriptItem?.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span).toHaveClass('text-gray-600', 'dark:text-gray-400');
    });

    it('should apply animated link style to non-current tags', () => {
      render(<BrowseByTags tags={mockTags} currentTag="typescript" />);

      const javascriptLink = screen.getByRole('link', { name: /javascript/ });
      expect(javascriptLink).toHaveClass('animated-link-underline');
    });
  });

  describe('Tag counts', () => {
    it('should display count as superscript', () => {
      render(<BrowseByTags tags={mockTags} />);

      const listItems = screen.getAllByRole('listitem');
      const typescriptItem = listItems.find((item) =>
        item.textContent?.includes('typescript')
      );

      const sup = typescriptItem?.querySelector('sup');
      expect(sup).toBeInTheDocument();
      expect(sup).toHaveTextContent('10');
    });

    it('should position count correctly with CSS classes', () => {
      render(<BrowseByTags tags={mockTags} />);

      const listItems = screen.getAllByRole('listitem');
      const typescriptItem = listItems.find((item) =>
        item.textContent?.includes('typescript')
      );

      const sup = typescriptItem?.querySelector('sup');
      expect(sup).toHaveClass('left-100', 'absolute', 'top-1/3');
    });

    it('should show count for current tag', () => {
      render(<BrowseByTags tags={mockTags} currentTag="typescript" />);

      const listItems = screen.getAllByRole('listitem');
      const typescriptItem = listItems.find((item) =>
        item.textContent?.includes('typescript')
      );

      const sup = typescriptItem?.querySelector('sup');
      expect(sup).toBeInTheDocument();
      expect(sup).toHaveTextContent('10');
    });
  });

  describe('Accessibility', () => {
    it('should have navigation landmark', () => {
      render(<BrowseByTags tags={mockTags} />);

      const nav = screen.getByRole('navigation', {
        name: /filter articles by tag/i,
      });
      expect(nav).toBeInTheDocument();
    });

    it('should have proper heading structure when heading provided', () => {
      render(<BrowseByTags tags={mockTags} heading="Browse by Tag" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Browse by Tag');
    });

    it('should associate heading with aside when provided', () => {
      const { container } = render(
        <BrowseByTags tags={mockTags} heading="Browse Tags" />
      );

      const aside = container.querySelector('aside');
      const heading = screen.getByRole('heading', { level: 2 });

      expect(aside).toHaveAttribute('aria-labelledby', heading.id);
    });

    it('should not have aria-labelledby when no heading', () => {
      const { container } = render(<BrowseByTags tags={mockTags} />);

      const aside = container.querySelector('aside');
      expect(aside).not.toHaveAttribute('aria-labelledby');
    });

    it('should use semantic list markup', () => {
      render(<BrowseByTags tags={mockTags} />);

      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');

      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(3);
    });
  });

  describe('Tags component (isolated)', () => {
    it('should render tags without wrapper', () => {
      render(<Tags tags={mockTags} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should handle currentTag highlighting', () => {
      render(<Tags tags={mockTags} currentTag="react" />);

      const reactLink = screen.queryByRole('link', { name: /^react/ });
      expect(reactLink).not.toBeInTheDocument();

      const typescriptLink = screen.getByRole('link', { name: /typescript/ });
      expect(typescriptLink).toBeInTheDocument();
    });

    it('should generate unique keys for tag items', () => {
      const duplicateTags: [string, number][] = [
        ['typescript', 10],
        ['typescript', 5], // Same name, different count
      ];

      // Should not throw React key warning
      const { container } = render(<Tags tags={duplicateTags} />);

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(2);
    });
  });

  describe('Styling', () => {
    it('should have centered text styling', () => {
      const { container } = render(<BrowseByTags tags={mockTags} />);

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('text-center');

      const list = screen.getByRole('list');
      expect(list).toHaveClass('text-center');
    });

    it('should apply correct font styling', () => {
      const { container } = render(<BrowseByTags tags={mockTags} />);

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('font-sourceSerif4', 'text-base', 'font-bold');
    });

    it('should have proper list item spacing', () => {
      render(<BrowseByTags tags={mockTags} />);

      const listItems = screen.getAllByRole('listitem');
      listItems.forEach((item) => {
        expect(item).toHaveClass('mb-2', 'mr-6', 'inline-block', 'text-sm');
      });
    });

    it('should style heading appropriately', () => {
      render(<BrowseByTags tags={mockTags} heading="Browse Tags" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass(
        'mb-2',
        'text-gray-600',
        'dark:text-gray-400'
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle single tag', () => {
      const singleTag: [string, number][] = [['typescript', 10]];

      render(<BrowseByTags tags={singleTag} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(1);
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });

    it('should handle tags with special characters', () => {
      const specialTags: [string, number][] = [
        ['C++', 5],
        ['Node.js', 10],
        ['React/Redux', 3],
      ];

      render(<BrowseByTags tags={specialTags} />);

      expect(screen.getByText('C++')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('React/Redux')).toBeInTheDocument();
    });

    it('should handle tags with very large counts', () => {
      const largeCounts: [string, number][] = [['popular', 9999]];

      render(<BrowseByTags tags={largeCounts} />);

      expect(screen.getByText('9999')).toBeInTheDocument();
    });

    it('should handle tags with zero count', () => {
      const zeroCount: [string, number][] = [['unused', 0]];

      render(<BrowseByTags tags={zeroCount} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle many tags', () => {
      const manyTags: [string, number][] = Array.from(
        { length: 50 },
        (_, i) => [`tag${i}`, i + 1]
      );

      render(<BrowseByTags tags={manyTags} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(50);
    });
  });
});
