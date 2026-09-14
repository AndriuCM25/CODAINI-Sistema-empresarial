/**
 * Clases de tema centralizadas para CODAINI.
 * Evita duplicar clases Tailwind dark:/light: en cada componente.
 *
 * Uso: <div className={tc.card}>...</div>
 */

export const tc = {
  // ── Fondos ────────────────────────────────────────────────────────────────
  /** Fondo de página principal */
  pageBg: 'bg-light-bg dark:bg-codaini-navy',

  /** Card / Panel principal */
  card: 'bg-light-surface dark:bg-codaini-navy-light border border-light-border dark:border-codaini-border rounded-xl',

  /** Card con sombra */
  cardShadow: 'bg-light-surface dark:bg-codaini-navy-light border border-light-border dark:border-codaini-border rounded-xl shadow-sm dark:shadow-none',

  /** Fondo terciario (inputs, hover) */
  surface2: 'bg-light-surface-2 dark:bg-codaini-navy-lighter',

  // ── Textos ────────────────────────────────────────────────────────────────
  /** Texto principal */
  textPrimary: 'text-light-text dark:text-codaini-text',

  /** Texto secundario / muted */
  textMuted: 'text-light-muted dark:text-codaini-muted',

  /** Texto de acento */
  textAccent: 'text-light-accent dark:text-codaini-cyan',

  /** Títulos / destacados */
  textHeading: 'text-light-text dark:text-codaini-highlight',

  // ── Bordes ────────────────────────────────────────────────────────────────
  border: 'border-light-border dark:border-codaini-border',
  divider: 'divide-light-border dark:divide-codaini-border',

  // ── Inputs / Formularios ─────────────────────────────────────────────────
  input: [
    'block w-full rounded-lg px-3 py-3 text-sm',
    'bg-light-surface dark:bg-codaini-navy-lighter',
    'border border-light-border dark:border-codaini-border',
    'text-light-text dark:text-codaini-text',
    'placeholder-light-muted dark:placeholder-codaini-muted',
    'focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-codaini-cyan focus:border-transparent',
    'transition-colors duration-200',
  ].join(' '),

  inputLabel: 'block text-sm font-medium mb-1.5 text-light-muted dark:text-codaini-muted',

  // ── Hover states ──────────────────────────────────────────────────────────
  hoverSurface: 'hover:bg-light-surface-2 dark:hover:bg-codaini-navy-lighter',
  hoverCard:    'hover:bg-light-surface-2 dark:hover:bg-codaini-navy-lighter',

  // ── Tabla ─────────────────────────────────────────────────────────────────
  tableHead:    'bg-light-surface-2 dark:bg-codaini-navy text-light-muted dark:text-codaini-muted text-xs font-semibold uppercase tracking-wider',
  tableRow:     'border-b border-light-border dark:border-codaini-border hover:bg-light-surface-2 dark:hover:bg-codaini-navy-lighter transition-colors',
  tableCell:    'px-4 py-3 text-sm text-light-text dark:text-codaini-text',
  tableCellMuted: 'px-4 py-3 text-sm text-light-muted dark:text-codaini-muted',

  // ── Navbar ────────────────────────────────────────────────────────────────
  navbar:       'bg-light-surface dark:bg-codaini-navy border-b border-light-border dark:border-codaini-border',
  navIconBtn:   'p-2 rounded-lg text-light-muted dark:text-codaini-muted hover:bg-light-surface-2 dark:hover:bg-codaini-navy-lighter hover:text-light-accent dark:hover:text-codaini-cyan transition-colors',

  // ── Sidebar ───────────────────────────────────────────────────────────────
  sidebarBg:    'bg-light-surface dark:bg-codaini-navy',
  sidebarItem:  'text-light-muted dark:text-codaini-muted hover:bg-light-surface-2 dark:hover:bg-codaini-navy-lighter hover:text-light-accent dark:hover:text-codaini-cyan',
  sidebarActive:'bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy font-semibold',

  // ── Dropdown ──────────────────────────────────────────────────────────────
  dropdown:     'bg-light-surface dark:bg-codaini-navy-light border border-light-border dark:border-codaini-border rounded-xl shadow-xl dark:shadow-codaini',
  dropdownItem: 'px-4 py-2.5 text-sm text-light-text dark:text-codaini-text hover:bg-light-surface-2 dark:hover:bg-codaini-navy-lighter transition-colors',

  // ── Modal ─────────────────────────────────────────────────────────────────
  modal:        'bg-light-surface dark:bg-codaini-navy-light border border-light-border dark:border-codaini-border rounded-2xl shadow-2xl',
  modalHeader:  'border-b border-light-border dark:border-codaini-border',

  // ── Badge semántico ───────────────────────────────────────────────────────
  badgeSuccess: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700/50',
  badgeWarning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/50',
  badgeDanger:  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700/50',
  badgeInfo:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700/50',
  badgeDefault: 'bg-gray-100 dark:bg-codaini-border/50 text-gray-700 dark:text-codaini-muted border-gray-200 dark:border-codaini-border',
};

/** Colores para gráficos Recharts según el tema */
export function getChartColors(isDark: boolean) {
  return {
    axis: isDark ? '#8892B0' : '#64748B',
    grid: isDark ? '#233554' : '#E2E8F0',
    tooltip: {
      bg: isDark ? '#112240' : '#FFFFFF',
      border: isDark ? '#233554' : '#CBD5E1',
      text: isDark ? '#CCD6F6' : '#0A192F',
    },
    primary: isDark ? '#64FFDA' : '#0F766E',
    secondary: isDark ? '#CCD6F6' : '#0A192F',
    palette: isDark
      ? ['#64FFDA', '#8892B0', '#3B82F6', '#F59E0B', '#EF4444', '#22C55E']
      : ['#0F766E', '#475569', '#2563EB', '#D97706', '#DC2626', '#16A34A'],
  };
}
