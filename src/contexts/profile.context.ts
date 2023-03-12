import { createContext } from 'react';

export enum ProfileType {
  ARTIST = 'artist',
  USER = 'user',
}

export type ProfileState = {
  profileId: number;
  profileType: ProfileType;
};

export interface ProfileContext {
  profileState: ProfileState;
}

export const ProfileContext = createContext<ProfileContext>(
  /**
   * We need a default value but this will always be defined, as we initialise it inside logged in * components only
   */
  undefined as unknown as ProfileContext,
);
