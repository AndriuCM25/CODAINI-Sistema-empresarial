import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'codaini-theme';
const DEFAULT_THEME: Theme = 'dark';

// ─── Contexto ─────────────────────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ─── Aplicar tema al documento ────────────────────────────────────────────────
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

// ─── Obtener tema inicial ─────────────────────────────────────────────────────
function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch {
    // localStorage no disponible (SSR / privado)
  }
  return DEFAULT_THEME;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = getInitialTheme();
    // Aplicar inmediatamente para evitar flash de tema incorrecto
    applyTheme(initial);
    return initial;
  });

  const isDark = theme === 'dark';

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // ignorar error de localStorage
    }
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Sincronizar si el sistema operativo cambia preferencia (futuro)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return ctx;
};

export default ThemeContext;
