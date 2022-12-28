import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers } from '@react-navigation/native';

export enum PrimaryScreens {
  PROFILE = 'profile',
  MANAGE = 'manage',
  UPLOAD = 'upload',
  SEARCH = 'search',
  HOME = 'home',
}

export type PrimaryNavNavigatorParamList = Record<
  'profile' | 'feed',
  object | undefined
>;

export type e = Record<string, object | undefined>;

export type PrimaryNavNavigationProp = NavigationHelpers<
  PrimaryNavNavigatorParamList,
  BottomTabNavigationEventMap
>;
