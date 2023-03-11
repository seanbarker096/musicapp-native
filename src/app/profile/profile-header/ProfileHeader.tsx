import React, { FC } from 'react';
import { ProfileType } from 'store/profile-posts';
import ArtistProfileHeader from './ArtistProfileHeader';
import UserProfileHeader from './UserProfileHeader';

interface ProfileHeaderProps {
  profileId: number; // Can be artist or user
  profileType: ProfileType;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ profileId, profileType }) => {
  return (
    <>
      {profileType === ProfileType.USER && (
        <UserProfileHeader userId={profileId}></UserProfileHeader>
      )}
      {profileType === ProfileType.ARTIST && (
        <ArtistProfileHeader artistId={profileId}></ArtistProfileHeader>
      )}
    </>
  );
};

export default ProfileHeader;
