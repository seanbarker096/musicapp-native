import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from 'components/app-button';
import { AppError } from 'components/app-error';
import { AppText } from 'components/app-text';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { useSignUpMutation } from 'store/auth/auth.queries';
import { SignUpMutationResult } from 'store/auth/auth.types';
import { APP_GUTTER, SPACING_XSMALL } from 'styles';
import { SignUpStackParamList } from './sign-up.types';

type Props = NativeStackScreenProps<SignUpStackParamList, 'ConfirmSignUp'>;

export const ConfirmSignUp: FC<Props> = ({
  route: {
    params: { username, password, email },
  },
  navigation,
}) => {
  const [submitting, setSubmitting] = React.useState(false);

  const { mutateAsync: signUp, error } = useSignUpMutation({
    onSuccess: ({ authState }: SignUpMutationResult) =>
      navigation.navigate('UploadProfileImage', {
        userId: authState.authUser.userId,
      }),
    onSettled: () => setSubmitting(false),
  });

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    switch (error?.error_code) {
      case 'USER_ALREADY_EXISTS':
        setErrorMessage(
          'An account with this email or username already exists',
        );
        break;
      case 'UNKNOWN_ERROR':
        setErrorMessage('Unknown error');
        break;
      default:
        setErrorMessage(undefined);
    }
  }, [error?.error_code]);

  const handleFormSubmit = async () => {
    setErrorMessage(undefined);
    setSubmitting(true);

    return signUp({ email, username, password });
  };

  return (
    <View
      style={{
        height: '100%',
        padding: APP_GUTTER,
        paddingTop: '35%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <AppText
        size="large"
        weight="bold"
        marginBottom={SPACING_XSMALL}
      >{`Welcome to Gigstory, ${username}`}</AppText>
      <AppButton
        handlePress={handleFormSubmit}
        text="Complete Sign-up"
        isSubmitting={submitting}
        marginBottom={!!errorMessage ? SPACING_XSMALL : undefined}
      ></AppButton>
      {!!errorMessage && (
        <AppError
          message={errorMessage}
          marginBottom={SPACING_XSMALL}
        ></AppError>
      )}
    </View>
  );
};
