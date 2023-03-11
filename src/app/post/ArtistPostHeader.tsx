import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { SPACING_XXSMALL } from 'styles';

interface ArtistPostHeaderProps {
  profileImageUrl?: string;
  displayName: string;
}

const ArtistPostHeader: FC<ArtistPostHeaderProps> = ({
  profileImageUrl,
  displayName,
}) => {
  return (
    <>
      <ProfileImage
        size="small"
        styles={{ marginRight: SPACING_XXSMALL }}
        imageUrl={profileImageUrl}
      ></ProfileImage>
      <AppText size="large">{displayName}</AppText>
    </>
  );
};

export default ArtistPostHeader;
