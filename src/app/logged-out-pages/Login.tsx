import { LoggedOutPage } from 'app/app-types';
import { AppButton } from 'components/app-button';
import { AppError } from 'components/app-error';
import { AppText } from 'components/app-text';
import { AppTextInput } from 'components/form-components';

import { useFormik } from 'formik';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLoginMutation } from 'store/auth/auth.queries';
import { AuthState } from 'store/auth/auth.types';
import {
  BUTTON_COLOR_PRIMARY,
  COLOR_NEUTRAL_XXXXLIGHT,
  SPACING_LARGE,
  SPACING_XSMALL,
} from 'styles';
import * as Yup from 'yup';

type LoginProps = {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
  setLoggedOutPage: React.Dispatch<
    React.SetStateAction<LoggedOutPage | undefined>
  >;
};

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const loginFormSchema = Yup.object({
  usernameOrEmail: Yup.string()
    .required('Required')
    .test(
      'is-email-or-username',
      'Must be a valid email address or username',
      value => {
        if (!value) {
          return false;
        }

        const usernameRegex = /^[a-zA-Z0-9._-]{2,30}$/;

        return emailRegex.test(value) || usernameRegex.test(value);
      },
    ),
  password: Yup.string().required('Required'),
});

interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
}

const Login: FC<LoginProps> = ({ setAuthState, setLoggedOutPage }) => {
  const { mutate, error } = useLoginMutation({
    onSuccess: result => {
      setAuthState(result.authState);
      setLoggedOutPage(undefined);
    },
  });

  const [showErrorMessage, setShowErrorMessage] = React.useState(false);

  let errorMessage;

  switch (error?.error_code) {
    case 'USER_NOT_FOUND':
      errorMessage = 'Username or email does not exist';
      break;
    case 'UNAUTHORIZED':
      errorMessage = 'Incorrect password!';
      break;
    case 'UNKNOWN_ERROR':
      errorMessage = 'Unknown error';
    default:
      errorMessage = undefined;
  }

  const handleFormSubmit = async ({
    usernameOrEmail,
    password,
  }: LoginFormValues) => {
    setShowErrorMessage(true);

    const emailEntered = emailRegex.test(usernameOrEmail);

    const email = emailEntered ? usernameOrEmail : undefined;
    const username = emailEntered ? undefined : usernameOrEmail;

    await mutate({ email, username, password });
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
    validationSchema: loginFormSchema,
    initialValues: { usernameOrEmail: '', password: '' },
    onSubmit: handleFormSubmit,
  });

  const handlePasswordChange = handleChange('password');
  const handlePasswordBlur = handleBlur('password');

  const handleUsernameOrEmailChange = handleChange('usernameOrEmail');
  const handleUsernameOrEmailBlur = handleBlur('usernameOrEmail');

  const buttonDisabled = isSubmitting || !isValid || !dirty;

  return (
    <>
      <View
        style={{
          backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
          margin: 10,
          paddingTop: '35%',
          paddingBottom: SPACING_LARGE,
          height: '100%',
        }}
      >
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            setShowErrorMessage(false);
            handleUsernameOrEmailChange(e);
          }}
          handleBlur={(e: any) => {
            setShowErrorMessage(false);
            handleUsernameOrEmailBlur(e);
          }}
          value={values.usernameOrEmail}
          placeholder="Username or email address"
          error={errors.usernameOrEmail}
          touched={touched.usernameOrEmail}
          marginBottom={SPACING_XSMALL}
          borderless={false}
        />
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            setShowErrorMessage(false);
            handlePasswordChange(e);
          }}
          handleBlur={(e: any) => {
            setShowErrorMessage(false);
            handlePasswordBlur(e);
          }}
          value={values.password}
          placeholder="Password"
          error={errors.password}
          touched={touched.password}
          secureTextEntry={true}
          marginBottom={errorMessage ? SPACING_XSMALL : 'auto'}
          borderless={false}
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
          text="Login"
          handlePress={handleSubmit}
          marginBottom={SPACING_XSMALL}
          isSubmitting={isSubmitting}
        ></AppButton>
        <View style={{ flexDirection: 'row', marginBottom: SPACING_XSMALL }}>
          <Text>Don't have an account? </Text>

          <AppText
            isLink={true}
            handlePress={() => setLoggedOutPage(LoggedOutPage.SIGN_UP)}
          >
            Sign Up
          </AppText>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text>Forgotten your password? </Text>

          <AppText
            isLink={true}
            handlePress={() => setLoggedOutPage(LoggedOutPage.SIGN_UP)}
          >
            Get help signing in
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
  errorText: {
    color: 'red',
  },
});
export default Login;
