import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';

export type AppShellStackNavigatorParamList = {
  [PrimaryScreens.HOME]: undefined;
  [PrimaryScreens.CREATE_POST]: undefined;
  [PrimaryScreens.MANAGE]: undefined;
  [PrimaryScreens.PROFILE]: undefined;
  [PrimaryScreens.SEARCH]: undefined;
};

export type AppShellStackScreenProps =
  BottomTabScreenProps<AppShellStackNavigatorParamList>;
