/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        term: {
          bg: 'var(--term-bg)',
          titlebar: 'var(--term-titlebar)',
          border: 'var(--term-border)',
          text: 'var(--term-text)',
          muted: 'var(--term-muted)',
          prompt: 'var(--term-prompt)',
          accent: 'var(--term-accent)',
          success: 'var(--term-success)',
          link: 'var(--term-link)',
        },
      },
    },
  },
  plugins: [],
};
