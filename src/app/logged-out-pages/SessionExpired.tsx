import { LoggedOutPage, SetLoggedOutPage } from 'app/app-types';
import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { BUTTON_COLOR_PRIMARY, SPACING_SMALL } from 'styles';

type SessionExpiredProps = {
  setLoggedOutPage: SetLoggedOutPage;
};

const SessionExpired: FC<SessionExpiredProps> = ({ setLoggedOutPage }) => {
  function handleLoginPress() {
    setLoggedOutPage(LoggedOutPage.LOGIN);
  }

  function handleSignUpPress() {
    setLoggedOutPage(LoggedOutPage.SIGN_UP);
  }
  return (
    <>
      <AppText>
        Your session has expired. Please login to continue using the application
      </AppText>
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
            color={BUTTON_COLOR_PRIMARY}
            onPress={handleLoginPress}
            title="Login"
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
            onPress={handleSignUpPress}
            title="Sign Up"
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  flexColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  flexRowContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textInput: {},
});

export default SessionExpired;
