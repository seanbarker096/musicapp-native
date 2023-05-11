import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoggedOutPage } from 'app/app-types';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/logged-out-page.contexts';
import { AppButton } from 'components/app-button';
import { AppError } from 'components/app-error';
import { AppText } from 'components/app-text';
import {
  AppTextInput,
  emailValidator,
  passwordValidator,
  usernameValidator,
} from 'components/form-components';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSignUpMutation } from 'store/auth/auth.queries';
import { SignUpMutationResult } from 'store/auth/auth.types';
import { BUTTON_COLOR_PRIMARY, SPACING_LARGE, SPACING_XSMALL } from 'styles';
import * as Yup from 'yup';
import { SignUpStackParamList } from './sign-up.types';

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

  const { mutate, error } = useSignUpMutation({
    onSuccess: ({ authState }: SignUpMutationResult) =>
      navigateToUploadProfileImage(authState.authUser.userId),
  });

  const [showErrorMessage, setShowErrorMessage] = React.useState(false);

  let errorMessage;

  switch (error?.error_code) {
    case 'USER_ALREADY_EXISTS':
      errorMessage = 'An account with this email or username already exists';
      break;
    case 'UNKNOWN_ERROR':
      errorMessage = 'Unknown error';
      break;
    default:
      errorMessage = undefined;
  }

  const handleFormSubmit = async ({
    email,
    username,
    password,
  }: SignUpFormValues) => {
    setShowErrorMessage(true);
    mutate({
      email,
      username,
      password,
    });
  };

  console.log(errorMessage);

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

  const handleUsernameBlur = handleBlur('username');
  const handlePasswordBlur = handleBlur('password');
  const handleEmailBlur = handleBlur('email');

  const handleUsernameChange = handleChange('username');
  const handlePasswordChange = handleChange('password');
  const handleEmailChange = handleChange('email');

  const buttonDisabled = isSubmitting || !isValid || !dirty;

  function setShowError(show: boolean) {
    if (showErrorMessage !== show) {
      setShowErrorMessage(show);
    }
  }

  return (
    <>
      <View
        style={{
          margin: 10,
          paddingTop: '35%',
          paddingBottom: SPACING_LARGE,
          height: '100%',
        }}
      >
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            setShowError(false);
            handleEmailChange(e);
          }}
          handleBlur={(e: any) => {
            setShowError(false);
            handleEmailBlur(e);
          }}
          value={values.email}
          placeholder="Email address"
          error={errors.email}
          touched={touched.email}
          marginBottom={SPACING_XSMALL}
        />
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            setShowError(false);
            handleUsernameChange(e);
          }}
          handleBlur={(e: any) => {
            setShowError(false);
            handleUsernameBlur(e);
          }}
          value={values.username}
          placeholder="Username"
          error={errors.username}
          touched={touched.username}
          marginBottom={SPACING_XSMALL}
        />
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            setShowError(false);
            handlePasswordChange(e);
          }}
          handleBlur={(e: any) => {
            setShowError(false);
            handlePasswordBlur(e);
          }}
          value={values.password}
          placeholder="Password"
          error={errors.password}
          touched={touched.password}
          secureTextEntry={true}
          marginBottom={SPACING_XSMALL}
        />
        {showErrorMessage && errorMessage && (
          <AppError
            message={errorMessage}
            marginBottom={SPACING_XSMALL}
          ></AppError>
        )}
        <AppButton
          color={BUTTON_COLOR_PRIMARY}
          disabled={buttonDisabled}
          text={'Sign Up'}
          handlePress={handleSubmit}
          marginBottom={SPACING_XSMALL}
        ></AppButton>

        <View style={{ flexDirection: 'row' }}>
          <Text>Already have an account? </Text>

          <AppText
            isLink={true}
            handlePress={() => setLoggedOutPage(LoggedOutPage.LOGIN)}
          >
            Login
          </AppText>
        </View>
      </View>
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
