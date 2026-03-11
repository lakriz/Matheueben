import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import AdditionSession from './components/1/addition/ExerciseSession';
import SubtractionSession from './components/1/subtraction/ExerciseSession';
import NumbersSession from './components/1/numbers/ExerciseSession';
import ComparisonSession from './components/1/comparison/ExerciseSession';
import MultiplicationSession from './components/1/multiplication/ExerciseSession';
import ComplementSession from './components/1/complement/ExerciseSession';
import DoublingSession from './components/1/doubling/ExerciseSession';
import AdditionResult from './components/1/addition/ResultScreen';
import SubtractionResult from './components/1/subtraction/ResultScreen';
import NumbersResult from './components/1/numbers/ResultScreen';
import ComparisonResult from './components/1/comparison/ResultScreen';
import MultiplicationResult from './components/1/multiplication/ResultScreen';
import ComplementResult from './components/1/complement/ResultScreen';
import DoublingResult from './components/1/doubling/ResultScreen';

type AppScreen = 'home' | 'session' | 'result';

function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setScreen('session');
  };

  const handleSessionComplete = (finalScore: number, totalExercises: number) => {
    setScore(finalScore);
    setTotal(totalExercises);
    setScreen('result');
  };

  const handleRestart = () => { setSessionKey((k) => k + 1); setScreen('session'); };
  const handleHome = () => setScreen('home');

  const resultProps = { score, total, onRestart: handleRestart, onHome: handleHome };

  return (
    <div className="tablet-fit">
      {screen === 'home' && <HomeScreen onSelectExercise={handleSelectExercise} />}

      {screen === 'session' && selectedExercise === '1/addition' && (
        <AdditionSession key={sessionKey} onComplete={handleSessionComplete} />
      )}
      {screen === 'session' && selectedExercise === '1/subtraction' && (
        <SubtractionSession key={sessionKey} onComplete={handleSessionComplete} />
      )}
      {screen === 'session' && selectedExercise === '1/numbers' && (
        <NumbersSession key={sessionKey} onComplete={handleSessionComplete} />
      )}
      {screen === 'session' && selectedExercise === '1/comparison' && (
        <ComparisonSession key={sessionKey} onComplete={handleSessionComplete} />
      )}
      {screen === 'session' && selectedExercise === '1/multiplication' && (
        <MultiplicationSession key={sessionKey} onComplete={handleSessionComplete} />
      )}
      {screen === 'session' && selectedExercise === '1/complement' && (
        <ComplementSession key={sessionKey} onComplete={handleSessionComplete} />
      )}
      {screen === 'session' && selectedExercise === '1/doubling' && (
        <DoublingSession key={sessionKey} onComplete={handleSessionComplete} />
      )}

      {screen === 'result' && selectedExercise === '1/addition' && <AdditionResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/subtraction' && <SubtractionResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/numbers' && <NumbersResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/comparison' && <ComparisonResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/multiplication' && <MultiplicationResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/complement' && <ComplementResult {...resultProps} />}
      {screen === 'result' && selectedExercise === '1/doubling' && <DoublingResult {...resultProps} />}
    </div>
  );
}

export default App;
