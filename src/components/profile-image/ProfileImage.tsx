import { AvatarSize } from 'components/avatar';
import { UserAvatarSVG } from 'components/icon/svg-components';
import SVGIcon from 'components/icon/SVGIcon';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface ProfileImageProps {
  imageUrl?: string;
}

const ProfileImage: FC<ProfileImageProps> = ({ imageUrl }) => {
  const SvgAvatar = (
    <SVGIcon>
      <UserAvatarSVG></UserAvatarSVG>
    </SVGIcon>
  );

  console.log(imageUrl);
  const UserImage = (
    <Image
      style={{ ...style.image }}
      source={{
        uri: imageUrl,
        height: AvatarSize.MEDIUM,
        width: AvatarSize.MEDIUM,
      }}
    ></Image>
  );

  return <View>{imageUrl ? UserImage : SvgAvatar}</View>;
};

const style = StyleSheet.create({
  image: {},
});

export default ProfileImage;
