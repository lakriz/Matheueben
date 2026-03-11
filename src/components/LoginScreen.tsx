import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export default function LoginScreen() {
  return (
    <div className="tablet-screen flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-200 via-pink-100 to-yellow-200 p-4">
      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-6xl mb-2">🌈</span>
        <h1 className="text-4xl md:text-5xl font-black text-purple-700 uppercase drop-shadow-md text-center">
          MATHE ÜBEN!
        </h1>
        <p className="text-lg md:text-xl font-black text-blue-600 uppercase mt-1">
          ANMELDEN UND LOSLEGEN! 🚀
        </p>
      </div>

      {/* Amplify Authenticator */}
      <div className="w-full max-w-sm">
        <Authenticator
          signUpAttributes={['email']}
          components={{
            Header() {
              return (
                <div className="text-center py-4">
                  <span className="text-4xl">🎒</span>
                  <p className="text-xl font-black text-purple-700 uppercase mt-1">
                    WILLKOMMEN!
                  </p>
                </div>
              );
            },
          }}
        />
      </div>
    </div>
  );
}

