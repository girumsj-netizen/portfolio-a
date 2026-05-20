module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
    './public/**/*.html'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px'
      }
    },
    extend: {
      colors: {
        brand: {
          50: 'hsl(150, 20%, 98%)',
          100: 'hsl(150, 18%, 95%)',
          200: 'hsl(150, 16%, 88%)',
          300: 'hsl(150, 14%, 76%)',
          400: 'hsl(150, 14%, 60%)',
          500: 'hsl(150, 20%, 45%)',
          600: 'hsl(150, 22%, 36%)',
          700: 'hsl(150, 24%, 28%)',
          800: 'hsl(150, 28%, 20%)',
          900: 'hsl(150, 32%, 12%)'
        },
        accent: {
          DEFAULT: '#00b37e',
          500: '#00b37e',
          600: '#00a76f'
        },
        surface: {
          DEFAULT: 'var(--surface-background)',
          muted: 'var(--surface-muted)',
          emphasis: 'var(--surface-emphasis)',
          border: 'var(--surface-border)'
        },
        neutral: {
          50: 'hsl(210, 12%, 98%)',
          100: 'hsl(214, 20%, 94%)',
          200: 'hsl(213, 14%, 86%)',
          300: 'hsl(212, 12%, 74%)',
          400: 'hsl(213, 12%, 61%)',
          500: 'hsl(214, 13%, 47%)',
          600: 'hsl(215, 14%, 37%)',
          700: 'hsl(216, 15%, 28%)',
          800: 'hsl(216, 19%, 20%)',
          900: 'hsl(218, 24%, 12%)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 60px rgba(0, 0, 0, 0.45)',
        glow: '0 8px 48px rgba(0, 179, 126, 0.18)'
      },
      borderRadius: {
        xl: '1rem'
      },
      transitionTimingFunction: {
        'in-out-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      maxWidth: {
        '8xl': '88rem'
      },
      aspectRatio: {
        'hero-image': '16 / 10',
        'content-panel': '4 / 3'
      }
    }
  },
  plugins: []
};
