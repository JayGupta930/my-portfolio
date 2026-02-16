import { createContext, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth);
      console.log('Anonymous sign-in successful');
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, handleAnonymousSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
