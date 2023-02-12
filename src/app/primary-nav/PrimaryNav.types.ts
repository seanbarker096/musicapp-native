import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers } from '@react-navigation/native';

/**
 * Screens managed by the primary navigation tabs. See /navigation for other screens
 */
export enum PrimaryScreens {
  PROFILE = 'profile',
  MANAGE = 'manage',
  CREATE_POST = 'CREATE_POST',
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
