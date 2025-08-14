import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  email: string;
  language: string;
  progress: number;
  lessonsCompleted: number;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (profile: UserProfile) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) setUserState(JSON.parse(saved));
      setIsLoading(false);
    })();
  }, []);

  const setUser = async (profile: UserProfile) => {
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    setUserState(profile);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};