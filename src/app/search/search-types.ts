import { ProfileType } from 'contexts/profile.context';

export type InternalSearchStackScreenParamList = {
  Search: undefined;
  SearchProfile: { profileType: ProfileType; profileId: number };
};
