import type { APIContext } from 'astro';
import { describe, expect, it } from 'vitest';

describe('robots.txt Generation', () => {
  describe('Basic structure', () => {
    it('should return plain text response', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe(
        'text/plain; charset=utf-8'
      );
    });

    it('should include User-agent directive', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('User-agent: *');
    });

    it('should include Allow directive', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('Allow: /');
    });

    it('should include reference comment', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('# https://www.robotstxt.org/robotstxt.html');
    });
  });

  describe('Sitemap', () => {
    it('should include Sitemap directive', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('Sitemap:');
    });

    it('should include correct sitemap URL', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain(
        'Sitemap: https://www.benjamincharity.com/sitemap.xml'
      );
    });
  });

  describe('Disallow rules', () => {
    it('should block utility pages', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('Disallow: /subscribe-success/');
    });

    it('should block utility directories', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('Disallow: /cgi-bin/');
      expect(text).toContain('Disallow: /tmp/');
      expect(text).toContain('Disallow: /junk/');
    });

    it('should block script files', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('Disallow: /*.js$');
    });

    it('should block CSS files', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('Disallow: /*.css$');
    });

    it('should have comments for disallow sections', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('# Block utility pages');
      expect(text).toContain('# Block utility directories');
      expect(text).toContain('# Block script and style files');
    });
  });

  describe('Formatting', () => {
    it('should have proper line structure', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // Should have multiple lines
      const lines = text.split('\n');
      expect(lines.length).toBeGreaterThan(5);
    });

    it('should not have leading/trailing whitespace', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // Text is trimmed
      expect(text).toBe(text.trim());
    });

    it('should have blank lines between sections', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // Check for empty lines as section separators
      expect(text).toContain('\n\n');
    });
  });

  describe('HTTP headers', () => {
    it('should set correct Content-Type', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);

      expect(response.headers.get('Content-Type')).toBe(
        'text/plain; charset=utf-8'
      );
    });

    it('should set Cache-Control header', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);

      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('max-age');
    });

    it('should cache for 5 minutes', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);

      const cacheControl = response.headers.get('Cache-Control');
      // 5 minutes = 300 seconds
      expect(cacheControl).toContain('max-age=300');
    });
  });

  describe('robots.txt spec compliance', () => {
    it('should follow robots.txt format', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // Basic validation of robots.txt format
      // Should have User-agent first
      const userAgentIndex = text.indexOf('User-agent:');
      const firstDirectiveIndex = text.indexOf('Allow:');

      expect(userAgentIndex).toBeLessThan(firstDirectiveIndex);
    });

    it('should use correct directive syntax', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // Directives should have format "Directive: value"
      expect(text).toMatch(/User-agent:\s+\*/);
      expect(text).toMatch(/Allow:\s+\//);
      expect(text).toMatch(/Sitemap:\s+https:\/\//);
      expect(text).toMatch(/Disallow:\s+\//);
    });

    it('should apply to all user agents', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // Wildcard user agent
      expect(text).toContain('User-agent: *');
    });
  });

  describe('SEO considerations', () => {
    it('should allow root path', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('Allow: /');
    });

    it('should provide sitemap for discovery', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toMatch(/Sitemap:\s+https:\/\/[^\s]+\/sitemap\.xml/);
    });

    it('should block non-content resources', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // JS and CSS should be blocked
      expect(text).toContain('Disallow: /*.js$');
      expect(text).toContain('Disallow: /*.css$');
    });
  });

  describe('Content validation', () => {
    it('should only contain valid robots.txt directives', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      const lines = text
        .split('\n')
        .filter((line) => line.trim() && !line.startsWith('#'));

      const validDirectives = [
        'User-agent:',
        'Allow:',
        'Disallow:',
        'Sitemap:',
      ];

      lines.forEach((line) => {
        const hasValidDirective = validDirectives.some((directive) =>
          line.trim().startsWith(directive)
        );
        expect(hasValidDirective).toBe(true);
      });
    });

    it('should not contain HTML', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).not.toContain('<html>');
      expect(text).not.toContain('<!DOCTYPE');
      expect(text).not.toContain('<body>');
    });

    it('should not contain JSON', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).not.toContain('{');
      expect(text).not.toContain('}');
      expect(text).not.toContain('[');
      expect(text).not.toContain(']');
    });
  });

  describe('Character encoding', () => {
    it('should specify UTF-8 encoding', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);

      expect(response.headers.get('Content-Type')).toContain('charset=utf-8');
    });

    it('should only contain ASCII characters', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // robots.txt should typically only use ASCII
      // eslint-disable-next-line no-control-regex
      const isAscii = /^[\x00-\x7F]*$/.test(text);
      expect(isAscii).toBe(true);
    });
  });

  describe('Size and performance', () => {
    it('should be reasonably small', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // Should be under 1KB for efficient crawling
      expect(text.length).toBeLessThan(1024);
    });

    it('should not have excessive blank lines', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      // Should not have triple blank lines
      expect(text).not.toContain('\n\n\n\n');
    });
  });

  describe('Documentation', () => {
    it('should have reference to robots.txt spec', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      expect(text).toContain('robotstxt.org');
    });

    it('should have descriptive comments', async () => {
      const { GET } = await import('~/pages/robots.txt');
      const response = await GET({} as APIContext);
      const text = await response.text();

      const comments = text
        .split('\n')
        .filter((line) => line.trim().startsWith('#'));
      expect(comments.length).toBeGreaterThan(0);
    });
  });

  describe('Consistency', () => {
    it('should produce same output on multiple calls', async () => {
      const { GET } = await import('~/pages/robots.txt');

      const response1 = await GET({} as APIContext);
      const text1 = await response1.text();

      const response2 = await GET({} as APIContext);
      const text2 = await response2.text();

      expect(text1).toBe(text2);
    });
  });
});
