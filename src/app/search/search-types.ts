import { ProfileType } from 'contexts/profile.context';

export type InternalSearchStackScreenParamList = {
  search: undefined;
  searchProfile: { profileType: ProfileType; profileId: number };
};
