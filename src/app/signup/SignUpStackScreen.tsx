import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLOR_NEUTRAL_XXXXLIGHT } from 'styles';
import { CreateBio } from './CreateBio';
import { SignUpForm } from './SignUpForm';
import { UploadProfileImage } from './UploadProfileImage';
import { SignUpStackParamList } from './sign-up.types';

const SignUpStack = createNativeStackNavigator<SignUpStackParamList>();

export const SignUpStackScreen = () => {
  return (
    <SignUpStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
        },
      }}
    >
      <SignUpStack.Screen
        name="SignUpForm"
        component={SignUpForm}
        options={{ headerTitle: 'Sign Up' }}
      ></SignUpStack.Screen>
      <SignUpStack.Screen
        name="UploadProfileImage"
        component={UploadProfileImage}
        options={{ headerTitle: 'Sign Up' }}
      ></SignUpStack.Screen>
      <SignUpStack.Screen
        name="CreateBio"
        component={CreateBio}
        options={{ headerTitle: 'Sign Up' }}
      ></SignUpStack.Screen>
    </SignUpStack.Navigator>
  );
};
