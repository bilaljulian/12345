// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{html,ts,tsx,jsx}', // Adjust according to your project structure
    './public/index.html', // Add any other paths to your HTML files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2', // Example primary color
        secondary: '#50E3C2', // Example secondary color
        accent: '#D0021B', // Example accent color
        background: '#F5F5F5', // Example background color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'custom-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      screens: {
        'xxl': '1400px',
      },
    },
  },
  plugins: [
    // Add any plugins if needed
  ],
  corePlugins: {
    preflight: true,
  },
}

export default config
npm @tailwind base;
@tailwind components;
@tailwind utilities;
install tailwindcss
"scripts": {
  "build:css": "tailwindcss -o ./dist/output.css"
}
npm run build:css
