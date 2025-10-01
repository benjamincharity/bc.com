/**
 * Console Easter Egg utilities
 * Displays fun messages in the browser console for developers who inspect the page
 */

interface EasterEggConfig {
  enabled?: boolean;
  showLogo?: boolean;
  showMessages?: boolean;
  showBadge?: boolean;
  customMessages?: string[];
}

const defaultConfig: EasterEggConfig = {
  enabled: true,
  showLogo: true,
  showMessages: true,
  showBadge: true,
  customMessages: []
};

const logo = `
╭─────────────────────────────────────────────────────╮
│                                                     │
│   ██████╗ ███████╗███╗   ██╗     ██████╗██╗  ██╗   │
│   ██╔══██╗██╔════╝████╗  ██║    ██╔════╝██║  ██║   │
│   ██████╔╝█████╗  ██╔██╗ ██║    ██║     ███████║   │
│   ██╔══██╗██╔══╝  ██║╚██╗██║    ██║     ██╔══██║   │
│   ██████╔╝███████╗██║ ╚████║    ╚██████╗██║  ██║   │
│   ╚═════╝ ╚══════╝╚═╝  ╚═══╝     ╚═════╝╚═╝  ╚═╝   │
│                                                     │
│              Benjamin Charity                       │
│          Full-Stack Engineer                        │
│                                                     │
╰─────────────────────────────────────────────────────╯
`;

const messages = [
  "👋 Hey there, fellow developer!",
  "🔍 Thanks for checking out my code!",
  "💼 I'm Benjamin, a full-stack engineer passionate about TypeScript, React, and modern web technologies.",
  "🚀 This site is built with Astro 5.x, React 19, and Tailwind CSS.",
  "📝 All the source code is available on GitHub: https://github.com/benjamincharity/bc.com",
  "☕ Want to collaborate or just chat about tech? Reach out!",
  "📧 Email: hello@bc.com",
  "🐦 Twitter: @benjamincharity",
  "💼 LinkedIn: linkedin.com/in/benjamincharity",
  "🎨 Fun fact: This console message changes randomly on each visit!",
];

const randomMessages = [
  "🎯 Pro tip: Press Cmd/Ctrl + Shift + I to toggle this console!",
  "🎪 Did you know? This site has interactive canvas animations!",
  "🌙 Toggle between light and dark themes with the button in the header!",
  "📱 This site is a PWA - try installing it on your device!",
  "⚡ Built with performance in mind - check out those Lighthouse scores!",
  "🧪 I love experimenting with new web technologies - what's your favorite?",
  "🎨 The color palette uses CSS custom properties for theming magic!",
  "🔧 Built with TypeScript strict mode because type safety matters!",
  "📊 All articles are written in MDX with custom rehype/remark plugins!",
  "🎭 The canvas background responds to your mouse movements - try it out!",
];

const badges = [
  "Built with ❤️ and lots of ☕",
  "TypeScript Enthusiast",
  "React Aficionado",
  "Performance Optimizer",
  "Open Source Contributor",
  "Modern Web Advocate"
];

/**
 * Get a random item from an array
 */
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Display the logo in console
 */
const showLogo = () => {
  console.log(
    `%c${logo}`,
    'color: #ec4899; font-family: monospace; font-size: 12px; font-weight: bold;'
  );
};

/**
 * Display welcome messages
 */
const showMessages = (customMessages: string[] = []) => {
  const allMessages = [...messages, ...customMessages];

  allMessages.forEach((message, index) => {
    setTimeout(() => {
      console.log(
        `%c${message}`,
        'color: #06b6d4; font-size: 14px; font-weight: bold;'
      );
    }, index * 100);
  });

  // Show a random message after the main ones
  setTimeout(() => {
    const randomMsg = getRandomItem(randomMessages);
    console.log(
      `%c${randomMsg}`,
      'color: #10b981; font-size: 13px; font-style: italic;'
    );
  }, allMessages.length * 100 + 500);
};

/**
 * Display a badge
 */
const showBadge = () => {
  const badge = getRandomItem(badges);

  setTimeout(() => {
    console.log(
      `%c 🏷️ ${badge} `,
      'background: linear-gradient(90deg, #ec4899, #06b6d4); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 12px; margin: 10px 0;'
    );
  }, messages.length * 100 + 1000);
};

/**
 * Add some interactive console functions
 */
const addConsoleFunctions = () => {
  // Add a function to the global scope for fun interactions
  (window as any).bc = {
    version: '2.0.0',
    tech: ['Astro', 'React', 'TypeScript', 'Tailwind CSS'],
    contact: () => {
      console.log(
        '%c📧 Want to get in touch?',
        'color: #ec4899; font-size: 16px; font-weight: bold;'
      );
      console.log('Email: hello@bc.com');
      console.log('Twitter: @benjamincharity');
      console.log('LinkedIn: linkedin.com/in/benjamincharity');
      console.log('GitHub: github.com/benjamincharity');
    },
    portfolio: () => {
      console.log(
        '%c🚀 Check out my work:',
        'color: #06b6d4; font-size: 16px; font-weight: bold;'
      );
      console.log('• This very website you\'re on!');
      console.log('• Various open source projects on GitHub');
      console.log('• Lots of React and TypeScript projects');
    },
    surprise: () => {
      const surprises = [
        'console.log("🎉 You found the secret function!");',
        'console.log("🦄 Magic happens when you least expect it!");',
        'console.log("🎪 The circus is in town!");',
        'console.log("🎭 Every great website needs a little theater!");',
        'console.log("🎨 Code is art, and art is code!");',
      ];

      const surprise = getRandomItem(surprises);
      eval(surprise);
    }
  };

  // Add help function
  (window as any).help = () => {
    console.log(
      '%cAvailable console functions:',
      'color: #8b5cf6; font-size: 16px; font-weight: bold;'
    );
    console.log('• bc.contact() - Get contact information');
    console.log('• bc.portfolio() - See my work');
    console.log('• bc.surprise() - Random surprise!');
    console.log('• help() - Show this help message');
  };

  // Log that functions are available
  setTimeout(() => {
    console.log(
      '%c💡 Try typing bc.contact(), bc.portfolio(), or bc.surprise() in this console!',
      'color: #f59e0b; font-size: 13px; background: rgba(251, 191, 36, 0.1); padding: 4px 8px; border-radius: 4px;'
    );
  }, messages.length * 100 + 1500);
};

/**
 * Initialize the console easter egg
 */
export const initConsoleEasterEgg = (config: EasterEggConfig = {}) => {
  const finalConfig = { ...defaultConfig, ...config };

  // Don't run in development or if disabled
  if (!finalConfig.enabled || import.meta.env.DEV) {
    return;
  }

  // Only run in browser
  if (typeof window === 'undefined') {
    return;
  }

  // Wait a bit to let the page load
  setTimeout(() => {
    if (finalConfig.showLogo) {
      showLogo();
    }

    if (finalConfig.showMessages) {
      showMessages(finalConfig.customMessages);
    }

    if (finalConfig.showBadge) {
      showBadge();
    }

    // Always add interactive functions
    addConsoleFunctions();
  }, 1000);
};

/**
 * Show a custom message in the console
 */
export const consoleMessage = (
  message: string,
  style = 'color: #ec4899; font-size: 14px; font-weight: bold;'
) => {
  if (typeof window !== 'undefined') {
    console.log(`%c${message}`, style);
  }
};

/**
 * Track console usage (for analytics)
 */
export const trackConsoleUsage = () => {
  if (typeof window === 'undefined') return;

  // Detect if dev tools are opened
  let devtools = { open: false };
  const threshold = 160;

  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (!(heightThreshold && widthThreshold) &&
        ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) ||
         widthThreshold ||
         heightThreshold)) {

      if (!devtools.open) {
        devtools.open = true;
        consoleMessage('🔧 Developer detected! Welcome to the dark side!');
      }
    } else {
      devtools.open = false;
    }
  }, 1000);
};