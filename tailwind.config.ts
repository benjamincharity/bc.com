import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      animation: {
        'slide-bg': 'slideBackground 3s ease-in-out infinite',
        gentleRotate: 'gentleRotate 4s ease-in-out infinite',
      },
      aspectRatio: {
        'first-hero': '16 / 6',
      },
      backgroundImage: {
        'sliding-gradient':
          'linear-gradient(white, white), linear-gradient(#8ae6df, #8ae6df), linear-gradient(#f184a8, #f184a8)',
        'sliding-gradient-dark':
          'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)), linear-gradient(rgba(138, 230, 223, 0.1), rgba(138, 230, 223, 0.1)), linear-gradient(rgba(241, 132, 168, 0.3), rgba(241, 132, 168, 0.5))',

        strongBg:
          'linear-gradient(-100deg, rgba(255, 244, 0, 0.2), rgba(255, 244, 0, 0.5) 95%, rgba(255, 244, 0, 0.1))',
        strongBgDark:
          'linear-gradient(-100deg, rgba(255, 244, 0, 0.1), rgba(255, 244, 0, 0.3) 95%, rgba(255, 244, 0, 0.1))',
        wavyBg: 'var(--o-squiggle-link-backgroundImage)',
      },
      backgroundPosition: {
        'sliding-initial': 'calc(20px * -1) 100%, 100% 100%, 0 100%',
        'sliding-hover': 'calc(100% + 20px) 100%, 100% 100%, 0 100%',
      },
      backgroundSize: {
        'sliding-initial': '20px 18px, 100% 18px, 0 18px',
        'sliding-hover': '20px 18px, 0 18px, 100% 18px',
      },
      colors: {
        codeBackground: '#f7f7f7',
        codeBoxShadow: '#dfdfdf',
        drWhite: '#fafafa',
        goshawkGrey: '#444',
        grey: '#808080',
        imageOutline: '#dfdfdf',
        inlineCodeBackgroundColor: '#e4e4e4',
        mark: 'rgb(221,217,121)',
        markDark: 'rgba(221,217,121,0.4)',
        pink: {
          100: '#fdeef4',
          200: '#fbdde9',
          300: '#f9ccde',
          400: '#f7bbd3',
          500: '#f184a8',
          600: '#c96f8e',
          700: '#a15a74',
          800: '#78465a',
          900: '#503240',
        },
        teal: {
          100: '#e0f7fa',
          200: '#b3eff5',
          300: '#86e7f0',
          400: '#59dfeb',
          500: '#8ae6df',
          600: '#6db9b9',
          700: '#509293',
          800: '#346b6d',
          900: '#184547',
        },
        blue: {
          100: '#e1ecf4',
          200: '#c3d9e9',
          300: '#a5c6de',
          400: '#87b3d3',
          500: '#2262a1',
          600: '#1c4e81',
          700: '#163a61',
          800: '#102641',
          900: '#0a1221',
        },
      },
      fontSize: {
        title: 'clamp(3rem, 23vw, 6rem)',
        titleSmall: 'clamp(2rem, 23vw, 2rem)',
        subTitle: 'clamp(16px, 6vw, 30px)',
      },
      fontFamily: {
        vt323: ['"VT323"', 'Courier New', ...defaultTheme.fontFamily.mono],
        sourceSerif4: ['"Source Serif 4"', ...defaultTheme.fontFamily.sans],
        code: ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
      height: {
        '10v': '10vh',
        '20v': '20vh',
        '30v': '30vh',
        '40v': '40vh',
        '50v': '50vh',
        '60v': '60vh',
        '70v': '70vh',
        '80v': '80vh',
        '90v': '90vh',
        '100v': '100vh',
      },
      keyframes: {
        gentleRotate: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12',
        13: '13',
        14: '14',
        15: '15',
      },
      listStyleType: {
        square: 'square',
      },
      maxWidth: {
        articleMaxWidth: '640px',
      },
      screens: {
        'min-h-home': { raw: '(min-height: 640px)' },
        xs: { raw: '(min-width: 360px)' },
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        title: '2px 2px 2px rgba(0,0,0,0.4)',
      },
      transitionProperty: {
        'bg-size-position': 'background-size, background-position',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    }),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.transition-bg': {
          transition:
            'background-size 320ms 100ms ease-out, background-position 320ms 100ms ease-out',
        },
      };
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;
