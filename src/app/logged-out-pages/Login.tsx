import { LoggedOutPage } from 'app/App';
import { AppButton } from 'components/app-button';
import { AppText } from 'components/app-text';
import { AppTextInput } from 'components/form-components';

import { useFormik } from 'formik';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLoginMutation } from 'store/auth/auth.queries';
import { AuthState } from 'store/auth/auth.types';
import { BUTTON_COLOR_PRIMARY, SPACING_XSMALL } from 'styles';
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

        const usernameRegex = /^[a-zA-Z0-9._-]{6,30}$/;

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

  const handleFormSubmit = async ({
    usernameOrEmail,
    password,
  }: LoginFormValues) => {
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

  const buttonDisabled = isSubmitting || !isValid || !dirty;

  return (
    <>
      <View style={{ margin: 10 }}>
        <AppTextInput
          handleChange={handleChange('usernameOrEmail')}
          handleBlur={handleBlur('usernameOrEmail')}
          value={values.usernameOrEmail}
          placeholder="Username or email address"
          error={errors.usernameOrEmail}
          touched={touched.usernameOrEmail}
          marginBottom={SPACING_XSMALL}
        />
        <AppTextInput
          handleChange={handleChange('password')}
          handleBlur={handleBlur('password')}
          value={values.password}
          placeholder="Password"
          error={errors.password}
          touched={touched.password}
          marginBottom={SPACING_XSMALL}
        />
        <AppButton
          color={BUTTON_COLOR_PRIMARY}
          disabled={buttonDisabled}
          text={'Login'}
          onPress={handleSubmit}
          marginBottom={SPACING_XSMALL}
        ></AppButton>
        <View style={{ flexDirection: 'row' }}>
          <Text>Don't have an account? </Text>

          <AppText
            isLink={true}
            handlePress={() => setLoggedOutPage(LoggedOutPage.SIGN_UP)}
          >
            Sign Up
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

