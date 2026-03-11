import { createContext, useContext, useMemo, useState } from 'react';

// ---------------------------------------------------------------------------
// Theme definition
// ---------------------------------------------------------------------------
export type ThemeId = 'rainbow' | 'cars' | 'animals' | 'fruits' | 'space' | 'lego';

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  // Emojis used as counting objects / visual items
  items: string[];
  itemLabels: string[];
  // Background gradient for session screens
  sessionBg: string;
  // Background gradient for home screen
  homeBg: string;
  // Accent colours (Tailwind classes)
  accentBg: string;        // e.g. 'bg-purple-400'
  accentText: string;      // e.g. 'text-purple-700'
  accentLight: string;     // e.g. 'bg-purple-100'
  accentBorder: string;    // e.g. 'border-purple-300'
  buttonIdle: string;      // answer button idle classes
  // Decorative emojis shown at bottom of home/result
  decorations: string[];
}

export const THEMES: Record<ThemeId, Theme> = {
  rainbow: {
    id: 'rainbow',
    name: 'REGENBOGEN',
    emoji: '🌈',
    items: ['🌈', '⭐', '✨', '🌟', '💫', '🎀', '🎉', '🎊'],
    itemLabels: ['Regenbögen', 'Sterne', 'Funken', 'Leuchtsterne', 'Kometen', 'Schleifen', 'Konfetti', 'Feuerwerk'],
    sessionBg: 'from-purple-100 via-pink-50 to-yellow-100',
    homeBg: 'from-yellow-200 via-pink-100 to-blue-200',
    accentBg: 'bg-purple-400',
    accentText: 'text-purple-700',
    accentLight: 'bg-purple-100',
    accentBorder: 'border-purple-300',
    buttonIdle: 'bg-purple-200 hover:bg-purple-300 text-purple-900',
    decorations: ['🌈', '⭐', '✨', '🌟', '🌈'],
  },
  cars: {
    id: 'cars',
    name: 'AUTOS & ZÜGE',
    emoji: '🚗',
    items: ['🚗', '🚕', '🚙', '🚌', '🚎', '🚂', '🚃', '🚄'],
    itemLabels: ['Autos', 'Taxis', 'Wagen', 'Busse', 'Oberleitungsbusse', 'Loks', 'Waggons', 'Schnellzüge'],
    sessionBg: 'from-blue-100 via-sky-50 to-cyan-100',
    homeBg: 'from-sky-200 via-blue-100 to-cyan-200',
    accentBg: 'bg-blue-500',
    accentText: 'text-blue-700',
    accentLight: 'bg-blue-100',
    accentBorder: 'border-blue-300',
    buttonIdle: 'bg-blue-200 hover:bg-blue-300 text-blue-900',
    decorations: ['🚗', '🚂', '🚕', '🚄', '🚙'],
  },
  animals: {
    id: 'animals',
    name: 'TIERE',
    emoji: '🐶',
    items: ['🐶', '🐱', '🐰', '🦊', '🐼', '🐨', '🐸', '🦁'],
    itemLabels: ['Hunde', 'Katzen', 'Hasen', 'Füchse', 'Pandas', 'Koalas', 'Frösche', 'Löwen'],
    sessionBg: 'from-green-100 via-emerald-50 to-lime-100',
    homeBg: 'from-green-200 via-lime-100 to-emerald-200',
    accentBg: 'bg-green-500',
    accentText: 'text-green-700',
    accentLight: 'bg-green-100',
    accentBorder: 'border-green-300',
    buttonIdle: 'bg-green-200 hover:bg-green-300 text-green-900',
    decorations: ['🐶', '🐱', '🐰', '🦊', '🐼'],
  },
  fruits: {
    id: 'fruits',
    name: 'OBST & GEMÜSE',
    emoji: '🍎',
    items: ['🍎', '🍊', '🍋', '🍇', '🍓', '🥕', '🥦', '🌽'],
    itemLabels: ['Äpfel', 'Orangen', 'Zitronen', 'Trauben', 'Erdbeeren', 'Karotten', 'Brokkoli', 'Maiskolben'],
    sessionBg: 'from-orange-100 via-yellow-50 to-green-100',
    homeBg: 'from-yellow-200 via-orange-100 to-green-200',
    accentBg: 'bg-orange-400',
    accentText: 'text-orange-700',
    accentLight: 'bg-orange-100',
    accentBorder: 'border-orange-300',
    buttonIdle: 'bg-orange-200 hover:bg-orange-300 text-orange-900',
    decorations: ['🍎', '🍊', '🍋', '🍓', '🥕'],
  },
  space: {
    id: 'space',
    name: 'WELTALL',
    emoji: '🚀',
    items: ['🚀', '🛸', '⭐', '🌙', '🪐', '🌍', '☄️', '👾'],
    itemLabels: ['Raketen', 'UFOs', 'Sterne', 'Monde', 'Planeten', 'Erden', 'Kometen', 'Aliens'],
    sessionBg: 'from-indigo-100 via-purple-50 to-blue-100',
    homeBg: 'from-indigo-200 via-purple-100 to-blue-200',
    accentBg: 'bg-indigo-500',
    accentText: 'text-indigo-700',
    accentLight: 'bg-indigo-100',
    accentBorder: 'border-indigo-300',
    buttonIdle: 'bg-indigo-200 hover:bg-indigo-300 text-indigo-900',
    decorations: ['🚀', '⭐', '🪐', '🌙', '🛸'],
  },
  lego: {
    id: 'lego',
    name: 'LEGO',
    emoji: '🧱',
    items: ['🟥', '🟦', '🟨', '🟩', '🟧', '🟪', '⬜', '🔴'],
    itemLabels: ['Rote Steine', 'Blaue Steine', 'Gelbe Steine', 'Grüne Steine', 'Orange Steine', 'Lila Steine', 'Weiße Steine', 'Runde Noppen'],
    sessionBg: 'from-red-100 via-yellow-50 to-blue-100',
    homeBg: 'from-red-200 via-yellow-100 to-blue-200',
    accentBg: 'bg-red-500',
    accentText: 'text-red-700',
    accentLight: 'bg-red-100',
    accentBorder: 'border-red-400',
    buttonIdle: 'bg-red-200 hover:bg-red-300 active:scale-95 text-red-900',
    decorations: ['🧱', '🟥', '🟦', '🟨', '🧱'],
  },
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface ThemeContextValue {
  theme: Theme;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES.rainbow,
  setThemeId: () => undefined,
});

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('rainbow');
  const value = useMemo(() => ({ theme: THEMES[themeId], setThemeId }), [themeId]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

