/** -------------------- PROFILE POSTS GET ---------------------- */
import { useQuery } from 'react-query';
import { Post } from 'store/posts';
import { transformPostApi } from 'store/posts/posts.transformations';
import { getRequest } from 'store/request-builder';
import { profilePostsKeys } from './profile-posts.query-keys';
import {
  ProfilePostsGetFilter,
  ProfilePostsStoreSlice,
} from './profile-posts.types';
async function profilePostsGet({
  profile_id,
  profile_type,
  include_featured,
  include_owned,
  include_tagged,
  limit,
}: ProfilePostsStoreSlice['Get']['RequestParametersType']) {
  console.log('LIMIT', limit);
  const response = await getRequest<ProfilePostsStoreSlice>({
    url: `posts/0.1/profiles/${profile_id}/posts`,
    params: {
      profile_type,
      profile_id: undefined, // Its in the url
      include_featured,
      include_owned,
      include_tagged,
      limit,
    },
  });
  return response.data.posts.map(post => transformPostApi(post));
}
export const useProfilePostsGetQuery = ({
  profileType,
  profileId,
  includeFeatured,
  includeOwned,
  includeTagged,
  limit,
}: ProfilePostsGetFilter) => {
  console.log('LIMIT**********', limit);
  if (!profileId) {
    throw new Error('Profile ID is required for a profilePostsGetQuery');
  }
  const apiQueryParams = {
    profile_id: profileId,
    profile_type: profileType,
    include_featured: includeFeatured,
    include_owned: includeOwned,
    include_tagged: includeTagged,
    limit,
  };
  return useQuery<readonly Post[], unknown, readonly Post[]>(
    profilePostsKeys.profilePostsByProfile(profileId, profileType, limit),
    () => profilePostsGet(apiQueryParams),
  );
};