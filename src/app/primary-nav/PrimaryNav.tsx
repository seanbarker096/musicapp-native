import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import { AvatarSize } from 'components/avatar';
import { SVGIcon } from 'components/icon/SVGIcon';
import { IconColor } from 'components/icon/icon.types';
import {
  BorderedPlusSVG,
  MailSVG,
  SearchOutlineSVG,
} from 'components/icon/svg-components';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { useUserGetQuery } from 'store/users';
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

  const {
    isLoading: userGetLoading,
    isError: isUsersGetError,
    data: userData,
    error: usersGetError,
  } = useUserGetQuery({
    queryParams: { id: profileState.profileId },
  });

  const userReady = userData && !userGetLoading;

  const user = userReady ? userData[0] : undefined;

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
      <ProfileImage
        styles={
          currentScreen === PrimaryScreens.PROFILE
            ? styles.avatarActive
            : styles.avatarInactive
        }
        size="small"
        imageUrl={user?.avatarFile?.url}
        handlePress={() => handleIconPress(PrimaryScreens.PROFILE)}
      ></ProfileImage>
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
