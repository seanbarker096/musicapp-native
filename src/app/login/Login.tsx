import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { useLoginMutation } from 'store/auth/auth.queries';

type LoginProps = NativeStackScreenProps<ParamListBase>;

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: FC<LoginProps> = ({ navigation }: LoginProps) => {
  const mutatation = useLoginMutation();

  const handleFormSubmit = async ({ username, password }: LoginFormValues) => {
    await mutatation.mutateAsync({ username, password });

    if (mutatation.isSuccess) {
      navigation.navigate('Temp');
    }
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
