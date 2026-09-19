/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ECEDEE",
        "surface-light": "#F4F5F5",
        "surface-dark": "#171719",
        "surface-card": "#FFFFFF",
        "brand-primary": "#E34A32",
        "brand-accent": "#F05A3C",
        "text-primary": "#232427",
        "text-secondary": "#55575c",
        "text-muted": "#8a8c91",
        "border-light": "rgba(0,0,0,0.06)",
        "border-white": "rgba(255,255,255,0.7)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
      },
      borderRadius: {
        'sm': '12px',
        'md': '16px',
        'lg': '28px',
        'xl': '40px',
        'full': '999px',
      },
      boxShadow: {
        'elevated': '0 14px 30px -18px rgba(35,36,39,0.25)',
        'elevated-lg': '0 24px 48px -18px rgba(35,36,39,0.3)',
        'inner-bevel': 'inset 0 1px 0 rgba(255,255,255,0.35)',
        'dark-bevel': 'inset 0 1px 0 rgba(255,255,255,0.2)',
      }
    },
  },
  plugins: [],
}
