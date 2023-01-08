import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { Formik } from 'formik';
import React, { FC, useContext } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useLoginMutation } from 'store/auth/auth.queries';
import { loginResultToAuthState } from 'store/auth/auth.transformations';

type LoginProps = NativeStackScreenProps<ParamListBase>;

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: FC<LoginProps> = () => {
  const { setAuthState } = useContext(AuthStateContext);
  const mutatation = useLoginMutation();

  const handleFormSubmit = async ({ username, password }: LoginFormValues) => {
    const result = await mutatation.mutateAsync({ username, password });

    const authState = loginResultToAuthState(result);

    setAuthState(authState);

    await SecureStore.setItemAsync('refresh_token', result.refresh_token);
    await SecureStore.setItemAsync('access_token', result.access_token);
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleFormSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
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
