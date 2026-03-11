import { useState } from 'react';
import StartScreen from './components/StartScreen';
import ExerciseSession from './components/ExerciseSession';
import ResultScreen from './components/ResultScreen';

type AppScreen = 'start' | 'session' | 'result';

function App() {
  const [screen, setScreen] = useState<AppScreen>('start');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const handleSessionComplete = (finalScore: number, totalExercises: number) => {
    setScore(finalScore);
    setTotal(totalExercises);
    setScreen('result');
  };

  return (
    <div className="min-h-screen">
      {screen === 'start' && <StartScreen onStart={() => setScreen('session')} />}
      {screen === 'session' && <ExerciseSession onComplete={handleSessionComplete} />}
      {screen === 'result' && (
        <ResultScreen score={score} total={total} onRestart={() => setScreen('start')} />
      )}
    </div>
  );
}

export default App;
