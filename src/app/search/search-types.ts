import { Artist } from 'store/artists';
import { ProfileType } from 'store/profile-posts';
import { User } from 'store/users/users.types';

export type InternalSearchStackScreenParamList = {
  Search: undefined;
  ProfileInternalStackScreen: {
    profile: Artist | User;
    profileType: ProfileType;
  };
};
