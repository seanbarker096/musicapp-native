import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from 'app/feed/Feed';
import UserProfile from 'app/user-profile/UserProfile/UserProfile';
import Avatar from 'components/avatar/Avatar';
import { AvatarSize } from 'components/avatar/Avatar.types';
import Icon from 'components/icon/Icon';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { NAVIGATION_BACKGROUND_COLOR, SPACING_SMALL } from 'styles';
import {
  PrimaryNavNavigationProp,
  PrimaryNavNavigatorParamList,
  Screens,
} from './PrimaryNav.types';

interface PrimaryNavProps {}

const PrimaryNav: FC<PrimaryNavProps> = () => {
  const Stack = createNativeStackNavigator<PrimaryNavNavigatorParamList>();
  const navigation = useNavigation<PrimaryNavNavigationProp>();

  const handleNavigation = (screen: keyof PrimaryNavNavigatorParamList) => {
    console.log('clicked');
    navigation.navigate(screen);
  };

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={Screens.FEED}
          component={Feed}
        ></Stack.Screen>
        <Stack.Screen
          name={Screens.PROFILE}
          component={UserProfile}
        ></Stack.Screen>
      </Stack.Navigator>
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
          onPress={() => handleNavigation(Screens.PROFILE)}
        ></Avatar>
      </View>
    </>
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
});

export default PrimaryNav;
