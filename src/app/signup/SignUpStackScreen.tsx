import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLOR_NEUTRAL_XXXXLIGHT } from 'styles';
import { navHeaderFactory } from 'utils/utils';
import { ConfirmSignUp } from './ConfirmSignUp';
import { CreateBio } from './CreateBio';
import { SignUpForm } from './SignUpForm';
import { UploadProfileImage } from './UploadProfileImage';
import { SignUpStackParamList } from './sign-up.types';

const SignUpStack = createNativeStackNavigator<SignUpStackParamList>();

export const SignUpStackScreen = () => {
  return (
    <SignUpStack.Navigator
      screenOptions={navHeaderFactory({
        screenOptions: {
          headerShown: false,
          contentStyle: {
            backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
          },
        },
      })}
    >
      <SignUpStack.Screen
        name="SignUpForm"
        component={SignUpForm}
      ></SignUpStack.Screen>
      <SignUpStack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUp}
      ></SignUpStack.Screen>
      <SignUpStack.Screen
        name="UploadProfileImage"
        component={UploadProfileImage}
      ></SignUpStack.Screen>
      <SignUpStack.Screen
        name="CreateBio"
        component={CreateBio}
      ></SignUpStack.Screen>
    </SignUpStack.Navigator>
  );
};
