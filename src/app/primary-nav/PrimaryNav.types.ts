import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type PrimaryNavNavigationProp =
  NativeStackNavigationProp<PrimaryNavNavigatorParamList>;

export enum PrimaryScreens {
  PROFILE = 'profile',
  FEED = 'feed',
}

export type PrimaryNavNavigatorParamList = {
  [PrimaryScreens.PROFILE]: undefined;
  [PrimaryScreens.FEED]: undefined;
};
