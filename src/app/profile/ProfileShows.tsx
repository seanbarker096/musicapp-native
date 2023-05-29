import { AppButton } from 'components/app-button';
import { AppText } from 'components/app-text';
import { ScrollableGalleryLayout } from 'components/gallery';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext, useState } from 'react';
import { View } from 'react-native';
import { useGetProfilePostsWithAttachmentsAndFilesQuery } from 'utils/custom-hooks';

interface ProfileShowsProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
  handlePostPress?: (postId: number) => void;
  handleCreatePostPress: () => void;
}

const ProfileShows: FC<ProfileShowsProps> = ({
  profileId,
  profileType,
  handlePostPress,
  handleCreatePostPress,
}) => {
  const { profileState } = useContext(ProfileContext);

  const isViewingUsersProfile =
    profileState.profileType === profileType &&
    profileState.profileId === profileId;

  const [limit, setLimit] = useState(9);

  const { isLoading: postsLoading, postsWithAttachmentsAndFiles } =
    useGetProfilePostsWithAttachmentsAndFilesQuery({
      profileId,
      profileType,
      includeFeatured: true, // This should only return results for a performers profile, as they ar ethe only one that can feature posts (also known as 'Artist Picks')
      includeOwned: true, // Artists should not be able to create posts, so this filter should not return any additional results for a performers profile
      includeTagged: false,
      limit,
    });

  const hasNextPage = postsWithAttachmentsAndFiles
    ? postsWithAttachmentsAndFiles.length >= limit
    : false;

  return (
    <>
      {postsWithAttachmentsAndFiles &&
        !!postsWithAttachmentsAndFiles.length && (
          <ScrollableGalleryLayout
            posts={postsWithAttachmentsAndFiles}
            onEndReached={() => {
              if (hasNextPage) {
                setLimit(limit + 9);
              }
            }}
            hasMoreData={hasNextPage}
            handleGalleryItemPress={handlePostPress}
          ></ScrollableGalleryLayout>
        )}
      {postsWithAttachmentsAndFiles && !postsWithAttachmentsAndFiles.length && (
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <AppText>No posts here</AppText>
          {isViewingUsersProfile && profileType === ProfileType.USER && (
            <>
              <AppText>
                Share all the moments you've captured at gigs you've attended
                now!
              </AppText>
              <AppButton
                handlePress={handleCreatePostPress}
                text="Create a Post"
              ></AppButton>
            </>
          )}
        </View>
      )}
    </>
  );
};

export default ProfileShows;
