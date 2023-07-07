import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import { Avatar, AvatarSize } from 'components/avatar';
import { SVGIcon } from 'components/icon/SVGIcon';
import { IconColor } from 'components/icon/icon.types';
import {
  BorderedPlusSVG,
  MailSVG,
  SearchOutlineSVG,
} from 'components/icon/svg-components';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BORDER_RADIUS_XXSMALL,
  COLOR_NEUTRAL_XXXXLIGHT,
  NAVIGATION_BACKGROUND_COLOR,
  SPACING_SMALL,
} from 'styles';
import { PrimaryScreens } from './PrimaryNav.types';

interface PrimaryNavProps {
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  currentScreen: PrimaryScreens;
}

const PrimaryNav: FC<PrimaryNavProps> = ({ navigation, currentScreen }) => {
  const { profileState } = useContext(ProfileContext);
  const profileType = profileState.profileType;

  const handleIconPress = (selectedScreen: PrimaryScreens) => {
    navigation.navigate(selectedScreen);
  };

  return (
    <View style={styles.navContainer}>
      <SVGIcon
        color={
          currentScreen === PrimaryScreens.SEARCH
            ? IconColor.WHITE
            : IconColor.DARK
        }
        handlePress={() => handleIconPress(PrimaryScreens.SEARCH)}
      >
        <SearchOutlineSVG></SearchOutlineSVG>
      </SVGIcon>
      {profileType === ProfileType.PERFORMER && (
        <SVGIcon
          color={
            currentScreen === PrimaryScreens.CREATE_PERFORMANCE
              ? IconColor.WHITE
              : IconColor.DARK
          }
          handlePress={() => handleIconPress(PrimaryScreens.CREATE_PERFORMANCE)}
        >
          <BorderedPlusSVG></BorderedPlusSVG>
        </SVGIcon>
      )}
      {profileType === ProfileType.USER && (
        <SVGIcon
          color={
            currentScreen === PrimaryScreens.CREATE_POST
              ? IconColor.WHITE
              : IconColor.DARK
          }
          handlePress={() => handleIconPress(PrimaryScreens.CREATE_POST)}
        >
          <BorderedPlusSVG></BorderedPlusSVG>
        </SVGIcon>
      )}
      <SVGIcon
        color={
          currentScreen === PrimaryScreens.MANAGE
            ? IconColor.WHITE
            : IconColor.DARK
        }
        handlePress={() => handleIconPress(PrimaryScreens.MANAGE)}
      >
        <MailSVG></MailSVG>
      </SVGIcon>
      <Avatar
        style={
          currentScreen === PrimaryScreens.PROFILE
            ? styles.avatarActive
            : styles.avatarInactive
        }
        size={AvatarSize.SMALL}
        imageUrl="https://www.w3schools.com/howto/img_avatar.png"
        handlePress={() => handleIconPress(PrimaryScreens.PROFILE)}
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
    borderColor: COLOR_NEUTRAL_XXXXLIGHT,
  },
});

export default PrimaryNav;
