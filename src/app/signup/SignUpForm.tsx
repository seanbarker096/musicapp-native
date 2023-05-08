import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoggedOutPage } from 'app/App';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/SignUp';
import { AppText } from 'components/app-text';
import { Formik } from 'formik';
import React, { FC } from 'react';
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSignUpMutation } from 'store/auth/auth.queries';
import { SignUpMutationResult } from 'store/auth/auth.types';
import { SignUpStackParamList } from './SignUpStackScreen';

export interface SignUpFormValues {
  email: string;
  username: string;
  password: string;
}

type SignUpProps = NativeStackScreenProps<SignUpStackParamList, 'SignUpForm'>;

export const SignUpForm: FC<SignUpProps> = ({ navigation: { navigate } }) => {
  const { setLoggedOutPage } = React.useContext(SignUpPageStateSettersContext);

  const navigateToUploadProfileImage = (userId: number) => {
    navigate('UploadProfileImage', { userId: userId });
  };

  const mutatation = useSignUpMutation({
    onSuccess: ({ authState }: SignUpMutationResult) =>
      navigateToUploadProfileImage(authState.authUser.userId),
  });

  const handleFormSubmit = async ({
    email,
    username,
    password,
  }: SignUpFormValues) => {
    mutatation.mutate({
      email,
      username,
      password,
    });
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          username: '',
          password: '',
        }}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              style={styles.text}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="email"
            />
            <TextInput
              style={styles.text}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              placeholder="username"
            />
            <TextInput
              style={styles.text}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="password"
            />
            <Button
              onPress={handleSubmit}
              title="Sign Up"
            />
          </View>
        )}
      </Formik>
      <Text>Already have an account?</Text>
      <Pressable onPress={() => setLoggedOutPage(LoggedOutPage.LOGIN)}>
        <AppText>Login</AppText>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
