import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import { Avatar, AvatarSize } from 'components/avatar';
import { IconColor } from 'components/icon/icon.types';
import {
  BorderedPlusSVG,
  HomeOutlineSVG,
  PeopleSVG,
  SearchOutlineSVG,
} from 'components/icon/svg-components';
import { SVGIcon } from 'components/icon/SVGIcon';
import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BORDER_COLOR_XDARK,
  BORDER_RADIUS_XXSMALL,
  NAVIGATION_BACKGROUND_COLOR,
  SPACING_SMALL,
} from 'styles';
import { PrimaryScreens } from './PrimaryNav.types';

interface PrimaryNavProps {
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

const PrimaryNav: FC<PrimaryNavProps> = ({ navigation }) => {
  const [selectedScreen, setSelectedScreen] = useState(PrimaryScreens.HOME);
  const [avatarActive, setAvatarActive] = useState(false);

  const handleIconPress = (selectedScreen: PrimaryScreens) => {
    setSelectedScreen(selectedScreen);
    setAvatarActive(false);
    navigation.navigate(selectedScreen);
  };

  const handleAvatarPress = (selectedScreen: PrimaryScreens) => {
    setSelectedScreen(selectedScreen);
    setAvatarActive(!avatarActive);
    navigation.navigate(selectedScreen);
  };

  return (
    <View style={styles.navContainer}>
      <SVGIcon
        color={
          selectedScreen === PrimaryScreens.HOME
            ? IconColor.SECONDARY
            : IconColor.DARK
        }
        handlePress={() => handleIconPress(PrimaryScreens.HOME)}
      >
        <HomeOutlineSVG></HomeOutlineSVG>
      </SVGIcon>
      <SVGIcon
        color={
          selectedScreen === PrimaryScreens.SEARCH
            ? IconColor.SECONDARY
            : IconColor.DARK
        }
        handlePress={() => handleIconPress(PrimaryScreens.SEARCH)}
      >
        <SearchOutlineSVG></SearchOutlineSVG>
      </SVGIcon>
      <SVGIcon
        color={
          selectedScreen === PrimaryScreens.MANAGE
            ? IconColor.SECONDARY
            : IconColor.DARK
        }
        handlePress={() => handleIconPress(PrimaryScreens.MANAGE)}
      >
        <PeopleSVG></PeopleSVG>
      </SVGIcon>
      <SVGIcon
        color={
          selectedScreen === PrimaryScreens.UPLOAD
            ? IconColor.SECONDARY
            : IconColor.DARK
        }
        handlePress={() => handleIconPress(PrimaryScreens.UPLOAD)}
      >
        <BorderedPlusSVG></BorderedPlusSVG>
      </SVGIcon>
      <Avatar
        style={avatarActive ? styles.avatarActive : styles.avatarInactive}
        size={AvatarSize.SMALL}
        imageUrl="https://www.w3schools.com/howto/img_avatar.png"
        handlePress={() => handleAvatarPress(PrimaryScreens.PROFILE)}
      ></Avatar>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    alignItems: 'center',
    backgroundColor: NAVIGATION_BACKGROUND_COLOR,
    display: 'flex',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING_SMALL,
    width: '100%',
  },
  avatarInactive: {
    borderRadius: AvatarSize.SMALL / 2,
    borderStyle: 'solid',
    borderWidth: BORDER_RADIUS_XXSMALL,
    borderColor: 'transparent',
  },
  avatarActive: {
    borderRadius: AvatarSize.SMALL / 2,
    borderStyle: 'solid',
    borderWidth: BORDER_RADIUS_XXSMALL,
    borderColor: BORDER_COLOR_XDARK,
  },
});

export default PrimaryNav;
