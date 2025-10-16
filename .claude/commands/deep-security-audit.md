The `/security-audit` command deploys 100 specialized virtual sub-agents to conduct a comprehensive enterprise-grade audit of your entire codebase. Each agent operates as a world-class expert in their domain, examining every line of code with the mindset that hostile actors have full visibility to your public repository.

## Features

- **100 Specialized Sub-Agents**: Each agent is an expert in specific security, performance, and optimization domains
- **Enterprise-Grade Analysis**: Line-by-line examination assuming hostile actor visibility
- **Comprehensive Scoring**: 0-100 scores across 10+ major categories with detailed justification
- **Resource Optimization**: Maximizes free tier usage (Upstash Redis, Arcjet, Vercel) without reducing functionality
- **Prioritized Recommendations**: Critical, High, Medium, and Low priority actionable items
- **Implementation Roadmap**: Quick wins, short-term, medium-term, and long-term improvement plans

## Usage

```
/security-audit [scope]
```

### Parameters

- `scope` (optional): Specific focus area - defaults to "all"
  - `all` - Full comprehensive audit (default)
  - `security` - Focus on security specialists
  - `performance` - Focus on performance optimization

## Sub-Agent Categories

### Security Specialists (15 agents)
- Authentication Security
- Content Security Policy
- Input Validation
- API Security
- Dependency Security
- Environment Security
- Transport Security
- Client-Side Security
- Server Security
- Third-Party Security
- Bot Protection
- DDoS Protection
- Information Disclosure
- Access Control
- Cryptographic Security

### Performance Specialists (12 agents)
- Core Web Vitals
- Bundle Optimization
- Image Optimization
- Font Optimization
- CSS Performance
- JavaScript Performance
- Caching Strategy
- Database Performance
- Network Performance
- Rendering Performance
- Memory Management
- Mobile Performance

### Code Quality Specialists (10 agents)
- TypeScript Excellence
- React Best Practices
- Code Architecture
- Error Handling
- Testing Coverage
- Code Consistency
- Documentation Quality
- Maintainability
- Accessibility Compliance
- Refactoring Opportunities

### SEO & Content Specialists (8 agents)
- Technical SEO
- Page Speed SEO
- Content Structure
- Schema Markup
- Sitemap Optimization
- Internal Linking
- Mobile SEO
- International SEO

### Infrastructure Specialists (10 agents)
- Vercel Optimization
- Redis Utilization
- CDN Strategy
- Build Process
- Environment Management
- Monitoring & Observability
- Backup & Recovery
- Scalability Planning
- Resource Allocation
- Deployment Strategy

### Business Logic Specialists (8 agents)
- Data Flow Architecture
- API Design
- User Experience Flow
- Content Management
- Search Functionality
- Analytics Integration
- Third-Party Integrations
- Feature Flag Management

### Compliance & Standards Specialists (7 agents)
- Privacy Compliance
- Web Standards
- Browser Compatibility
- Progressive Web App
- Internationalization
- Content Security
- Legal Compliance

### Optimization Specialists (10 agents)
- Asset Optimization
- Database Query Optimization
- Memory Optimization
- Network Optimization
- Storage Optimization
- Computational Optimization
- Resource Loading
- Third-Party Optimization
- Mobile Optimization
- Accessibility Optimization

### Maintenance & Operations Specialists (8 agents)
- Dependency Management
- Code Organization
- Configuration Management
- Logging & Debugging
- Health Monitoring
- Backup Strategies
- Documentation Maintenance
- Version Control

### Specialized Audit Agents (12 agents)
- Dead Code Detection
- Performance Regression
- Security Vulnerability Scanning
- Lighthouse Audit
- Bundle Analysis
- Accessibility Audit
- SEO Technical Audit
- Mobile Audit
- Loading Performance
- Code Duplication
- Configuration Audit
- Overall Architecture Review

## Examples

### Full Comprehensive Audit

```bash
/security-audit
# Deploys all 100 sub-agents for complete analysis
```

### Security-Focused Audit

```bash
/security-audit security
# Focuses on 15 security specialists + related infrastructure agents
```

### Performance-Focused Audit

```bash
/security-audit performance
# Focuses on 12 performance specialists + optimization agents
```

## Audit Deliverables

### Executive Summary
- Overall assessment and critical findings
- Risk assessment and impact analysis
- Strategic recommendations overview

### Category Scores (0-100 scale)
- **Security Score**: Vulnerability breakdown by type
- **Performance Score**: Core Web Vitals and optimization analysis
- **Code Quality Score**: Maintainability and technical debt metrics
- **SEO Score**: Technical SEO compliance assessment
- **Scalability Score**: Resource efficiency and scaling readiness
- **Accessibility Score**: WCAG compliance level evaluation
- **Infrastructure Score**: Cloud optimization and deployment assessment
- **Compliance Score**: Standards adherence and regulatory compliance
- **Maintainability Score**: Technical debt and code organization
- **Optimization Score**: Resource utilization efficiency

### Prioritized Recommendations

#### Critical Issues (Immediate Action Required)
- Security vulnerabilities with high CVSS scores
- Performance blockers affecting Core Web Vitals
- Compliance violations with legal implications

#### High Priority (Significant Impact)
- Architecture improvements for scalability
- Security hardening recommendations
- Performance optimizations with measurable impact

#### Medium Priority (Notable Optimizations)
- Code quality improvements
- SEO enhancements
- Resource utilization optimizations

#### Low Priority (Minor Enhancements)
- Documentation improvements
- Code style consistency
- Development workflow optimizations

### Resource Optimization Plan

#### Redis Utilization (Upstash Free Tier)
- Caching strategies to maximize free tier
- Memory optimization techniques
- Connection pooling recommendations

#### Arcjet Optimization (500k requests/month free)
- Enhanced security within free limits
- Rate limiting optimization
- Bot protection configuration

#### Vercel Efficiency (Preparation for Free Tier)
- Build optimization for faster deployments
- Function optimization for reduced execution time
- Bandwidth optimization strategies

### Implementation Roadmap

#### Quick Wins (0-1 week)
- Configuration adjustments
- Security header implementations
- Basic performance optimizations

#### Short Term (1-4 weeks)
- Code refactoring projects
- Infrastructure improvements
- Testing implementation

#### Medium Term (1-3 months)
- Architecture modernization
- Advanced security implementations
- Performance monitoring setup

#### Long Term (Strategic)
- Scalability architecture
- Advanced compliance implementation
- Enterprise feature development

## Audit Methodology

### Analysis Depth
- **Line-by-line examination** of entire codebase
- **Configuration review** of all deployment and build settings
- **Dependency analysis** for security and performance implications
- **Architecture assessment** for scalability and maintainability

### Security Mindset
- Assumes hostile actors have full repository visibility
- Evaluates every public code line for potential exploitation
- Tests for OWASP Top 10 and emerging threat vectors
- Assesses supply chain security and dependency risks

### Resource Optimization Focus
- Maximizes free tier efficiency across all services
- Identifies opportunities to reduce paid service usage
- Optimizes for cost-effective scaling strategies
- Maintains all existing functionality during optimization

### Scoring System
- **0-100 scale** with detailed justification for each score
- **Industry benchmarks** comparison for context
- **Weighted scoring** based on security and business impact
- **Trend analysis** for performance regression detection

## Technical Stack Context

### Current Technology Stack
- **Framework**: Next.js 15.5.4 with React Compiler
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS with custom design system
- **UI Library**: shadcn/ui + Radix UI components
- **Security**: Arcjet middleware (500k requests/month free tier)
- **Cache**: Upstash Redis (free tier via Vercel Marketplace)
- **Hosting**: Vercel (currently paid, planning free tier migration)
- **Content**: MDX-based content management system
- **Database**: Static generation with optional dynamic content

### Deployment Constraints
- **Public Repository**: Every line visible to potential attackers
- **Resource Limits**: Must optimize for free tier usage
- **Performance Requirements**: Core Web Vitals compliance
- **Security Standards**: Enterprise-grade for open-source project
- **Scalability**: Prepared for traffic growth within free tiers

This comprehensive audit ensures your production codebase meets enterprise security standards while optimizing for maximum efficiency within free tier constraints.