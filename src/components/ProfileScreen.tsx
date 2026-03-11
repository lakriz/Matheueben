import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { THEMES, type ThemeId } from '../theme/ThemeContext';
import { dataClient } from '../lib/dataClient';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const THEME_ORDER: ThemeId[] = ['rainbow', 'cars', 'animals', 'fruits', 'space', 'lego'];

const EXERCISE_LABELS: Record<string, string> = {
  '1/addition':       '➕ Addition',
  '1/subtraction':    '➖ Subtraktion',
  '1/numbers':        '🔢 Zahlen',
  '1/comparison':     '⚖️ Vergleichen',
  '1/multiplication': '✖️ Malnehmen',
  '1/complement':     '🧩 Ergänzen',
  '1/doubling':       '🪞 Doppelt & Halb',
};

interface ResultRow {
  id: string;
  exerciseId: string;
  score: number;
  total: number;
  playedAt: string;
}

interface Props {
  readonly onHome: () => void;
}

export default function ProfileScreen({ onHome }: Props) {
  const { user, logout } = useAuth();
  const { theme, setThemeId } = useTheme();
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [savingTheme, setSavingTheme] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Load recent results – only when logged in
  useEffect(() => {
    if (!user) { setLoadingResults(false); return; }
    const load = async () => {
      try {
        const { data } = await dataClient.models.ExerciseResult.list({
          limit: 50,
        });
        const sorted = [...(data ?? [])].sort(
          (a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()
        );
        setResults(sorted as ResultRow[]);
      } catch (e) {
        console.error('Failed to load results', e);
      } finally {
        setLoadingResults(false);
      }
    };
    load();
  }, []);

  // Change theme + persist to UserProfile
  const handleThemeChange = async (id: ThemeId) => {
    setThemeId(id);
    setSavingTheme(true);
    try {
      // Upsert: list own profiles, update first or create
      const { data: profiles } = await dataClient.models.UserProfile.list({ limit: 1 });
      if (profiles && profiles.length > 0) {
        await dataClient.models.UserProfile.update({ id: profiles[0].id, themeId: id });
      } else {
        await dataClient.models.UserProfile.create({
          userId: user?.userId ?? '',
          themeId: id,
        });
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    } finally {
      setSavingTheme(false);
    }
  };

  // Group results by exercise for summary
  const summary: Record<string, { sessions: number; totalScore: number; totalItems: number }> = {};
  for (const r of results) {
    if (!summary[r.exerciseId]) summary[r.exerciseId] = { sessions: 0, totalScore: 0, totalItems: 0 };
    summary[r.exerciseId].sessions += 1;
    summary[r.exerciseId].totalScore += r.score;
    summary[r.exerciseId].totalItems += r.total;
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`tablet-screen flex flex-col h-full bg-gradient-to-b ${theme.sessionBg} overflow-y-auto`}>
      <div className="flex flex-col p-3 gap-4 max-w-3xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onHome}
            className="bg-white border-2 border-gray-200 hover:border-gray-300 active:scale-95 text-gray-600 font-black text-base px-4 py-2 rounded-full shadow transition-all uppercase"
          >
            ← ZURÜCK
          </button>
          <h1 className={`text-2xl md:text-3xl font-black uppercase ${theme.accentText}`}>
            👤 MEIN PROFIL
          </h1>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 font-black text-base px-4 py-2 rounded-full shadow transition-all uppercase"
            >
              ABMELDEN
            </button>
          ) : (
            <div className="w-24" /> // spacer
          )}
        </div>

        {/* ── GUEST: not logged in ── */}
        {!user && !showLogin && (
          <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center gap-4 text-center">
            <span className="text-5xl">🎒</span>
            <p className="text-xl font-black text-gray-700 uppercase">KEIN KONTO NÖTIG!</p>
            <p className="text-base text-gray-500">
              Du kannst alle Übungen ohne Anmeldung spielen.<br />
              Mit einem Konto werden deine Ergebnisse gespeichert und du kannst deinen Fortschritt verfolgen.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className={`${theme.accentBg} text-white font-black text-lg px-8 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all uppercase`}
            >
              🔑 ANMELDEN / REGISTRIEREN
            </button>
            <button
              onClick={onHome}
              className="text-gray-400 font-bold text-sm uppercase hover:text-gray-600 transition-all"
            >
              WEITER OHNE KONTO →
            </button>
          </div>
        )}

        {/* ── LOGIN MODAL (inline) ── */}
        {!user && showLogin && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex w-full justify-between items-center px-1">
              <p className={`text-lg font-black uppercase ${theme.accentText}`}>🔑 ANMELDEN</p>
              <button
                onClick={() => setShowLogin(false)}
                className="bg-white/80 hover:bg-white active:scale-95 text-gray-500 hover:text-gray-700 font-black text-xl w-9 h-9 rounded-full flex items-center justify-center shadow transition-all"
              >
                ✕
              </button>
            </div>
            <div className="w-full">
              <Authenticator signUpAttributes={['email']} />
            </div>
          </div>
        )}

        {/* ── LOGGED IN: user info ── */}
        {user && (
          <div className={`${theme.accentLight} ${theme.accentBorder} border-2 rounded-3xl p-4 flex items-center gap-3`}>
            <div className={`w-14 h-14 ${theme.accentBg} rounded-2xl flex items-center justify-center text-3xl shadow-md`}>
              🎒
            </div>
            <div>
              <p className="text-lg font-black text-gray-700 uppercase">Angemeldet als</p>
              <p className={`text-base font-bold ${theme.accentText}`}>{user.signInDetails?.loginId ?? user.userId}</p>
            </div>
          </div>
        )}

        {/* Theme selection – always visible */}
        <div className="bg-white rounded-3xl shadow-md p-4">
          <h2 className="text-xl font-black text-gray-700 uppercase mb-3">
            🎨 THEMA WÄHLEN
            {savingTheme && <span className="text-sm font-bold text-gray-400 ml-2">SPEICHERN...</span>}
          </h2>
          <div className="flex gap-2 flex-wrap justify-center">
            {THEME_ORDER.map((id) => {
              const t = THEMES[id];
              const isActive = theme.id === id;
              return (
                <button
                  key={id}
                  onClick={() => handleThemeChange(id)}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all min-w-16
                    ${isActive
                      ? `${t.accentBg} border-transparent text-white scale-105 shadow-lg`
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:scale-105'}
                  `}
                >
                  <span className="text-3xl leading-none">{t.emoji}</span>
                  <span className={`text-xs font-black uppercase ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {t.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
          {!user && (
            <p className="text-xs text-gray-400 text-center mt-2 font-bold">
              💡 ANMELDEN UM DAS THEMA ZU SPEICHERN
            </p>
          )}
        </div>

        {/* Stats + history – only when logged in */}
        {user && (
          <>
            {/* Stats summary */}
            <div className="bg-white rounded-3xl shadow-md p-4">
              <h2 className="text-xl font-black text-gray-700 uppercase mb-3">📊 MEINE STATISTIK</h2>
              {loadingResults ? (
                <p className="text-center text-gray-400 font-bold py-4">LADEN...</p>
              ) : Object.keys(summary).length === 0 ? (
                <p className="text-center text-gray-400 font-bold py-4">NOCH KEINE ERGEBNISSE 🌱</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {Object.entries(summary).map(([exId, s]) => {
                    const pct = s.totalItems > 0 ? Math.round((s.totalScore / s.totalItems) * 100) : 0;
                    const stars = pct >= 90 ? '⭐⭐⭐' : pct >= 60 ? '⭐⭐' : '⭐';
                    return (
                      <div key={exId} className={`${theme.accentLight} rounded-2xl px-4 py-3 flex items-center justify-between`}>
                        <div>
                          <p className="font-black text-gray-700">{EXERCISE_LABELS[exId] ?? exId}</p>
                          <p className="text-sm text-gray-500">{s.sessions}× gespielt</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-black ${theme.accentText}`}>{pct}%</p>
                          <p className="text-lg">{stars}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent sessions */}
            <div className="bg-white rounded-3xl shadow-md p-4 mb-4">
              <h2 className="text-xl font-black text-gray-700 uppercase mb-3">🕒 LETZTE ÜBUNGEN</h2>
              {loadingResults ? (
                <p className="text-center text-gray-400 font-bold py-4">LADEN...</p>
              ) : results.length === 0 ? (
                <p className="text-center text-gray-400 font-bold py-4">NOCH KEINE ÜBUNGEN 🌱</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {results.slice(0, 15).map((r) => {
                    const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                    const color = pct >= 90 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-500';
                    return (
                      <div key={r.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-700 text-sm">{EXERCISE_LABELS[r.exerciseId] ?? r.exerciseId}</p>
                          <p className="text-xs text-gray-400">{formatDate(r.playedAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-lg ${color}`}>{r.score}/{r.total}</p>
                          <p className="text-xs text-gray-400">{pct}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Guest: teaser for stats */}
        {!user && !showLogin && (
          <div className="bg-white/60 rounded-3xl p-4 mb-4 flex flex-col items-center gap-2 text-center border-2 border-dashed border-gray-300">
            <span className="text-3xl">📊</span>
            <p className="font-black text-gray-600 uppercase">STATISTIK & VERLAUF</p>
            <p className="text-sm text-gray-400">Melde dich an, um deinen Fortschritt zu speichern!</p>
          </div>
        )}

      </div>
    </div>
  );
}

