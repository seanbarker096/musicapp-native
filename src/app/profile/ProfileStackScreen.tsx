import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import CreatePerformanceStackScreen from 'app/create-performance/CreatePerformanceStackScreen';
import { PerformanceStackScreen } from 'app/performance/PerformanceStackScreen';
import { PostStackScreen } from 'app/post/PostStackScreen';
import PrimaryNav from 'app/primary-nav/PrimaryNav';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import SettingsStackScreen from 'app/settings/SettingsStackScreen';
import { TimelineStackScreen } from 'app/timeline/TimelineStackScreen';
import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { BurgerMenuSVG } from 'components/icon/svg-components';
import { ProfileContext } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { View } from 'react-native';
import { SPACING_MID } from 'styles';
import Profile from './Profile';
import {
  ProfileInternalStackScreenParams,
  ProfileStackParamList,
} from './profile.types';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.PROFILE
>;

const ProfileStackScreen: FC<Props> = () => {
  const ProfileTab = createBottomTabNavigator<{
    main: ProfileInternalStackScreenParams;
  }>();

  return (
    <ProfileTab.Navigator
      tabBar={props => (
        <PrimaryNav
          navigation={props.navigation}
          currentScreen={PrimaryScreens.PROFILE}
        ></PrimaryNav>
      )}
    >
      <ProfileTab.Screen
        options={{ headerShown: false }}
        // @ts-ignore See ProfileInternalStackScreen for reason for this
        component={ProfileInternalStackScreen}
        name="main"
      ></ProfileTab.Screen>
    </ProfileTab.Navigator>
  );
};

export default ProfileStackScreen;

type InternalStackScreenProps = {
  route: { params: ProfileInternalStackScreenParams };
};

/**
 * Currently we can't type usages of this screen,because it is used by multiple navigators of various types (e.g. BottomTabNavigator, StackNavigator). We therefore need to add a @ts-ignore to the usages of this component in any navigators.
 */
export const ProfileInternalStackScreen: FC<InternalStackScreenProps> = () => {
  const { profileState } = useContext(ProfileContext);
  const { profileId, profileType } = profileState;

  const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        header: ProfileStackScreenHeader,
      }}
    >
      <ProfileStack.Screen name="Profile">
        {props => (
          <Profile
            {...props}
            profileId={profileId}
            profileType={profileType}
          />
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="ViewPost"
        component={PostStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileTimeline"
        component={TimelineStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfilePerformance"
        component={PerformanceStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileCreatePerformance"
        component={CreatePerformanceStackScreen}
        options={{ headerShown: false }}
      ></ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileSettings"
        component={SettingsStackScreen}
        options={{ animation: 'none' }}
      ></ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
};

const ProfileStackScreenHeader: FC<NativeStackHeaderProps> = ({
  navigation,
  route,
}) => {
  function navigate() {
    if (route.name === 'ProfileSettings') {
      navigation.goBack();
    } else {
      navigation.navigate('ProfileSettings');
    }
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: SPACING_MID,
        paddingLeft: SPACING_MID,
        paddingBottom: SPACING_MID,
      }}
    >
      <AppText>My App</AppText>
      <SVGIcon
        handlePress={navigate}
        styles={{ flexShrink: 1 }}
      >
        <BurgerMenuSVG></BurgerMenuSVG>
      </SVGIcon>
    </View>
  );
};
