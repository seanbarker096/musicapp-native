import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import PerformerProfileHeader from './PerformerProfileHeader';
import UserProfileHeader from './UserProfileHeader';

interface ProfileHeaderProps {
  profileId: number; // Can be performer or user
  profileType: ProfileType;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ profileId, profileType }) => {
  return (
    <>
      {profileType === ProfileType.USER && (
        <UserProfileHeader userId={profileId}></UserProfileHeader>
      )}
      {profileType === ProfileType.PERFORMER && (
        <PerformerProfileHeader
          performerId={profileId}
        ></PerformerProfileHeader>
      )}
    </>
  );
};

export default ProfileHeader;
