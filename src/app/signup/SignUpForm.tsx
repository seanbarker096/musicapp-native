import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoggedOutPage } from 'app/App';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/SignUp';
import { AppText } from 'components/app-text';
import {
  AppTextInput,
  emailValidator,
  passwordValidator,
  usernameValidator,
} from 'components/form-components';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSignUpMutation } from 'store/auth/auth.queries';
import { SignUpMutationResult } from 'store/auth/auth.types';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  SPACING_XSMALL,
} from 'styles';
import * as Yup from 'yup';
import { SignUpStackParamList } from './SignUpStackScreen';

export interface SignUpFormValues {
  email: string;
  username: string;
  password: string;
}

type SignUpProps = NativeStackScreenProps<SignUpStackParamList, 'SignUpForm'>;

const signupFormSchema = Yup.object({
  email: emailValidator,
  username: usernameValidator,
  password: passwordValidator,
});

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

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    validationSchema: signupFormSchema,
    initialValues: { username: '', password: '', email: '' },
    onSubmit: handleFormSubmit,
  });

  const buttonDisabled = isSubmitting || !isValid || !dirty;

  return (
    <>
      <View style={{ margin: 10 }}>
        <AppTextInput
          handleChange={handleChange('email')}
          handleBlur={handleBlur('email')}
          value={values.email}
          placeholder="Email address"
          error={errors.email}
          touched={touched.email}
          marginBottom={SPACING_XSMALL}
        />
        <AppTextInput
          handleChange={handleChange('username')}
          handleBlur={handleBlur('username')}
          value={values.username}
          placeholder="Username"
          error={errors.username}
          touched={touched.username}
          marginBottom={SPACING_XSMALL}
        />
        <AppTextInput
          handleChange={handleChange('password')}
          handleBlur={handleBlur('password')}
          value={values.password}
          placeholder="Password"
          error={errors.password}
          touched={touched.password}
          secureTextEntry={true}
          marginBottom={SPACING_XSMALL}
        />
        <Button
          color={!buttonDisabled ? BUTTON_COLOR_PRIMARY : BUTTON_COLOR_DISABLED}
          disabled={isSubmitting || !isValid}
          onPress={handleSubmit}
          title="Sign Up"
        />
      </View>

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
