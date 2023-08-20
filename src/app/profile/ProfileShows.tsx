import { AppEmptyState } from 'components/app-empty-state';
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
          {profileType === ProfileType.USER &&
            (isViewingUsersProfile ? (
              <AppEmptyState
                primaryMessage="Your favourite moments as a music fan"
                secondaryMessage="Share all your favourite moments from gigsc you've attended
                now!"
                actionText="Create a post"
                onActionPress={handleCreatePostPress}
              ></AppEmptyState>
            ) : (
              <AppEmptyState
                primaryMessage="Their favourite moments as a music fan"
                secondaryMessage="This user hasn't shared any videos yet"
              ></AppEmptyState>
            ))}

          {profileType === ProfileType.PERFORMER &&
            (isViewingUsersProfile ? (
              <AppEmptyState
                primaryMessage="Your favourite moments, captured by your fans"
                secondaryMessage="Artist Picks are fan videos that you can feature on your profile. View your fans videos, click the 'Artist Pick' icon, and they will be here for everyone to see!"
              ></AppEmptyState>
            ) : (
              <AppEmptyState
                primaryMessage="Artist's favourite moments, captured by their fans"
                secondaryMessage="This artist hasn't picked any fan videos yet. Artist picks will appear here once they do."
              ></AppEmptyState>
            ))}
        </View>
      )}
    </>
  );
};

export default ProfileShows;
