import { Link } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLoginMutation } from 'store/auth/auth.queries';
import { AuthState } from 'store/auth/auth.types';

interface LoginProps {
  handleLoginSuccess: (authState: AuthState) => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: FC<LoginProps> = ({ handleLoginSuccess }) => {
  const mutatation = useLoginMutation();

  const handleFormSubmit = async ({ username, password }: LoginFormValues) => {
    const result = await mutatation.mutateAsync({ username, password });

    handleLoginSuccess(result.authState);
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
      <Link to={{ screen: 'SignUp' }}>Sign up.</Link>
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
