#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

/**
 * Internal Linking Analysis Script
 * 
 * Analyzes all MDX files in the blog directory to identify:
 * - Current internal link counts per article
 * - Potential linking opportunities based on content analysis
 * - Articles with zero internal links
 */

const BLOG_DIR = 'src/content/blog';
const OUTPUT_FILE = 'internal-linking-analysis.md';

/**
 * Extract frontmatter from MDX file using proper YAML parser
 */
function extractFrontmatter(content) {
  try {
    const { data } = matter(content);
    return data;
  } catch (error) {
    console.warn('Failed to parse frontmatter:', error.message);
    return null;
  }
}

/**
 * Count internal links in content
 */
function countInternalLinks(content) {
  // Look for markdown links to /articles/ paths
  const internalLinkRegex = /\[([^\]]+)\]\(\/articles\/[^)]+\)/g;
  const matches = content.match(internalLinkRegex);
  return matches ? matches.length : 0;
}

/**
 * Find potential linking opportunities
 */
function findLinkingOpportunities(articles) {
  const opportunities = [];
  
  articles.forEach(article => {
    const articleOpportunities = [];
    const content = article.content.toLowerCase();
    const title = article.title.toLowerCase();
    
    // Check for keyword matches with other articles
    articles.forEach(otherArticle => {
      if (otherArticle.slug === article.slug) return;
      
      const otherTitle = otherArticle.title.toLowerCase();
      const otherTags = otherArticle.tags || [];
      
      // Check if current article mentions concepts from other article
      let matchCount = 0;
      const matchedKeywords = [];
      
      otherTags.forEach(tag => {
        if (content.includes(tag.toLowerCase()) || title.includes(tag.toLowerCase())) {
          matchCount++;
          matchedKeywords.push(tag);
        }
      });
      
      // Check for title word matches
      const titleWords = otherTitle.split(' ').filter(word => word.length > 3);
      titleWords.forEach(word => {
        if (content.includes(word) && !matchedKeywords.includes(word)) {
          matchCount++;
          matchedKeywords.push(word);
        }
      });
      
      if (matchCount >= 2) {
        articleOpportunities.push({
          targetArticle: otherArticle.title,
          targetSlug: otherArticle.slug,
          matchCount,
          matchedKeywords: matchedKeywords.slice(0, 3) // Show top 3 matches
        });
      }
    });
    
    if (articleOpportunities.length > 0) {
      opportunities.push({
        article: article.title,
        slug: article.slug,
        currentLinks: article.internalLinks,
        opportunities: articleOpportunities
          .sort((a, b) => b.matchCount - a.matchCount)
          .slice(0, 5) // Top 5 opportunities
      });
    }
  });
  
  return opportunities;
}

/**
 * Main analysis function
 */
function analyzeInternalLinks() {
  console.log('🔍 Analyzing internal links...\n');
  
  // Get all MDX files
  const mdxFiles = glob.sync(`${BLOG_DIR}/**/*.mdx`);
  
  if (mdxFiles.length === 0) {
    console.error('❌ No MDX files found in', BLOG_DIR);
    process.exit(1);
  }
  
  console.log(`📄 Found ${mdxFiles.length} articles to analyze\n`);
  
  // Process each file
  const articles = [];
  
  mdxFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = extractFrontmatter(content);

      if (!frontmatter || frontmatter.draft === true) {
        return; // Skip drafts
      }
      
      const slug = path.basename(filePath, '.mdx');
      const internalLinks = countInternalLinks(content);
      
      articles.push({
        slug,
        title: frontmatter.title || 'Untitled',
        tags: frontmatter.tags || [],
        internalLinks,
        content: content.replace(/^---[\s\S]*?---\n/, '') // Remove frontmatter
      });
    } catch (error) {
      console.warn(`⚠️  Error processing ${filePath}:`, error.message);
    }
  });
  
  // Generate statistics
  const totalArticles = articles.length;
  const articlesWithZeroLinks = articles.filter(a => a.internalLinks === 0).length;
  const articlesWithFewLinks = articles.filter(a => a.internalLinks >= 1 && a.internalLinks <= 2).length;
  const articlesWithManyLinks = articles.filter(a => a.internalLinks >= 3).length;
  
  // Find linking opportunities
  const opportunities = findLinkingOpportunities(articles);
  
  // Generate report
  const report = generateReport(articles, opportunities, {
    totalArticles,
    articlesWithZeroLinks,
    articlesWithFewLinks,
    articlesWithManyLinks
  });
  
  // Output to console
  console.log(report);
  
  // Save to file
  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`\n📝 Report saved to ${OUTPUT_FILE}`);
}

/**
 * Generate markdown report
 */
function generateReport(articles, opportunities, stats) {
  const { totalArticles, articlesWithZeroLinks, articlesWithFewLinks, articlesWithManyLinks } = stats;
  
  let report = `# Internal Linking Analysis Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Summary
  report += `## Summary\n\n`;
  report += `- **Total articles**: ${totalArticles}\n`;
  report += `- **Articles with 0 links**: ${articlesWithZeroLinks} (${Math.round(articlesWithZeroLinks/totalArticles*100)}%)\n`;
  report += `- **Articles with 1-2 links**: ${articlesWithFewLinks} (${Math.round(articlesWithFewLinks/totalArticles*100)}%)\n`;
  report += `- **Articles with 3+ links**: ${articlesWithManyLinks} (${Math.round(articlesWithManyLinks/totalArticles*100)}%)\n\n`;
  
  // Articles with zero links (excluding post-mortem series)
  const zeroLinkArticles = articles
    .filter(a => a.internalLinks === 0 && !a.slug.includes('post-mortem'))
    .sort((a, b) => a.title.localeCompare(b.title));
  
  if (zeroLinkArticles.length > 0) {
    report += `## Articles with Zero Internal Links\n\n`;
    report += `These articles have no internal links and could benefit from contextual linking:\n\n`;
    
    zeroLinkArticles.forEach(article => {
      report += `- [${article.title}](/articles/${article.slug}) (${article.tags.join(', ')})\n`;
    });
    report += `\n`;
  }
  
  // Top linking opportunities
  if (opportunities.length > 0) {
    report += `## Top Linking Opportunities\n\n`;
    report += `These articles have high potential for internal linking based on content analysis:\n\n`;
    
    opportunities.slice(0, 10).forEach(opp => {
      report += `### ${opp.article}\n`;
      report += `**Current links**: ${opp.currentLinks}\n\n`;
      report += `**Potential links**:\n`;
      
      opp.opportunities.forEach(target => {
        report += `- [${target.targetArticle}](/articles/${target.targetSlug}) `;
        report += `(${target.matchCount} matches: ${target.matchedKeywords.join(', ')})\n`;
      });
      report += `\n`;
    });
  }
  
  // All articles with link counts
  report += `## Complete Article Analysis\n\n`;
  report += `| Article | Links | Tags |\n`;
  report += `|---------|-------|------|\n`;
  
  articles
    .sort((a, b) => b.internalLinks - a.internalLinks)
    .forEach(article => {
      const linkCount = article.internalLinks;
      const linkStatus = linkCount === 0 ? '🔴' : linkCount <= 2 ? '🟡' : '🟢';
      report += `| [${article.title}](/articles/${article.slug}) | ${linkStatus} ${linkCount} | ${article.tags.join(', ')} |\n`;
    });
  
  return report;
}

// Run the analysis
analyzeInternalLinks();
