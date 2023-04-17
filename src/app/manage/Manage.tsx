import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import {
  PictureCheckMarkSVG,
  RightChevronSVG,
  TaggedUserSVG,
} from 'components/icon/svg-components';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { Pressable, View } from 'react-native';
import { SPACING_SMALL, SPACING_XXSMALL } from 'styles';
import { ManageStackParamList } from './manage-types';

type ManageProps = NativeStackScreenProps<ManageStackParamList, 'Manage'>;

const Manage: FC<ManageProps> = ({ navigation }) => {
  const { profileState } = useContext(ProfileContext);
  const { profileType } = profileState;

  const manageListItems = [];

  if (profileType === ProfileType.PERFORMER) {
    manageListItems.push({
      heading: 'Fan Videos',
      text: 'View videos your fans have tagged you in, link them to your performances and feature them on your profile',
      icon: TaggedUserSVG,
      action: () => navigation.navigate('ManageTaggedPosts'),
    });
  }

  if (profileType === ProfileType.USER) {
    manageListItems.push({
      heading: 'Features',
      text: 'View posts you have created, which artists and other users have featured on their profile',
      icon: PictureCheckMarkSVG,
      // If user was previously viewing app as their artist profile, switch to user, otherwise switch to artist
      action: () => navigation.navigate('ManageFeaturedPosts'),
    });
  }

  return (
    <>
      {manageListItems.map(item => (
        <Pressable
          key={item.heading}
          onPress={item.action}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: SPACING_SMALL,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <View
              style={{
                flexDirection: 'row',
                marginRight: SPACING_SMALL,
                alignItems: 'center',
              }}
            >
              <SVGIcon styles={{ marginRight: SPACING_XXSMALL }}>
                <item.icon></item.icon>
              </SVGIcon>
              <AppText size="large">{item.heading}</AppText>
            </View>
            <AppText size="regular">{item.text}</AppText>
          </View>
          <SVGIcon>
            <RightChevronSVG></RightChevronSVG>
          </SVGIcon>
        </Pressable>
      ))}
    </>
  );
};

export default Manage;
