import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignUpForm } from './SignUpForm';
import { UploadProfileImage } from './UploadProfileImage';

export type SignUpStackParamList = {
  SignUpForm: undefined;
  UploadProfileImage: {
    userId: number;
  };
};

const SignUpStack = createNativeStackNavigator<SignUpStackParamList>();

export const SignUpStackScreen = () => {
  return (
    <SignUpStack.Navigator>
      <SignUpStack.Screen
        name="SignUpForm"
        component={SignUpForm}
      ></SignUpStack.Screen>
      <SignUpStack.Screen
        name="UploadProfileImage"
        component={UploadProfileImage}
      ></SignUpStack.Screen>
    </SignUpStack.Navigator>
  );
};
