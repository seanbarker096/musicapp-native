import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/logged-out-page.contexts';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { AuthStatus, AuthUserRole } from 'store/auth/auth.types';
import { useUsersUpdateMutation } from 'store/users';
import {
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  SPACING_SMALL,
} from 'styles';
import { SignUpStackParamList } from './sign-up.types';

type Props = NativeStackScreenProps<SignUpStackParamList, 'CreateBio'>;

export const CreateBio: FC<Props> = ({
  route: {
    params: { userId },
  },
}) => {
  const { setAuthState, setLoggedOutPage } = React.useContext(
    SignUpPageStateSettersContext,
  );

  const {
    mutate,
    isLoading: updateUserLoading,
    error: updateUserError,
  } = useUsersUpdateMutation({
    userId,
    onSuccess: updateAuthState,
  });

  async function handleSubmit({ bio }: { bio: string }) {
    mutate({
      bio,
    });
  }

  function updateAuthState() {
    // Set auth state to logged in provided user was created successfully in main sign up screen
    setAuthState({
      status: AuthStatus.AUTHENTICATED,
      authUser: {
        userId,
        role: AuthUserRole.USER,
      },
    });

    setLoggedOutPage(undefined);
  }

  return (
    <Formik
      initialValues={{
        bio: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <TextInput
            style={styles.text}
            onChangeText={handleChange('bio')}
            onBlur={handleBlur('bio')}
            value={values.bio}
            // TODO: Make multiline and include emojis
            placeholder="e.g. London, United Kingdom."
          />

          <View
            style={{
              ...styles.flexRowContainer,
              marginTop: 'auto',
            }}
          >
            <View
              style={{
                flexGrow: 1,
                flexShrink: 0,
                marginRight: SPACING_SMALL,
              }}
            >
              <Button
                color={BUTTON_COLOR_DISABLED}
                onPress={updateAuthState}
                title="Skip"
              ></Button>
            </View>
            <View
              style={{
                flexGrow: 1,
                flexShrink: 0,
              }}
            >
              <Button
                color={BUTTON_COLOR_PRIMARY}
                onPress={handleSubmit}
                title="Submit"
              ></Button>
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  flexColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexRowContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textInput: {},
  text: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
