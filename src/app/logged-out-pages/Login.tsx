import { LoggedOutPage } from 'app/app-types';
import { AppButton } from 'components/app-button';
import { AppError } from 'components/app-error';
import { AppText } from 'components/app-text';
import { AppTextInput } from 'components/form-components';
import { ResetPasswordModal } from 'components/reset-password-modal';

import { useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
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
      setLoggedOutPage(undefined);
      setAuthState(result.authState);
      console.log(result.authState);
    },
  });

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined,
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    switch (error?.error_code) {
      case 'USER_NOT_FOUND':
        setErrorMessage('Username or email does not exist');
        break;
      case 'UNAUTHORIZED':
        setErrorMessage('Incorrect password!');
        break;
      case 'UNKNOWN_ERROR':
        setErrorMessage('Unknown error');
        break;
      default:
        setErrorMessage(undefined);
    }
  }, [error?.error_code]);

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
            handleUsernameOrEmailChange(e);
          }}
          handleBlur={(e: any) => {
            handleUsernameOrEmailBlur(e);
          }}
          handleFocus={() => setErrorMessage(undefined)}
          value={values.usernameOrEmail}
          placeholder="Username or email address"
          error={errors.usernameOrEmail}
          touched={touched.usernameOrEmail}
          marginBottom={SPACING_XSMALL}
          borderless={false}
        />
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            handlePasswordChange(e);
          }}
          handleFocus={() => setErrorMessage(undefined)}
          handleBlur={(e: any) => {
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
        {!!errorMessage && (
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
          <AppText size="large">Don't have an account? </AppText>

          <AppText
            size="large"
            isLink={true}
            handlePress={() => setLoggedOutPage(LoggedOutPage.SIGN_UP)}
          >
            Sign Up
          </AppText>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <AppText size="large">Forgotten your password? </AppText>

          <AppText
            size="large"
            isLink={true}
            handlePress={() => setIsOpen(true)}
          >
            Get help signing in
          </AppText>
        </View>
        <Modal
          visible={isOpen}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <ResetPasswordModal></ResetPasswordModal>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
  },
});

export default Login;
