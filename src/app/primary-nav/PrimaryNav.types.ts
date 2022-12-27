import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type PrimaryNavNavigationProp =
  NativeStackNavigationProp<PrimaryNavNavigatorParamList>;

export enum Screens {
  PROFILE = 'profile',
  FEED = 'feed',
}

export type PrimaryNavNavigatorParamList = {
  [Screens.PROFILE]: undefined;
  [Screens.FEED]: undefined;
};
