import { createContext, Dispatch, SetStateAction } from 'react';

export enum ProfileType {
  ARTIST = 'artist',
  USER = 'user',
}

export type ProfileState =
  | {
      profileId: number;
      profileType: ProfileType;
    }
  | undefined;

export interface ProfileContext {
  profileState: ProfileState;
  setProfileState: Dispatch<SetStateAction<ProfileState | undefined>>;
}

export const ProfileContext = createContext<ProfileContext | undefined>(
  undefined,
);
