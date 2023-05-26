import { ScrollableGallery } from 'components/gallery';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, useEffect, useState } from 'react';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileShowsProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
}

const ProfileShows: FC<ProfileShowsProps> = ({ profileId, profileType }) => {
  const [limit, setLimit] = useState(9);

  let queryLimit = 9;
  useEffect(() => {
    queryLimit = limit;
  }, [limit]);

  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetProfilePostsWithAttachmentsAndFilesQuery({
      profileId,
      profileType,
      includeFeatured: true,
      includeOwned: true,
      includeTagged: false,
      limit: queryLimit,
    });

  const hasNextPage = postsWithAttachmentsAndFiles
    ? postsWithAttachmentsAndFiles.length >= limit
    : false;

  return (
    <>
      {postsWithAttachmentsAndFiles && (
        <ScrollableGallery
          postsWithAttachmentsAndFiles={postsWithAttachmentsAndFiles}
          isLoading={postsLoading}
          hasMoreData={hasNextPage}
          onEndReached={() => {
            setLimit(limit + 9);
            console.log('ended reached', limit);
          }}
        ></ScrollableGallery>
      )}
    </>
  );
};

export default ProfileShows;
