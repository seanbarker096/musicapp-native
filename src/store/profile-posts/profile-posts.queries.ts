/** -------------------- PROFILE POSTS GET ---------------------- */

import { useInfiniteQuery } from 'react-query';
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
  offset = 0,
}: ProfilePostsStoreSlice['Get']['RequestParametersType']) {
  console.log('offset', offset);
  const response = await getRequest<ProfilePostsStoreSlice>({
    url: `posts/0.1/profiles/${profile_id}/posts`,
    params: {
      profile_type,
      profile_id: undefined, // Its in the url
      include_featured,
      include_owned,
      include_tagged,
      offset: offset,
    },
  });

  return {
    data: response.data.posts.map(post => transformPostApi(post)),
    offset: offset,
  };
}

export const useProfilePostsGetQuery = ({
  profileType,
  profileId,
  includeFeatured,
  includeOwned,
  includeTagged,
}: ProfilePostsGetFilter) => {
  if (!profileId) {
    throw new Error('Profile ID is required for a profilePostsGetQuery');
  }

  const apiQueryParams = {
    profile_id: profileId,
    profile_type: profileType,
    include_featured: includeFeatured,
    include_owned: includeOwned,
    include_tagged: includeTagged,
  };

  return useInfiniteQuery<
    { data: readonly Post[]; offset: number },
    unknown,
    { data: readonly Post[]; offset: number }
  >(
    profilePostsKeys.profilePostsByProfile(profileId, profileType),
    ({ pageParam }) =>
      profilePostsGet({ ...apiQueryParams, offset: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => lastPage.offset + 10,
    },
  );
};
