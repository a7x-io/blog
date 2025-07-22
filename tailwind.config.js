/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ray-bg': '#0a0a0a',
        'ray-surface': '#18181b',
        'ray-card': '#232326',
        'ray-accent': '#ff2d55',
        'ray-accent-dark': '#b3123c',
        'ray-muted': '#2a2a2e',
        'ray-text': '#ededed',
        'ray-text-muted': '#b3b3b3',
      },
      backgroundImage: {
        'ray-dark': 'linear-gradient(135deg, #18181b 0%, #232326 100%)',
      },
      boxShadow: {
        'ray': '0 4px 32px 0 rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
}

