import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CreateBio } from './CreateBio';
import { SignUpForm } from './SignUpForm';
import { UploadProfileImage } from './UploadProfileImage';

export type SignUpStackParamList = {
  SignUpForm: undefined;
  UploadProfileImage: {
    userId: number;
  };
  CreateBio: {
    userId: number;
  };
};

const SignUpStack = createNativeStackNavigator<SignUpStackParamList>();

export const SignUpStackScreen = () => {
  return (
    <SignUpStack.Navigator screenOptions={{ headerShown: false }}>
      <SignUpStack.Screen
        name="SignUpForm"
        component={SignUpForm}
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
