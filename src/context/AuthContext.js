// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseContext } from './firebase';
import { useContext } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const app = useContext(FirebaseContext);
  const auth = getAuth(app);
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
