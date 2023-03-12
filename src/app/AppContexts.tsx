import { ProfileContext, ProfileState } from 'contexts/profile.context';
import React, { FC, useState } from 'react';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { AuthState } from 'store/auth/auth.types';

interface AppContexts {
  children: React.ReactNode;
}

const AppContexts: FC<AppContexts> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState | undefined>(undefined);
  const [profileState, setProfileState] = useState<ProfileState | undefined>(
    undefined,
  );

  return (
    <AuthStateContext.Provider value={{ authState, setAuthState }}>
      <ProfileContext.Provider value={{ profileState, setProfileState }}>
        {children}
      </ProfileContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default AppContexts;
