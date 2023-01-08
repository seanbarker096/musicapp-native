import { Link, ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { FC, useContext } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useLoginMutation } from 'store/auth/auth.queries';

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

    setAuthState(result.authState);
  };

  return (
    <>
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
