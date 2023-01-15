import SVGIcon from 'components/icon/SVGIcon';
import ProfileImage from 'components/profile-image/ProfileImage';
import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const [hasProfileImage, setHasProfileImage] = useState(false);

  return (
    <>
      <View>
        <ProfileImage imgUrl={profileImageUrl}></ProfileImage>
        <Text>Jelani Blackman</Text>
        <Text></Text>
        <View>
          <View>
            <SVGIcon></SVGIcon>
          </View>
          <View>
            <SVGIcon></SVGIcon>
          </View>
          <View>
            <SVGIcon></SVGIcon>
          </View>
        </View>
        <View class="Gallery"></View>
      </View>
    </>
  );
};

export default UserProfile;
