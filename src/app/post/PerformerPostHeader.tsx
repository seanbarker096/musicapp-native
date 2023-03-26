import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { SPACING_XXSMALL } from 'styles';

interface PerformerPostHeaderProps {
  profileImageUrl?: string;
  displayName: string;
}

const PerformerPostHeader: FC<PerformerPostHeaderProps> = ({
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

export default PerformerPostHeader;
