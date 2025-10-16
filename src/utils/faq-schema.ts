/**
 * FAQ Schema Generator for Articles
 *
 * This utility helps generate FAQ structured data for articles that contain
 * question-based content, enabling Google's FAQ rich results.
 *
 * Usage:
 * 1. Define FAQs for specific articles in the FAQ_CONTENT map below
 * 2. The schema will be automatically added to articles that have FAQs defined
 */

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ content for specific articles
 * Key is the article slug (filename without extension)
 *
 * IMPORTANT: When creating new articles, consider adding FAQ content here to improve SEO
 * and enable FAQ rich results in Google search. See docs/faq-guidelines.md for details.
 */
export const FAQ_CONTENT: Record<string, FAQItem[]> = {
  // Post-Mortem Series
  'post-mortem-psychological-safety': [
    {
      question: 'What is psychological safety in post-mortem meetings?',
      answer: "Psychological safety in post-mortems means creating an environment where team members feel safe admitting mistakes, asking questions, and voicing concerns without fear of punishment or embarrassment. It's the shared belief that the team will not punish anyone for speaking up about errors. Google's Project Aristotle research found this was the number one predictor of high-performing teams.",
    },
    {
      question: 'How does psychological safety reduce incidents?',
      answer: "Teams with high psychological safety report significantly more errors—not because they make more mistakes, but because they feel safe admitting them. This openness allows teams to surface and fix problems early, preventing small issues from becoming major outages. Google's internal data shows teams with blameless cultures suffer fewer outages and deliver better user experiences.",
    },
    {
      question: 'What is the difference between blameless and no accountability?',
      answer: 'Blameless post-mortems create more accountability, not less—just a different kind. Instead of accountability through punishment, teams focus on learning and system improvement. Performance issues are still handled through normal management channels, but the post-mortem process is kept separate from disciplinary action to encourage truth-finding.',
    },
    {
      question: 'How do I implement psychological safety in my team?',
      answer: 'Start by designing blamelessness into your process: use language that focuses on system conditions rather than individual actions, establish ground rules before incidents happen, and have leadership visibly support the approach. Create a written policy that incident reviews focus on learning not punishment, include it in onboarding, and model the behavior by having leaders share their own mistakes.',
    },
    {
      question: "What was Etsy's approach to psychological safety?",
      answer: 'Etsy implemented a Just Culture where engineers publicly share mistakes in company-wide emails with no punishment. These PSA emails describe what happened, why choices were made, and lessons learned. The CEO and CTO openly endorse this practice, creating a self-perpetuating learning culture where engineers actually become more accountable when they feel safe sharing details about mistakes.',
    },
  ],
  'post-mortem-leadership-buy-in': [
    {
      question: 'How do I convince executives that blameless post-mortems work?',
      answer: "Present the data: Google and Etsy's experiences show engineers come forward more readily in blameless cultures. Teams with psychological safety report 47% more errors because they surface issues that can be fixed. Organizations implementing systematic post-incident improvements see up to 50% fewer repeat incidents within 12 months. Frame it as optimizing for business outcomes—faster resolution and fewer outages—not individual punishment.",
    },
    {
      question: "Won't blameless post-mortems make engineers less accountable?",
      answer: "No—blameless post-mortems create more accountability, not less. People become accountable for learning and improving systems rather than being shamed for failures. Google and Etsy's data shows engineers actually own up to mistakes more readily in blameless cultures. The post-mortem arena is for truth-finding, not disciplinary action, which is handled separately through performance management.",
    },
    {
      question: 'What is the ROI of implementing better post-mortem processes?',
      answer: 'Organizations implementing systematic post-incident improvements see up to 50% fewer repeat incidents and 30% faster resolution times. Gartner estimates downtime costs approximately $5,600 per minute, so preventing even one major outage can justify the entire program investment many times over. The time investment is minimal compared to the cost of repeated firefighting.',
    },
    {
      question: "How do I handle executives who say we don't have time for thorough post-mortems?",
      answer: "Show the math: a single major incident can cost more than months of engineering time. Post-mortems don't have to be long—they can be 30 minutes if well-prepared, and standard write-ups take only 1-2 hours spread across multiple people. Much of the process integrates with existing workflows. Teams that get good at this actually save time by preventing firefighting. It's a classic pay-now or pay-later scenario.",
    },
  ],
  'post-mortem-reality-check': [
    {
      question: 'What percentage of incidents are preventable?',
      answer: "A 2024 study found that 80% of major incidents stem from internal changes like deployments and config updates that weren't tested or controlled properly. Additionally, 69% of incidents lacked proactive alerts, meaning teams only discovered problems after damage was done. This means the vast majority of outages are self-inflicted and caught too late.",
    },
    {
      question: 'How do elite teams differ from average teams in incident management?',
      answer: 'Elite teams prevent approximately 95% of repeat incidents by systematically addressing not just immediate causes but the conditions that allowed failures to happen. Average teams get stuck in a blame-fix-repeat cycle, treating each incident as isolated rather than as symptoms of systemic issues. Companies with continuous learning cultures experience far fewer customer-impacting incidents than their peers.',
    },
    {
      question: 'What does downtime really cost a business?',
      answer: 'Gartner estimates downtime costs approximately $5,600 per minute on average, which translates to roughly $300,000 per hour. For high-traffic services, costs can be even higher. Beyond direct costs, there\'s also customer churn, SLA penalties, and the opportunity cost of engineering time spent firefighting instead of innovating.',
    },
    {
      question: 'Why do incidents keep repeating at my organization?',
      answer: 'Repeat incidents happen due to three main factors: the blame reflex that stops investigation once a scapegoat is found, hindsight bias that makes failures seem obvious and leads to shallow fixes, and the action item void where follow-up tasks disappear into backlogs. Without clear ownership, tracking, and systemic analysis, the underlying vulnerabilities remain unfixed.',
    },
  ],
  'post-mortem-implementation-playbook': [
    {
      question: 'What is the 48-hour draft rule for post-mortems?',
      answer: "Complete an initial post-mortem draft within 48 hours while the incident is fresh. It doesn't need to be final, but should document the basics: timeline of events, impact assessment, known contributing factors, and initial thoughts on root cause. Fresh information is more accurate, and faster publication reassures stakeholders you're addressing issues. Google and other best-in-class organizations often publish post-mortems within 24-48 hours.",
    },
    {
      question: 'How long should the post-mortem process take from incident to improvement?',
      answer: 'The four-phase playbook spans from immediate response (0-48 hours for stabilization and draft), through deep analysis (48 hours to 7 days for root cause investigation), to action planning (7-14 days for prioritizing fixes), and finally ongoing learning integration. The complete cycle from incident to implemented improvements typically takes 2-4 weeks for priority items, though larger projects may take longer.',
    },
    {
      question: 'What is the 5-minute response rule?',
      answer: 'Elite SRE teams mobilize incident response within 5 minutes. Aim to have your on-call engineer respond and assemble a response team within this timeframe. Quick engagement can cut downtime significantly—teams that wait 30+ minutes to respond invariably suffer longer MTTR. Prerequisites include clear on-call rotations, predefined incident commander roles, and pre-established communication channels.',
    },
    {
      question: 'How often should we update stakeholders during an incident?',
      answer: "Post an update every 15-20 minutes in your public Slack channel or bridge line, even if it's just 'investigating still.' This keeps everyone aligned, prevents stakeholder anxiety and speculation, creates a timeline for the post-mortem, and enables responders to spend more time resolving the incident instead of fielding questions.",
    },
    {
      question: 'What are the success metrics for each phase of post-mortem implementation?',
      answer: 'Phase 1: Response time under 5 minutes, regular communication during incident, complete timeline documented, draft within 48 hours. Phase 2: Multiple perspectives in analysis, three or more contributing factors identified, human factors examined, peer review completed. Phase 3: All actions have individual owners, realistic deadlines set, high-priority items prioritized, leadership commitment secured. Phase 4: Greater than 80% action completion rate, decreasing repeat incidents, improving MTTR, high team satisfaction.',
    },
  ],
  'post-mortem-field-guide': [
    {
      question: 'What are the three pillars of effective post-mortems?',
      answer: 'The three pillars are: Psychological Safety Infrastructure (designing blamelessness into the process so people share truth), Systems Thinking Over Person-Hunting (focusing on how the system allowed failure rather than who to blame), and Action Accountability That Sticks (ensuring improvements actually get implemented with clear ownership and deadlines). Together, these create a self-reinforcing loop that prevents future incidents.',
    },
    {
      question: 'What is a 90-day implementation roadmap for post-mortems?',
      answer: "Month 1: Announce the initiative, publish a blameless post-mortem policy, choose a pilot incident using the new approach. Month 2: Standardize templates and tracking, train on-call engineers, begin pattern spotting, execute quick wins from Month 1's post-mortem. Month 3: Extend cross-team, conduct a 3-month review, reinforce training, celebrate and normalize the process. Success metrics include 100% completion rate and 85% action item completion.",
    },
    {
      question: 'How do I run a blameless post-mortem meeting?',
      answer: "Use a facilitator to maintain blameless tone, gather people from all relevant areas (not just directly involved engineers), use structured techniques like 5 Whys to get past surface symptoms, examine human and organizational factors, and ensure the analysis is reviewed by senior engineers. Explicitly state at the start: this is a blameless investigation where all questions are welcome and it's focused on system improvement.",
    },
    {
      question: 'What should I include in a post-mortem template?',
      answer: 'Include a Contributing Factors section (plural, expecting multiple causes), a What Went Well section to reinforce learning opportunities, a timeline of events, impact assessment, root cause analysis, and an action items table with owner, due date, and status for each. Make sure the template emphasizes blameless language and systemic framing.',
    },
  ],
  'post-mortem-systems-thinking': [
    {
      question: 'What is systems thinking in incident analysis?',
      answer: "Systems thinking means examining the conditions that made failure possible rather than hunting for who to blame. In complex systems, failures almost never result from one person or one glitch in isolation—they result from multiple contributing factors aligning. It's like Swiss cheese: you only see through when several holes line up. Systems thinking asks 'How did our system allow this?' instead of 'Who did this?'",
    },
    {
      question: 'How do I apply the 5 Whys technique to system analysis?',
      answer: "Instead of traditional 5 Whys that asks 'Why did this happen?' five times, systems-focused 5 Whys asks 'Why did the system allow this to happen?' each time. For example: Why did the database timeout? → Connection pool exhausted. Why did the system allow exhaustion? → No alerts fired. Why did the system allow alerts not to fire? → Threshold set too high. Each 'why' reveals a layer of systemic opportunity for improvement.",
    },
    {
      question: 'What is hindsight bias and how does it affect post-mortems?',
      answer: "Hindsight bias makes past events seem more predictable than they actually were. After an incident, we conclude we 'should have known' things that were actually unknowable beforehand, leading to shallow conclusions and vague 'be more careful' action items. To counter it, ask 'Could we realistically have detected this before? If not, why not? How do we change that?' This shifts focus from individual awareness to systemic detection.",
    },
    {
      question: 'How did aviation achieve high incident reporting rates?',
      answer: "Aviation achieved a 95%+ incident reporting rate through programs like NASA's Aviation Safety Reporting System, which gives pilots immunity when they voluntarily report errors or near-misses. This systemic, non-blame approach created an enormous database of issues and fixes, dramatically reducing accidents despite increasing complexity. When people aren't punished for mistakes, they report problems freely and the organization gets safer.",
    },
    {
      question: 'What are common systems thinking mistakes in post-mortems?',
      answer: 'Three common mistakes: stopping at the first reasonable cause without finding all contributing factors (complex incidents typically have 3-4), focusing only on technical factors while ignoring organizational and human elements, and making fixes too specific to the one incident instead of asking how to prevent the entire class of problems systematically.',
    },
  ],
  'post-mortem-action-accountability': [
    {
      question: 'Why do post-mortem action items often fail to get completed?',
      answer: 'Action items die due to two fatal patterns: vague ownership where items are assigned to teams or left as TBD instead of individuals, and no deadlines or follow-up where teams move on to new work and incident fixes get deprioritized indefinitely. Without clear ownership and systematic tracking, even good insights fail to translate into improvements.',
    },
    {
      question: 'How should I assign post-mortem action items?',
      answer: 'Every single action item gets assigned to an individual owner with their agreement, not to a group or TBD. That person is accountable for driving completion or escalating issues. Set target deadlines appropriate to scope: small fixes get 2-week deadlines, medium improvements get 4-8 weeks with milestones, large projects get broken into phases with concrete deliverables.',
    },
    {
      question: 'What is a good action item completion rate?',
      answer: 'Aim for greater than 80% completion rate within defined deadlines. Organizations with systematic action item tracking and completion see significantly fewer repeat incidents, while teams with poor follow-through experience many repeats. The completion gap is what separates incremental learning from real resilience.',
    },
    {
      question: 'How do I build tracking systems for post-mortem actions?',
      answer: 'Create lightweight but consistent tracking: set up an Incident Action Item Kanban visible to engineering leads and review it in staff meetings every two weeks, automate periodic Slack reminders about open tasks, or build custom reporting to see open priority actions. If leadership tracks action item closure rate as a key metric, teams are more likely to follow through.',
    },
    {
      question: 'How do I get executive buy-in for action accountability?',
      answer: "When senior leaders regularly read post-mortems and ask about follow-up status, it signals this work is truly important. In practice, have a senior leader chair post-mortem reviews for major incidents, add comments offering help with resources, and publicly recognize team members who implement major preventive fixes. When the top sets the tone that reliability improvements are first-class work, engineers make time for it.",
    },
  ],

  // Performance & Technical
  'performance-budgets-guide': [
    {
      question: 'What is a performance budget and why do I need one?',
      answer: 'A performance budget is a set of limits for key metrics that affect web performance, similar to a financial budget. It provides a shared language for all stakeholders, enables data-driven decision-making, helps maintain gains and avoid regressions, and supports holistic decision-making between features and performance. Without it, pages can become bloated with slow load times, hurting user experience and business metrics.',
    },
    {
      question: 'What are the key metrics to track in a performance budget?',
      answer: 'Core metrics include LCP (Largest Contentful Paint) for when users see main content, CLS (Cumulative Layout Shift) for layout stability, TTFB (Time to First Byte) for backend response times, and TBT (Total Blocking Time) for interactivity delays. Use-case-specific metrics vary: blogs focus on FCP, e-commerce prioritizes LCP and TTI, mobile apps emphasize small JavaScript payloads.',
    },
    {
      question: 'How much did Pinterest improve by optimizing performance?',
      answer: "Pinterest's PWA optimization reduced time to load by 40%, increased core engagement metrics like longer session times, and resulted in a 44% increase in user-generated ad revenue. They focused on optimizing core web vitals through performance budgets, resource prioritization, prefetching, lazy loading, and JavaScript bundle optimization.",
    },
    {
      question: 'What tools should I use for tracking performance during development?',
      answer: 'For development, use Webpack with bundle analyzers to monitor bundle sizes, Lighthouse CI to automate performance audits in CI/CD pipelines, Bundlesize to enforce asset size limits, Source Map Explorer to analyze JavaScript bundles, and esbuild for fast bundling. In production, use SpeedCurve for RUM and synthetic metrics, WebPageTest for detailed reports, and Sentry for real-time performance monitoring.',
    },
    {
      question: 'What are industry standard performance budgets for mobile apps?',
      answer: 'For mobile apps, aim for TTI under 5 seconds on a 3G network, JavaScript payload under 170KB for fast execution on low-bandwidth networks, FID under 100ms for responsiveness, and LCP under 2.5 seconds to deliver meaningful content quickly. These benchmarks ensure good performance even on slower devices and networks.',
    },
    {
      question: 'How can I optimize without compromising features?',
      answer: 'Use strategic loading: lazy load non-critical resources, preload essential resources, and prefetch likely next-page resources. Optimize resources through code splitting, tree shaking, and responsive images. Reduce blocking with critical CSS and service workers. Upgrade network protocols to HTTP/2 or HTTP/3 and use CDNs. Progressive rendering with skeleton screens keeps users engaged while content loads.',
    },
  ],
  'questions-to-ask-when-building-a-data-table': [
    {
      question: 'What are the key considerations when building a data table?',
      answer: 'Key considerations include data structure, sorting capabilities, filtering options, pagination, responsive design, accessibility, and performance optimization for large datasets.',
    },
    {
      question: 'How do I make data tables accessible?',
      answer: 'Ensure proper semantic HTML with table elements, add ARIA labels, support keyboard navigation, provide clear column headers, and include screen reader announcements for dynamic content.',
    },
  ],

  // Guides & Processes
  'navigating-new-product-guide-team-members': [
    {
      question: 'How do I quickly understand a new product as a team member?',
      answer: 'Start by identifying the primary audience and understanding who uses the product. Then list the tasks they perform daily to understand workflow significance. Break a key task into a detailed user flow to see pain points and delights. Map that flow to specific product sections, identify which teams own each section, and repeat this process for other important tasks.',
    },
    {
      question: 'Why is mapping user flows important for new team members?',
      answer: "Mapping user flows helps you understand the user experience at a granular level, revealing where pain points exist and where users experience delight. This insight is invaluable for product developers and support teams to identify areas for improvement and understand how different product components work together to facilitate the user's journey.",
    },
    {
      question: 'What should I document when learning a new product?',
      answer: 'Document the user flow mapped to product sections, which teams are responsible for each section, and create visual ecosystem maps using tools like Figma. This provides a shared reference point for all team members, fostering common understanding and language around the product. Regularly update this documentation as the product and users evolve.',
    },
    {
      question: 'How do I use the Starbucks mobile app as an example for user flow mapping?',
      answer: 'A user flow for ordering coffee includes: opening app, signing in, navigating to order menu, selecting store location, choosing beverage, customizing order, adding to cart, reviewing order, payment, order confirmation, receiving ready notification, and pick-up. Each stage can be a source of satisfaction or frustration, revealing where improvements can enhance user experience.',
    },
  ],
  'slack-channel-evolution-guide-organizational-growth': [
    {
      question: 'When should I start structuring Slack channels in my startup?',
      answer: "Early adoption of a structured approach is key. By establishing a clear organizational framework from the start, you avoid the complexities of restructuring and renaming down the line. Even at 5 people, start with foundational channels like #general, #dept-product, and #dept-cs. This structure empowers team members to recognize when new channels are needed and how to organize them.",
    },
    {
      question: 'What Slack channels do I need at the startup stage (5-50 people)?',
      answer: 'At this stage, add department channels (#dept-people-ops, #dept-eng, #dept-marketing), project-specific channels (#proj-sso), leadership channels (#leadership-panel), situation room for incidents, fun channels (#fun-furry-friends, #fun-trips), recognition (#you-are-awesome), announcements, automated bot channels, and random/water-cooler for casual chat. Encourage muting channels by default to manage notifications.',
    },
    {
      question: 'How should Slack channels evolve during scale-up (50-300 people)?',
      answer: 'During scale-up, separate specialized functions (DevOps from Engineering, Design from Product), introduce regional channels for distributed teams, create team/pod channels for smaller groups, establish guild channels for cross-team collaboration, and add dedicated IT support. Product focuses on high-level matters while tactical aspects move to specialized channels.',
    },
    {
      question: 'Why is channel structure important for company culture?',
      answer: "A structured approach isn't just about organization—it's an investment in long-term success. When team members understand the structure, they gain clarity and confidence, becoming better equipped to recognize when new channels are needed. This structure supports adapting to change, embracing challenges, and seizing opportunities with agility as the company grows.",
    },
  ],
  'launch-saas-startup-free-tools-guide': [
    {
      question: 'What are the best free tools for launching a SaaS startup?',
      answer: 'Key free tools include: Vercel or Netlify for hosting (100GB bandwidth free), Supabase for database (2GB free), Clerk for authentication (5,000 MAUs free), PostHog for analytics (self-hosted or limited cloud), Stripe for payments (pay per transaction), GitHub for development (private repos and 2,000 build minutes free), and Cloudflare for CDN and security (free tier).',
    },
    {
      question: 'Why use free tools instead of paid services?',
      answer: "Free tools let you iterate and experiment without financial stress when your idea is in early stages. Many are the same tools used by tech giants and successful startups—you're not settling for scraps but leveraging cutting-edge tech. These platforms offer free plans to help startups grow, with affordable upgrades when you're ready to scale, making them a smart risk-free choice.",
    },
    {
      question: 'What free authentication solutions are available for startups?',
      answer: 'Top free authentication options include: Clerk (free for up to 5,000 monthly active users), Supabase Auth (included in Supabase free plan), Auth0 (free for up to 7,000 MAUs and 2 social connections), and SuperTokens (free self-hosted authentication with advanced features like passwordless login). These provide enterprise-grade security without upfront costs.',
    },
    {
      question: 'How can I get free analytics and monitoring for my startup?',
      answer: 'PostHog offers free self-hosting or limited cloud usage with page tracking, A/B testing, feature flagging, user surveys, and session recordings. Sentry provides free error tracking for up to 5k errors/month. New Relic includes 100GB of data ingest per month with full-stack monitoring. These tools give professional-grade insights without breaking the bank.',
    },
  ],
  'essential-questions-for-joining-early-stage-startups': [
    {
      question: 'What questions should I ask before joining an early-stage startup?',
      answer: "Ask about runway and funding, product-market fit validation, team composition and culture, your role expectations, equity structure, and the company's vision for growth.",
    },
    {
      question: 'How do I evaluate equity offers at startups?',
      answer: 'Consider the percentage of ownership, vesting schedule, strike price, company valuation, funding stage, and potential dilution from future rounds.',
    },
  ],

  // Product & Design
  'designing-products-impact-guide-10-laws-principles': [
    {
      question: "What is Fitts' Law and how does it apply to product design?",
      answer: "Fitts' Law states that the time to acquire a target is a function of the distance to and size of the target. In product design, this means placing buttons and interactive elements within easy reach and ensuring they are appropriately sized. Optimize interface layouts by making frequently-used controls larger and closer to where users naturally look or interact.",
    },
    {
      question: "What is Hick's Law and why does it matter?",
      answer: "Hick's Law states that the time it takes to make a decision increases with the number and complexity of choices. To reduce choice overload in interfaces, streamline navigation and limit options presented at once. This enhances user experience by making decisions faster and less overwhelming, particularly important in onboarding and checkout flows.",
    },
    {
      question: "What is Miller's Law and how should it guide UX design?",
      answer: "Miller's Law states that the average person can only keep 7 (plus or minus 2) items in working memory. For UX, this means designing interfaces with manageable chunks of information or actions at a time. Break complex processes into steps, limit navigation items, and group related information to avoid cognitive overload.",
    },
    {
      question: "What is Jakob's Law in product design?",
      answer: "Jakob's Law states that users spend most of their time on other sites, meaning they prefer your site to work the same way as all the other sites they already know. Consistency in design patterns and conventions is key—users bring expectations from other products, so leverage familiar patterns to reduce learning curves and improve usability.",
    },
    {
      question: 'What is the Peak-End Rule and how does it affect user experience?',
      answer: 'The Peak-End Rule states that people judge an experience based mainly on how they felt at its peak (most intense point) and at its end, rather than the total sum of every moment. This influences how you design critical interactions or the conclusion of user journeys—make sure the high points are memorable and endings are satisfying to create positive overall impressions.',
    },
  ],

  // Leadership & Career
  'leadership-transition-engineers-director': [
    {
      question: 'What is the hardest transition in an engineering career?',
      answer: "The toughest leap isn't learning a new language or scaling a system—it's stepping into leadership for the first time. Engineers often underestimate how different the job becomes once you stop being judged on your commits. The skills that made you valuable as an IC don't map neatly to leadership and can actively work against you if you try to keep doing what made you successful.",
    },
    {
      question: 'Why do engineers fail when transitioning to director?',
      answer: "Engineers fail when they either keep trying to lead by being the super-engineer (reviewing every PR, making every decision) or overcompensate by leaning too hard into process, making teams feel micromanaged. Both approaches fail because leadership is a different sport—it's about enabling others, not scaling your personal output.",
    },
    {
      question: 'How should I redefine success as an engineering director?',
      answer: "Your value is no longer in writing code—it's in creating the environment where others do their best work. Shift your scoreboard from 'what I built' to 'what my team accomplished.' Your credibility grows when you protect your team's bandwidth, provide clarity, conduct fair evaluations, and have honest career conversations, not when you log more commits.",
    },
    {
      question: 'What language should engineering directors speak with executives?',
      answer: "Executives don't care about story points—they care about revenue, risk, and runway. Learn to translate technical debt into opportunity cost and roadmap risk. Technical mastery gets you in the room, but staying in the room and moving the company forward comes from clarity, focus, and trust, not from technical depth alone.",
    },
  ],
  'definitive-career-paths-engineering': [
    {
      question: 'Why should companies offer both IC and management career paths?',
      answer: 'Offering both paths enhances employee satisfaction by recognizing different strengths and career goals, optimizes skill utilization by aligning individual abilities with organizational needs, and significantly improves retention. Clear career progression paths help employees see advancement opportunities aligned with personal goals and skills, which is crucial for retaining highly skilled ICs who aren\'t interested in management.',
    },
    {
      question: 'What is a Tech Lead and how does it fit into career paths?',
      answer: 'Tech Lead is not a formal role on the IC or manager tracks, but a critical function that can be filled by members from either path. It focuses on enhancing team productivity through technical skills and delegation, making independent decisions for the team, contributing to career development, and learning to handle complex management situations while remaining hands-on with technical work.',
    },
    {
      question: 'What are the key levels in the individual contributor track?',
      answer: 'The IC track progresses through: Engineer I (1-2 years, learning core concepts), Engineer II (2-6+ years, writing clean code), Senior Engineer I & II (5-9+ years, making design choices and mentoring), Staff Engineer (sought for guidance, creating sweeping improvements), Senior Staff Engineer (anticipating tech changes, influencing long-term success), and Principal Engineer/Chief Architect (setting technical direction and multi-year strategy).',
    },
    {
      question: 'What are the key responsibilities at each management level?',
      answer: 'Engineering Lead focuses on agile practices and clearing roadblocks. Engineering Director ensures technical competence and develops high-velocity organizations. VP of Engineering translates strategic vision into actionable roadmaps and identifies organizational bottlenecks. CTO sets company-wide technical direction, organizational priorities, and identifies business growth opportunities enabled by technology.',
    },
  ],
  'ai-replacing-junior-roles-future-of-expertise': [
    {
      question: 'Why is AI replacing junior roles problematic?',
      answer: "Replacing junior roles with AI cuts off the entry points into industries, disrupting the talent pipeline. Senior professionals don't magically appear—their expertise is forged over years of hands-on work, trial and error, and learning from real-world challenges. If AI replaces junior roles entirely, we risk eliminating the foundation that produces mid-level and senior experts.",
    },
    {
      question: 'Can AI-equipped juniors skip to mid-level work?',
      answer: "No—AI-assisted professionals may appear competent but lack the depth needed for informed decisions. Expertise isn't just about completing tasks, it's about understanding why things work. Real-world problem-solving means navigating constraints, debugging unexpected failures, and understanding business logic, not just following AI-generated solutions. Without foundational learning, juniors lack the judgment crucial for mid-level work.",
    },
    {
      question: 'What is the flight simulator problem with AI?',
      answer: "AI is like a flight simulator—it can teach mechanics but doesn't replace hands-on experience. You won't develop the instincts from real practice: feeling the plane's response, having muscle memory for reactions, or handling unpredictable scenarios the simulator didn't cover. Similarly, juniors relying on AI too soon might look competent but struggle when faced with challenges AI doesn't have pre-written answers for.",
    },
    {
      question: 'What are the long-term consequences of eliminating junior roles?',
      answer: "Long-term consequences include: an expertise bottleneck where fewer juniors today means fewer experts tomorrow, over-reliance on external hiring that's costly and lacks institutional knowledge, loss of innovation and critical thinking from fresh perspectives, and a shallow knowledge workforce that performs well under normal conditions but struggles with edge cases requiring deeper expertise.",
    },
    {
      question: 'How should AI be used with junior employees?',
      answer: 'AI should be positioned as a tool for acceleration, not a replacement for learning. Use AI as a tutor providing real-time feedback, for assisted troubleshooting that still requires human decision-making, and to automate low-value tasks while freeing time for strategic learning. Combine AI-driven efficiencies with structured mentorship and apprenticeship-style learning to ensure juniors develop beyond automation.',
    },
  ],
  'why-your-best-engineers-keep-leaving': [
    {
      question: 'Why do engineers leave if compensation is competitive?',
      answer: "Once compensation is fair, the main reason engineers leave is lack of internal mobility and visible career growth. Internal mobility doubles retention—employees who can move up stay 5.4 years on average, while those who can't leave in under three years. Engineers don't leave for money; they leave when they can't see a future. The data shows career growth and visibility matter more than perks.",
    },
    {
      question: 'What is the danger of flat organizations?',
      answer: "Without visible levels or clear expectations, engineers feel stuck. Promotions get tied to headcount rather than capability, and often the only way up is into management. That's not a path, it's a funnel that pushes great engineers out even if they like the work. Flat structures feel egalitarian early on but become problematic as organizations scale.",
    },
    {
      question: 'How do I show growth without constant promotions?',
      answer: "Engineers don't need a new title every year, but they do need to see progress. Growth takes three forms: scope growth (tackling bigger, messier problems), skill growth (deepening expertise, leading incidents, learning new domains), and signal growth (visibility, recognition, and impact across the organization). Pair these with recognition and appropriate compensation to avoid scope creep feeling like exploitation.",
    },
    {
      question: 'What are dual tracks and why do they matter?',
      answer: 'Dual tracks mean publishing parallel IC and Manager tracks with equal prestige. Too many organizations only reward those who step into management, creating a trap where engineers who want to keep building feel stuck, or those who don\'t want to manage take management roles just to grow. Both paths should emphasize impact and leadership at higher levels with equal respect and compensation.',
    },
    {
      question: 'How do I scale mentorship beyond one-on-one pairing?',
      answer: 'Layered mentoring includes: Chapters (discipline-based groups like UI, Mobile, or Infra that maintain standards), Guilds (cross-cutting communities of practice from performance to accessibility), and Clinics (recurring design reviews or incident debriefs where everyone learns). This scales mentorship without requiring endless meetings, using lightweight async docs, quarterly deep dives, or rotating facilitators.',
    },
    {
      question: 'What should I do this quarter to improve retention?',
      answer: "If you only do one thing: publish your ladder. A single one-pager showing levels, expectations, and example artifacts does more for retention than any perk. It gives engineers proof there's a path forward. From there, layer in chapters with Staff-level IC maintainers, open rotational slots, replace ad-hoc mentoring with weekly craft clinics, add stay interviews, and track three metrics: internal transfer rate, percentage of mids with named mentors, and time-to-first cross-team win.",
    },
  ],
  'scaling-engineering-teams-walls': [
    {
      question: 'What are the three walls engineering teams hit while scaling?',
      answer: 'Between 5 and 50 engineers, teams hit three predictable walls: The Communication Wall (often 8-15 engineers) where shared awareness collapses, the Coordination Wall (often 20-30 engineers) where working together without stepping on toes becomes hard despite awareness, and the Culture Wall (unavoidable at 40+ engineers) where culture fragments unless actively managed.',
    },
    {
      question: 'What is the Communication Wall and how do I break through?',
      answer: "The Communication Wall appears when shared awareness collapses—everyone used to know everything, but now product-impacting decisions happen in parallel without alignment. The danger is divergence, not duplication. Break through by establishing lightweight rituals (daily standups, weekly updates, decision logs), over-documenting decisions even when they feel obvious, and repeating key messages until they land.",
    },
    {
      question: 'What causes the Coordination Wall?',
      answer: "The Coordination Wall shows up once you have multiple teams where dependencies multiply and priorities collide. You're not shipping slower because of bad code, but because moving the org takes choreography. It happens when first management layers appear, there's no clear ownership causing teams to block each other, and rapid hiring accelerates the pain—triple headcount in six months and this wall hits hard.",
    },
    {
      question: 'How do I break through the Coordination Wall?',
      answer: 'Create small, autonomous teams with clear ownership, assign a single-threaded leader per project (one owner, not three co-owners), and add process gradually starting with the lightest version that works: RFCs for cross-team decisions, quarterly or biannual planning scaled to your pace, and a visible dependency board so surprises don\'t pile up late.',
    },
    {
      question: 'When does the Culture Wall become unavoidable?',
      answer: "Culture drift shows hints around 15-20 people but becomes unavoidable at 40+ engineers. By this point, new hires don't know inside jokes or founding stories, different teams feel like distinct subcultures, early employees miss the family vibe they built, and later employees feel like second-class citizens. You either steer culture actively or it fragments on its own.",
    },
    {
      question: 'How do I break through the Culture Wall?',
      answer: "Write down your values but don't stop there—decide who owns culture (founders set direction, managers model it daily, by 50+ People/HR reinforces it in hiring, onboarding, and promotions). Accept that culture evolves; the goal isn't to freeze it but to guide it so it grows in line with your mission. This ensures the culture scales while maintaining core values.",
    },
  ],
};

/**
 * Generates FAQ schema for a given article slug
 */
export function generateFAQSchema(slug: string): object | null {
  const faqs = FAQ_CONTENT[slug];

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Checks if an article has FAQ content defined
 */
export function hasFAQContent(slug: string): boolean {
  return slug in FAQ_CONTENT && FAQ_CONTENT[slug].length > 0;
}

/**
 * Gets the list of all article slugs that have FAQ content
 */
export function getArticlesWithFAQ(): string[] {
  return Object.keys(FAQ_CONTENT);
}
