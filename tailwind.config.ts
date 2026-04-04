import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF5',
        primary: '#2D4A3E',
        accent: '#C4704B',
        healthy: '#5B7C6B',
        stress: '#D4915E',
        critical: '#B85C3E',
        text: '#2C2C28',
        grid: '#E5E2D8',
        paper: '#F5F3EC',
        sand: '#D9D3C4',
        ndvi: {
          peak: '#3B6D11',
          healthy: '#5B7C6B',
          moderate: '#D4915E',
          high: '#C4704B',
          severe: '#B85C3E',
        },
        tool: {
          weather: '#4A7AB5',
          crop: '#D4915E',
          soil: '#8B8B82',
          decision: '#5B7C6B',
        },
      },
      fontFamily: {
        display: ['var(--font-national-park)', 'var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
        editorial: ['var(--font-instrument-serif)', 'serif'],
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      borderRadius: {
        card: '4px',
      },
    },
  },
  plugins: [],
};
export default config;
