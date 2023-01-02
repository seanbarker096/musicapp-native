import React, { FC, useState } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { AuthState } from 'store/auth/auth.types';

interface AppContexts {
  children: React.ReactNode;
}

const AppContexts: FC<AppContexts> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState | undefined>(undefined);

  return (
    <AuthStateContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export default AppContexts;
