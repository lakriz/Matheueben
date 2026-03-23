import { useEffect, useState } from 'react';
import { useAuth } from './auth/AuthContext';
import { useTheme } from './theme/ThemeContext';
import { type ThemeId } from './theme/ThemeContext';
import { dataClient } from './lib/dataClient';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
// Grade 1
import AdditionSession from './components/1/addition/ExerciseSession';
import SubtractionSession from './components/1/subtraction/ExerciseSession';
import NumbersSession from './components/1/numbers/ExerciseSession';
import ComparisonSession from './components/1/comparison/ExerciseSession';
import MultiplicationSession from './components/1/multiplication/ExerciseSession';
import ComplementSession from './components/1/complement/ExerciseSession';
import DoublingSession from './components/1/doubling/ExerciseSession';
import NumberRange20Session from './components/1/numberrange20/ExerciseSession';
import PlusMinusSession from './components/1/plusminus/ExerciseSession';
import WordProblemsSession from './components/1/wordproblems/ExerciseSession';
import AdditionResult from './components/1/addition/ResultScreen';
import SubtractionResult from './components/1/subtraction/ResultScreen';
import NumbersResult from './components/1/numbers/ResultScreen';
import ComparisonResult from './components/1/comparison/ResultScreen';
import MultiplicationResult from './components/1/multiplication/ResultScreen';
import ComplementResult from './components/1/complement/ResultScreen';
import DoublingResult from './components/1/doubling/ResultScreen';
import NumberRange20Result from './components/1/numberrange20/ResultScreen';
import PlusMinusResult from './components/1/plusminus/ResultScreen';
import WordProblemsResult from './components/1/wordproblems/ResultScreen';
// Grade 2
import Addition100Session from './components/2/addition100/ExerciseSession';
import Subtraction100Session from './components/2/subtraction100/ExerciseSession';
import EinmaleinsSession from './components/2/einmaleins/ExerciseSession';
import Division2Session from './components/2/division/ExerciseSession';
import NumberRange100Session from './components/2/numberrange100/ExerciseSession';
import WordProblems2Session from './components/2/wordproblems/ExerciseSession';
import Addition100Result from './components/2/addition100/ResultScreen';
import Subtraction100Result from './components/2/subtraction100/ResultScreen';
import EinmaleinsResult from './components/2/einmaleins/ResultScreen';
import Division2Result from './components/2/division/ResultScreen';
import NumberRange100Result from './components/2/numberrange100/ResultScreen';
import WordProblems2Result from './components/2/wordproblems/ResultScreen';
// Grade 3
import Addition1000Session from './components/3/addition1000/ExerciseSession';
import Subtraction1000Session from './components/3/subtraction1000/ExerciseSession';
import Multiplication3Session from './components/3/multiplication/ExerciseSession';
import Division3Session from './components/3/division/ExerciseSession';
import NumberRange1000Session from './components/3/numberrange1000/ExerciseSession';
import WordProblems3Session from './components/3/wordproblems/ExerciseSession';
import Addition1000Result from './components/3/addition1000/ResultScreen';
import Subtraction1000Result from './components/3/subtraction1000/ResultScreen';
import Multiplication3Result from './components/3/multiplication/ResultScreen';
import Division3Result from './components/3/division/ResultScreen';
import NumberRange1000Result from './components/3/numberrange1000/ResultScreen';
import WordProblems3Result from './components/3/wordproblems/ResultScreen';

type AppScreen = 'home' | 'session' | 'result' | 'profile';

function App() {
  const { user, loading } = useAuth();
  const { setThemeId } = useTheme();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);

  // Load saved theme from UserProfile on login
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const { data: profiles } = await dataClient.models.UserProfile.list({ limit: 1 });
        if (profiles && profiles.length > 0 && profiles[0].themeId) {
          setThemeId(profiles[0].themeId as ThemeId);
        }
      } catch (e) {
        console.error('Could not load user profile', e);
      }
    };
    load();
  }, [user, setThemeId]);

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setScreen('session');
  };

  const handleSessionComplete = async (finalScore: number, totalExercises: number) => {
    setScore(finalScore);
    setTotal(totalExercises);
    setScreen('result');
    // Persist result
    if (user && selectedExercise) {
      try {
        await dataClient.models.ExerciseResult.create({
          userId: user.userId,
          exerciseId: selectedExercise,
          score: finalScore,
          total: totalExercises,
          playedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error('Could not save result', e);
      }
    }
  };

  const handleRestart = () => { setSessionKey((k) => k + 1); setScreen('session'); };
  const handleHome = () => setScreen('home');
  const handleProfile = () => setScreen('profile');

  const resultProps = { score, total, onRestart: handleRestart, onHome: handleHome };

  // Show loading spinner briefly while checking auth state
  if (loading) {
    return (
      <div className="tablet-fit flex items-center justify-center bg-gradient-to-b from-purple-200 to-yellow-100">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl animate-bounce">🌈</span>
          <p className="text-2xl font-black text-purple-700 uppercase">LADEN...</p>
        </div>
      </div>
    );
  }

  // Always show app – login is optional via profile screen
  return (
    <div className="tablet-fit">
      {screen === 'home' && <HomeScreen onSelectExercise={handleSelectExercise} onProfile={handleProfile} />}
      {screen === 'profile' && <ProfileScreen onHome={handleHome} />}

      {screen === 'session' && selectedExercise === '1/addition' && <AdditionSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/subtraction' && <SubtractionSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/numbers' && <NumbersSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/comparison' && <ComparisonSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/multiplication' && <MultiplicationSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/complement' && <ComplementSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/doubling' && <DoublingSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/numberrange20' && <NumberRange20Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/plusminus' && <PlusMinusSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '1/wordproblems' && <WordProblemsSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}

      {screen === 'session' && selectedExercise === '2/addition100' && <Addition100Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '2/subtraction100' && <Subtraction100Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '2/einmaleins' && <EinmaleinsSession key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '2/division' && <Division2Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '2/numberrange100' && <NumberRange100Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '2/wordproblems' && <WordProblems2Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}

      {screen === 'session' && selectedExercise === '3/addition1000' && <Addition1000Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '3/subtraction1000' && <Subtraction1000Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '3/multiplication' && <Multiplication3Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '3/division' && <Division3Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '3/numberrange1000' && <NumberRange1000Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}
      {screen === 'session' && selectedExercise === '3/wordproblems' && <WordProblems3Session key={sessionKey} onComplete={handleSessionComplete} onCancel={handleHome} />}

      {screen === 'result' && selectedExercise === '1/addition' && <AdditionResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/subtraction' && <SubtractionResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/numbers' && <NumbersResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/comparison' && <ComparisonResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/multiplication' && <MultiplicationResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/complement' && <ComplementResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/doubling' && <DoublingResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/numberrange20' && <NumberRange20Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/plusminus' && <PlusMinusResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/wordproblems' && <WordProblemsResult {...resultProps} />}

      {screen === 'result' && selectedExercise === '2/addition100' && <Addition100Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '2/subtraction100' && <Subtraction100Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '2/einmaleins' && <EinmaleinsResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '2/division' && <Division2Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '2/numberrange100' && <NumberRange100Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '2/wordproblems' && <WordProblems2Result {...resultProps} />}

      {screen === 'result' && selectedExercise === '3/addition1000' && <Addition1000Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '3/subtraction1000' && <Subtraction1000Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '3/multiplication' && <Multiplication3Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '3/division' && <Division3Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '3/numberrange1000' && <NumberRange1000Result {...resultProps} />}
      {screen === 'result' && selectedExercise === '3/wordproblems' && <WordProblems3Result {...resultProps} />}
    </div>
  );
}

export default App;
