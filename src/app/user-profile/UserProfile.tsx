import SVGIcon from 'components/icon/SVGIcon';
import React, { FC, useState } from 'react';
import { Image, Text, View } from 'react-native';

interface UserProfileProps {}

const UserProfile: FC<UserProfileProps> = () => {
  const [hasProfileImage, setHasProfileImage] = useState(false);

  return (
    <>
      <View>
        <Image></Image>
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
