/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Paleta CODAINI Dark ──────────────────────────────────
        codaini: {
          navy:         '#0A192F', // Fondo principal / Sidebar dark
          'navy-light': '#112240', // Cards / Paneles / Modales dark
          'navy-lighter':'#172A46',// Inputs / Hover dark
          cyan:         '#64FFDA', // Acento principal dark
          'cyan-dim':   '#52D4BA', // Acento hover dark
          text:         '#CCD6F6', // Texto principal dark
          muted:        '#8892B0', // Texto secundario dark
          highlight:    '#E6F1FF', // Texto destacado dark
          border:       '#233554', // Bordes dark
        },
        // ── Paleta CODAINI Light ─────────────────────────────────
        light: {
          bg:           '#F5F7FA', // Fondo principal light
          surface:      '#FFFFFF', // Cards / Modales light
          'surface-2':  '#EAF0F6', // Inputs / Hover light
          accent:       '#0F766E', // Acento principal light
          'accent-2':   '#14B8A6', // Acento secundario light
          text:         '#0A192F', // Texto principal light
          muted:        '#475569', // Texto secundario light
          border:       '#CBD5E1', // Bordes light
        },
        // ── Estados del sistema (consistentes en ambos temas) ────
        status: {
          success:      '#22C55E',
          warning:      '#F59E0B',
          danger:       '#EF4444',
          info:         '#3B82F6',
          progress:     '#64FFDA',
        },
        // ── Alias legacy (compatibilidad con código existente) ───
        primary: {
          DEFAULT:      '#64FFDA',
          dark:         '#0A192F',
          light:        '#CCD6F6',
          gray:         '#8892B0',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'codaini':    '0 4px 24px 0 rgba(100,255,218,0.10)',
        'codaini-lg': '0 8px 40px 0 rgba(100,255,218,0.18)',
      },
      transitionProperty: {
        'theme': 'color, background-color, border-color, fill, stroke',
      },
    },
  },
  plugins: [],
}
