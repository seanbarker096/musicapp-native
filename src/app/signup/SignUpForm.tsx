import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoggedOutPage } from 'app/app-types';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/logged-out-page.contexts';
import { AppButton } from 'components/app-button';
import { AppText } from 'components/app-text';
import {
  AppTextInput,
  emailValidator,
  passwordValidator,
  usernameValidator,
} from 'components/form-components';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  BUTTON_COLOR_PRIMARY,
  COLOR_NEUTRAL_XXXXLIGHT,
  SPACING_LARGE,
  SPACING_MID,
  SPACING_XSMALL,
} from 'styles';
import * as Yup from 'yup';
import { SignUpStackParamList } from './sign-up.types';

export interface SignUpFormValues {
  email: string;
  username: string;
  password: string;
}

type SignUpProps = NativeStackScreenProps<SignUpStackParamList, 'SignUpForm'>;

const appLogo = require('./../../assets/gigstory.png');

const signupFormSchema = Yup.object({
  email: emailValidator,
  username: usernameValidator.required('Required'),
  password: passwordValidator,
});

export const SignUpForm: FC<SignUpProps> = ({ navigation: { navigate } }) => {
  const { setLoggedOutPage } = React.useContext(SignUpPageStateSettersContext);

  const handleFormSubmit = async ({
    email,
    username,
    password,
  }: SignUpFormValues) => {
    navigate('ConfirmSignUp', { email, username, password });
  };

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
    setFieldTouched,
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

  return (
    <>
      <View
        style={{
          backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
          margin: 10,
          alignItems: 'stretch',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingBottom: SPACING_LARGE,
          height: '100%',
        }}
      >
        <Image
          source={appLogo}
          style={styles.image}
        />
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            setFieldTouched('email', true, true);
            handleEmailChange(e);
          }}
          handleBlur={(e: any) => {
            handleEmailBlur(e);
          }}
          value={values.email}
          placeholder="Email address"
          error={errors.email}
          touched={touched.email}
          marginBottom={SPACING_XSMALL}
          borderless={false}
        />
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            setFieldTouched('username', true, true);
            handleUsernameChange(e);
          }}
          handleBlur={(e: any) => {
            handleUsernameBlur(e);
          }}
          value={values.username}
          placeholder="Username"
          error={errors.username}
          touched={touched.username}
          marginBottom={SPACING_XSMALL}
          borderless={false}
        />
        <AppTextInput
          handleChange={(e: string | React.ChangeEvent<any>) => {
            setFieldTouched('password', true, true);
            handlePasswordChange(e);
          }}
          handleBlur={(e: any) => {
            handlePasswordBlur(e);
          }}
          value={values.password}
          placeholder="Password"
          error={errors.password}
          touched={touched.password}
          secureTextEntry={true}
          marginBottom={SPACING_XSMALL}
          borderless={false}
        />
        <AppButton
          color={BUTTON_COLOR_PRIMARY}
          disabled={buttonDisabled}
          text={'Sign Up'}
          handlePress={handleSubmit}
          marginBottom={SPACING_XSMALL}
          isSubmitting={isSubmitting}
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
  image: {
    height: 170,
    width: 170,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: SPACING_MID,
  },
});
