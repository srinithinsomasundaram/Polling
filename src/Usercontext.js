// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({ user: null, loginUser: () => {} });


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginUser = (userId) => {
    setUser({ userId });
  };

  return (
    <UserContext.Provider value={{ user, loginUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
