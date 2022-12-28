import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import { Avatar, AvatarSize } from 'components/avatar';
import Icon from 'components/icon/Icon';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { NAVIGATION_BACKGROUND_COLOR } from 'styles';
import {
  PrimaryNavNavigatorParamList,
  PrimaryScreens,
} from './PrimaryNav.types';

interface PrimaryNavProps {
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

const DEFAULT_HEADER_OPTIONS = {
  headerBackVisible: true,
};
const NavigationHeaderOptions = {
  default: DEFAULT_HEADER_OPTIONS,
  [PrimaryScreens.PROFILE]: {
    title: 'Profile',
    ...DEFAULT_HEADER_OPTIONS,
    headerBackVisible: false,
  },
  [PrimaryScreens.FEED]: {
    title: 'Feed',
    ...DEFAULT_HEADER_OPTIONS,
    headerBackVisible: false,
  },
};

const PrimaryNav: FC<PrimaryNavProps> = ({ navigation }) => {
  const handleNavigation = (screen: keyof PrimaryNavNavigatorParamList) => {
    console.log('clicked');
    navigation.navigate(screen);
  };

  return (
    <View style={styles.navContainer}>
      <Icon iconName="home-outline"></Icon>
      <Icon iconName="search"></Icon>
      <Icon iconName="bordered-plus"></Icon>
      <Icon
        iconName="people"
        width={24}
        height={24}
      ></Icon>
      <Avatar
        size={AvatarSize.SMALL}
        imageUrl="https://www.w3schools.com/howto/img_avatar.png"
        onPress={() => handleNavigation(PrimaryScreens.PROFILE)}
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
    // padding: SPACING_SMALL,
    width: '100%',
  },
});

export default PrimaryNav;
