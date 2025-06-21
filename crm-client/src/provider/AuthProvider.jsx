import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
} from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import auth from '../component/firebase.init';
import { apiClient } from '../config/api';

export const Context = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkmode, setdarkmode] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const provider = new GoogleAuthProvider();
  

  // Auth functions
  const googleSign = () => signInWithPopup(auth, provider);
  const createRegistered = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const loginSetup = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signOuts = () => signOut(auth);
  const updateUserProfile = (user, updates) => updateProfile(user, updates);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Load Firebase auth state + Google redirect result
  useEffect(() => {
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Auth Init Error:', error);
      }

      // Always attach onAuthStateChanged
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log('onAuthStateChanged:', currentUser);
        setUser(currentUser);
        setLoading(false);

        // If user is logged in, ensure profile exists in backend
        if (currentUser) {
          const { displayName, email, photoURL } = currentUser;
          try {
            // Check if user exists in backend
            await apiClient.post('/users', {
              name: displayName || email,
              email,
              user_photo: photoURL,
              role: 'executives',
            });
          } catch (err) {
            // If user already exists, backend should handle it gracefully
            console.warn('User might already exist');
          }
        }
      });

      return () => unsubscribe();
    };

    initAuth();
  }, []);

  // Set JWT only once when user is set
  useEffect(() => {
    if (user) {
      apiClient.post('/jwt', user)
        .then(() => console.log('JWT token set successfully'))
        .catch(err => console.log('JWT Error:', err));
    }
  }, [user]);

  // Dark mode handler
  const handleMode = () => setdarkmode(!darkmode);

  // Final context
  const authInfo = {
    createRegistered,
    loginSetup,
    signOuts,
    googleSign,
    updateUserProfile,
    user,
    loading,
    theme,
    toggleTheme,
    handleMode,
    darkmode
  };

  return (
    <Context.Provider value={authInfo}>
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;
