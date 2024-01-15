import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from "tailwindcss/plugin";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'sliding-gradient': 'linear-gradient(white, white), linear-gradient(#71cbc4, #71cbc4), linear-gradient(#e8608c, #e8608c)',
      },
      backgroundSize: {
        'sliding-initial': '20px 18px, 100% 18px, 0 18px',
        'sliding-hover': '20px 18px, 0 18px, 100% 18px',
      },
      backgroundPosition: {
        'sliding-initial': 'calc(20px * -1) 100%, 100% 100%, 0 100%',
        'sliding-hover': 'calc(100% + 20px) 100%, 100% 100%, 0 100%',
      },
      transitionProperty: {
        'bg-size-position': 'background-size, background-position',
      },

      animation: {
        'slide-bg': 'slideBackground 3s ease-in-out infinite',
      },
      fontFamily: {
        vt323: ['"VT323"', ...defaultTheme.fontFamily.sans],
        sourceSerif4: ['"Source Serif 4"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'titleSmall': 'clamp(2rem, 23vw, 2rem)',
        'titleLarge': 'clamp(3rem, 23vw, 6rem)',
      },
      colors: {
        articleDescription: '#f0f',
        drakenhofNightshade: '#2262a1',
        drakenhofNightshadeShade: '#0e2740',
        drakenhofNightshadeTint: '#a7c0d9',
        drWhite: '#fafafa',
        goshawkGrey: '#444',
        grey: '#808080',
        loveLetter: '#e8608c',
        turkishTeal: '#71cbc4',
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.transition-bg': {
          transition: 'background-size 320ms 100ms ease-out, background-position 320ms 100ms ease-out',
        },
      };
      addUtilities(newUtilities);
    }),

  ],
} satisfies Config

