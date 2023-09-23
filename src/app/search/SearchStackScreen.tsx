import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AppShellStackNavigatorParamList } from 'app/app-shell/appShell.types';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';
import { ProfileInternalStackScreen } from 'app/profile/ProfileStackScreen';
import React, { FC } from 'react';
import Search from './Search';
import { InternalSearchStackScreenParamList } from './search-types';
import { SVGIcon } from 'components/icon/';
import { LeftArrowSVG } from 'components/icon/svg-components';
import { navigationHeaderFactory } from 'utils/utils';

type Props = NativeStackScreenProps<
  AppShellStackNavigatorParamList,
  PrimaryScreens.SEARCH
>;

const SearchStack =
  createNativeStackNavigator<InternalSearchStackScreenParamList>();

export const SearchStackScreen: FC<Props> = () => {
  return (
    <SearchStack.Navigator 
    screenOptions={navigationHeaderFactory()}
  >
      <SearchStack.Screen
        component={Search}
        name="Search"
        options={{ headerTitle: 'Search' }}
      ></SearchStack.Screen>
      <SearchStack.Screen
        // @ts-ignore See ProfileInternalStackScreen for reason for this
        component={ProfileInternalStackScreen}
        name="SearchProfile"
        options={{ headerShown: false }}
      ></SearchStack.Screen>
    </SearchStack.Navigator>
  );
};
