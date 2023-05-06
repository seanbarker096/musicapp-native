import { LoggedOutPage } from 'app/App';
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
import { useLoginMutation } from 'store/auth/auth.queries';
import { AuthState } from 'store/auth/auth.types';

type LoginProps = {
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
  setLoggedOutPage: React.Dispatch<
    React.SetStateAction<LoggedOutPage | undefined>
  >;
};

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: FC<LoginProps> = ({ setAuthState, setLoggedOutPage }) => {
  const mutatation = useLoginMutation();

  const handleFormSubmit = async ({ username, password }: LoginFormValues) => {
    const result = await mutatation.mutateAsync({ username, password });

    setAuthState(result.authState);
    // Set to session expired for next time authState.status beomes AuthStatus.UNAUTHENTICATED
    setLoggedOutPage(undefined);
  };

  return (
    <>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={{ margin: 10 }}>
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
              title="Submit"
            />
          </View>
        )}
      </Formik>
      <Text>Don't have an account?</Text>
      <Pressable onPress={() => setLoggedOutPage(LoggedOutPage.SIGN_UP)}>
        <AppText>Sign Up</AppText>
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
export default Login;
