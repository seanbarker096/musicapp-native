import { LoggedOutPage, SetLoggedOutPage } from 'app/app-types';
import { AppText } from 'components/app-text';
import React, { FC } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import {
  APP_GUTTER,
  BUTTON_COLOR_PRIMARY,
  COLOR_NEUTRAL_XXXXLIGHT,
  SPACING_LARGE,
  SPACING_SMALL,
} from 'styles';

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
    <View
      style={{
        backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
        margin: 10,
        padding: APP_GUTTER,
        paddingTop: SPACING_LARGE,
        paddingBottom: SPACING_LARGE,
        height: '100%',
      }}
    >
      <AppText marginBottom={SPACING_SMALL}>
        Your session has expired. Please login to continue using the application
      </AppText>
      <View
        style={{
          ...styles.flexRowContainer,
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
    </View>
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
