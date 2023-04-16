import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { View } from 'react-native';
import { SPACING_XXSMALL } from 'styles';

interface PerformerPostHeaderProps {
  profileImageUrl?: string;
  displayName: string;
  performanceText?: string;
}

const PerformerPostHeader: FC<PerformerPostHeaderProps> = ({
  profileImageUrl,
  displayName,
  performanceText,
}) => {
  return (
    <>
      <ProfileImage
        size="small"
        styles={{ marginRight: SPACING_XXSMALL }}
        imageUrl={profileImageUrl}
      ></ProfileImage>
      <View style={{ flexDirection: 'column' }}>
        <AppText size="large">{displayName}</AppText>
        <AppText size="small">{performanceText}</AppText>
      </View>
    </>
  );
};

export default PerformerPostHeader;
