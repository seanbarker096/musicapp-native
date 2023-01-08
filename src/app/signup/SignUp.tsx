import { Link } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { FC, useContext } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthStateContext } from 'store/auth/auth.contexts';
import { useSignUpMutation } from 'store/auth/auth.queries';

interface SignUpProps {}

const SignUp: FC<SignUpProps> = () => {
  const { setAuthState } = useContext(AuthStateContext);
  const mutatation = useSignUpMutation();

  const handleFormSubmit = async ({
    email,
    username,
    firstName,
    secondName,
    password,
  }: SignUpFormValues) => {
    const { authState } = await mutatation.mutateAsync({
      email,
      username,
      firstName,
      secondName,
      password,
    });

    setAuthState(authState);
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          username: '',
          firstName: '',
          secondName: '',
          password: '',
        }}
        onSubmit={handleFormSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              style={styles.text}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder="email"
            />
            <TextInput
              style={styles.text}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              placeholder="username"
            />
            <TextInput
              style={styles.text}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              placeholder="firstName"
            />
            <TextInput
              style={styles.text}
              onChangeText={handleChange('secondName')}
              onBlur={handleBlur('secondName')}
              value={values.secondName}
              placeholder="secondName"
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
              title="Sign Up"
            />
          </View>
        )}
      </Formik>
      <Text>Already have an account?</Text>
      <Link to={{ screen: 'Login' }}>Login</Link>
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

export default SignUp;
