import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { View } from 'react-native';
import { SPACING_XXSMALL } from 'styles';

interface PostHeaderProps {
  imgUrl?: string;
  name: string;
  performanceText?: string;
  onPerformerPress?: () => void;
  onPostCreatorPress?: () => void;
}

const PostHeader: FC<PostHeaderProps> = ({
  imgUrl,
  name,
  performanceText,
  onPerformerPress,
  onPostCreatorPress,
}) => {
  return (
    <>
      <ProfileImage
        size="small"
        styles={{ marginRight: SPACING_XXSMALL }}
        imageUrl={imgUrl}
        handlePress={onPostCreatorPress}
      ></ProfileImage>
      <View style={{ flexDirection: 'column' }}>
        <AppText
          handlePress={onPostCreatorPress}
          size="large"
        >
          {name}
        </AppText>
        <AppText
          handlePress={onPerformerPress}
          size="small"
        >
          {performanceText}
        </AppText>
      </View>
    </>
  );
};

export default PostHeader;
