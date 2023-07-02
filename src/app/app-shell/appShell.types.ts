import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { PrimaryScreens } from 'app/primary-nav/PrimaryNav.types';

// TODO: Make all navigation return a {} instead of undefined so dont have to do if params checks in screens
export type AppShellStackNavigatorParamList = {
  [PrimaryScreens.CREATE_POST]: undefined;
  [PrimaryScreens.MANAGE]: undefined;
  [PrimaryScreens.PROFILE]: {
    createPostSuccess?: boolean;
  };
  [PrimaryScreens.SEARCH]: undefined;
  [PrimaryScreens.CREATE_PERFORMANCE]: undefined;
};

export type AppShellStackScreenProps =
  BottomTabScreenProps<AppShellStackNavigatorParamList>;
