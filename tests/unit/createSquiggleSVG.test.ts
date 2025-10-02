import { describe, it, expect } from 'vitest';
import { createSquiggleSVG } from '~/utils/createSquiggleSVG';

describe('createSquiggleSVG', () => {
  describe('Basic functionality', () => {
    it('should return a string', () => {
      const result = createSquiggleSVG('#000000');

      expect(typeof result).toBe('string');
    });

    it('should generate SVG markup', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('<svg');
      expect(result).toContain('</svg>');
    });

    it('should include xmlns attribute', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should include viewBox attribute', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('viewBox="0 0 20 4"');
    });
  });

  describe('Color handling', () => {
    it('should include the provided color in stroke attribute', () => {
      const color = '#ff0000';
      const result = createSquiggleSVG(color);

      expect(result).toContain(`stroke="${color}"`);
    });

    it('should handle hex colors', () => {
      const color = '#3b82f6';
      const result = createSquiggleSVG(color);

      expect(result).toContain(color);
    });

    it('should handle named colors', () => {
      const color = 'red';
      const result = createSquiggleSVG(color);

      expect(result).toContain(`stroke="${color}"`);
    });

    it('should handle rgb colors', () => {
      const color = 'rgb(255, 0, 0)';
      const result = createSquiggleSVG(color);

      expect(result).toContain(color);
    });

    it('should handle rgba colors with transparency', () => {
      const color = 'rgba(255, 0, 0, 0.5)';
      const result = createSquiggleSVG(color);

      expect(result).toContain(color);
    });

    it('should handle hsl colors', () => {
      const color = 'hsl(0, 100%, 50%)';
      const result = createSquiggleSVG(color);

      expect(result).toContain(color);
    });

    it('should handle currentColor keyword', () => {
      const color = 'currentColor';
      const result = createSquiggleSVG(color);

      expect(result).toContain(`stroke="${color}"`);
    });
  });

  describe('SVG structure', () => {
    it('should include style element with animation', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('<style type="text/css">');
      expect(result).toContain('.squiggle');
      expect(result).toContain('animation:shift .3s linear infinite;');
    });

    it('should include keyframes animation', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('@keyframes shift');
      expect(result).toContain('from {transform:translateX(0);}');
      expect(result).toContain('to {transform:translateX(-20px);}');
    });

    it('should include path element', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('<path');
      expect(result).toContain('fill="none"');
      expect(result).toContain('stroke-width="2"');
      expect(result).toContain('class="squiggle"');
    });

    it('should include squiggle path data', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('d="M0 3.5c5 0 5-3 10-3s5 3 10 3c5 0 5-3 10-3s5 3 10 3"');
    });
  });

  describe('Animation properties', () => {
    it('should have correct animation duration', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('.3s');
    });

    it('should have linear timing function', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('linear');
    });

    it('should have infinite animation', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('infinite');
    });

    it('should translate horizontally', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('translateX');
    });
  });

  describe('XSS prevention', () => {
    it('should escape HTML entities in color parameter', () => {
      const maliciousColor = '"><script>alert("XSS")</script><path d="';
      const result = createSquiggleSVG(maliciousColor);

      // The malicious script should be escaped
      expect(result).toContain('&quot;&gt;&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;&lt;path d=&quot;');
      // Should not contain unescaped script tag
      expect(result).not.toContain('<script>');
    });

    it('should escape single quotes in color', () => {
      const color = `red' onload='alert("XSS")`;
      const result = createSquiggleSVG(color);

      // Single quotes should be escaped
      expect(result).toContain('&#39;');
      expect(result).not.toContain(`' onload='`);
    });

    it('should escape double quotes to prevent attribute breakout', () => {
      const color = 'red" onload="alert(1)';
      const result = createSquiggleSVG(color);

      // Double quotes should be escaped as &quot;
      expect(result).toContain('red&quot; onload=&quot;alert(1)');
      // Should not break out of the stroke attribute
      expect(result).not.toContain('stroke="red" onload=');
    });

    it('should escape ampersands', () => {
      const color = 'rgb(255, 0, 0) & more';
      const result = createSquiggleSVG(color);

      expect(result).toContain('&amp;');
    });

    it('should escape less-than and greater-than symbols', () => {
      const color = '<color>';
      const result = createSquiggleSVG(color);

      expect(result).toContain('&lt;color&gt;');
      expect(result).not.toContain('<color>');
    });
  });

  describe('Consistency', () => {
    it('should produce same output for same color', () => {
      const color = '#123456';
      const result1 = createSquiggleSVG(color);
      const result2 = createSquiggleSVG(color);

      expect(result1).toBe(result2);
    });

    it('should produce different output for different colors', () => {
      const result1 = createSquiggleSVG('#000000');
      const result2 = createSquiggleSVG('#ffffff');

      expect(result1).not.toBe(result2);
      expect(result1).toContain('#000000');
      expect(result2).toContain('#ffffff');
    });
  });

  describe('Common color values', () => {
    it('should handle black', () => {
      const result = createSquiggleSVG('#000000');
      expect(result).toContain('#000000');
    });

    it('should handle white', () => {
      const result = createSquiggleSVG('#ffffff');
      expect(result).toContain('#ffffff');
    });

    it('should handle transparent', () => {
      const result = createSquiggleSVG('transparent');
      expect(result).toContain('transparent');
    });

    it('should handle CSS variables', () => {
      const result = createSquiggleSVG('var(--primary-color)');
      expect(result).toContain('var(--primary-color)');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string color', () => {
      const result = createSquiggleSVG('');

      expect(result).toContain('stroke=""');
    });

    it('should handle very long color strings', () => {
      const longColor = 'a'.repeat(1000);
      const result = createSquiggleSVG(longColor);

      expect(result).toContain(longColor);
    });

    it('should handle special characters', () => {
      const color = '#abc-123_xyz';
      const result = createSquiggleSVG(color);

      expect(result).toContain(color);
    });

    it('should handle unicode characters', () => {
      const color = '🎨';
      const result = createSquiggleSVG(color);

      expect(result).toContain(color);
    });
  });

  describe('SVG validity', () => {
    it('should be parseable as XML', () => {
      const result = createSquiggleSVG('#000000');

      // Attempt to parse as XML (basic check)
      expect(() => {
        new DOMParser().parseFromString(result, 'image/svg+xml');
      }).not.toThrow();
    });

    it('should have balanced tags', () => {
      const result = createSquiggleSVG('#000000');

      const svgOpen = (result.match(/<svg/g) || []).length;
      const svgClose = (result.match(/<\/svg>/g) || []).length;
      expect(svgOpen).toBe(svgClose);

      const styleOpen = (result.match(/<style/g) || []).length;
      const styleClose = (result.match(/<\/style>/g) || []).length;
      expect(styleOpen).toBe(styleClose);
    });
  });

  describe('Path properties', () => {
    it('should have fill="none" for stroke-only rendering', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('fill="none"');
    });

    it('should have stroke-width of 2', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('stroke-width="2"');
    });

    it('should have squiggle class for animation targeting', () => {
      const result = createSquiggleSVG('#000000');

      expect(result).toContain('class="squiggle"');
    });
  });

  describe('Security improvements', () => {
    it('should escape HTML entities to prevent XSS', () => {
      const colorWithEntities = '#fff&amp;<script>';
      const result = createSquiggleSVG(colorWithEntities);

      // Should be properly escaped
      expect(result).toContain('&amp;amp;');
      expect(result).toContain('&lt;script&gt;');
      expect(result).not.toContain('<script>');
    });

    it('should handle complex XSS attempts', () => {
      const xssAttempt = '"><svg onload=alert(1)>';
      const result = createSquiggleSVG(xssAttempt);

      // Should be fully escaped
      expect(result).not.toContain('"><svg');
      expect(result).toContain('&quot;&gt;&lt;svg onload=alert(1)&gt;');
      // The dangerous parts should be within escaped quotes, not as actual attributes
      expect(result).toMatch(/stroke="&quot;&gt;&lt;svg onload=alert\(1\)&gt;"/);
    });

    it('should accept invalid color formats safely', () => {
      // Even invalid colors should be safely escaped
      const invalidColor = 'not-a-valid-color" onclick="hack()';
      const result = createSquiggleSVG(invalidColor);

      // Should be escaped - the onclick should be within the escaped attribute value
      expect(result).toContain('not-a-valid-color&quot; onclick=&quot;hack()');
      // Should not create an actual onclick attribute
      expect(result).not.toContain('stroke="not-a-valid-color" onclick="hack()"');
      expect(result).toContain('&quot;');
    });
  });
});
