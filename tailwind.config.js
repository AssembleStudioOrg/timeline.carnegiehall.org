const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./**/*.tsx'],
  mode: 'jit',
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        white: 'var(--color-white)',
        black: {
          300: 'var(--color-black-light)',
          DEFAULT: 'var(--color-black)'
        },
        green: 'var(--color-green)',
        red: {
          DEFAULT: 'var(--color-red)',
          700: 'var(--color-red-700)'
        },
        blue: {
          300: 'var(--color-blue-300)',
          DEFAULT: 'var(--color-blue)'
        },
        purple: 'var(--color-purple)',
        grey: {
          50: 'var(--color-grey-50)',
          100: 'var(--color-grey-100)',
          300: 'var(--color-grey-300)',
          500: 'var(--color-grey-500)',
          700: 'var(--color-grey-700)',
          900: 'var(--color-grey-900)'
        }
      },
      fontFamily: {
        ui: ['Cadiz', 'sans-serif'],
        body: ['psfournier-std-petit', 'serif'],
        display: ['clarendon-text-pro', 'serif']
      },
      fontSize: {
        xxs: ['var(--font-size-xxs)', 'var(--line-height-xxs)'],
        xsm: ['var(--font-size-xsm)', 'var(--line-height-xsm)'],
        sm: ['var(--font-size-sm)', 'var(--line-height-sm)'],
        lg: ['var(--font-size-lg)', 'var(--line-height-lg)'],
        md: ['0.9rem', '1.3125rem'],
        '2lg': ['var(--font-size-2lg)', 'var(--line-height-2lg)'],
        xl: ['var(--font-size-xl)', 'var(--line-height-xl)'],
        '1xl': ['var(--font-size-1xl)', 'var(--line-height-1xl)'],
        '2xl': [
          'var(--font-size-2xl)',
          { letterSpacing: '-0.5px', lineHeight: 'var(--line-height-2xl)' }
        ],
        '3xl': ['1.8rem', '2.4rem'],
        '4xl': ['1.9rem', { letterSpacing: '-1px', lineHeight: '2.6rem' }],
        '6xl': ['3.825rem', '4.1825rem']
      },
      lineHeight: {
        5: '1.25rem',
        6: '1.15rem'
      },
      letterSpacing: {
        tracked: '1.5px',
        tight: '-0.02em'
      },
      maxWidth: {
        '4xl': '53rem'
      },
      spacing: {
        3: '10px',
        5: '24px',
        6: '26px',
        7: '30px',
        9: '38px',
        10: '42px',
        12: '49px',
        13: '54px',
        14: '60px',
        20: '80px'
      },
      boxShadow: {
        card: '2px 2px 12px var(--card-shadow-color)'
      },
      borderColor: {
        DEFAULT: 'currentColor'
      },
      screens: {
        '2sm': { max: '480px' },
        ...defaultTheme.screens
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      animation: {
        fadeIn: 'fadeIn 300ms ease-in forwards'
      }
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.scrollable': {
          'overflow-y': 'scroll',
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      });
    })
  ]
};
