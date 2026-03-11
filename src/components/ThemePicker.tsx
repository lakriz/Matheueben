import { THEMES, type ThemeId, useTheme } from '../theme/ThemeContext';

const THEME_ORDER: ThemeId[] = ['rainbow', 'cars', 'animals', 'fruits', 'space', 'lego'];

export default function ThemePicker() {
  const { theme, setThemeId } = useTheme();

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <p className="text-sm md:text-base font-black text-gray-500 uppercase tracking-wide">
        🎨 THEMA WÄHLEN
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        {THEME_ORDER.map((id) => {
          const t = THEMES[id];
          const isActive = theme.id === id;
          return (
            <button
              key={id}
              onClick={() => setThemeId(id)}
              title={t.name}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-2 transition-all
                text-center min-w-16 md:min-w-19
                ${isActive
                  ? `${t.accentBg} ${t.accentBorder} text-white scale-105 shadow-lg border-transparent`
                  : `bg-white border-gray-200 hover:border-gray-300 hover:scale-105 text-gray-600`}
              `}
            >
              <span className="text-2xl md:text-3xl leading-none">{t.emoji}</span>
              <span className={`text-xs font-black uppercase leading-tight ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {t.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

