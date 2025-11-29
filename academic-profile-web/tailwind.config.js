/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0E1C36',
        'primary-dark': '#0A1325',
        secondary: '#5BC0F8',
        accent: '#F2A541',
        muted: '#8C98A9',
        surface: '#F4F7FB',
        border: '#E0E6F0'
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 20px 45px rgba(4, 25, 55, 0.12)'
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem'
      }
    },
  },
  plugins: [],
}

