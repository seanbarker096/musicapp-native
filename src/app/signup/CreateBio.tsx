import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpPageStateSettersContext } from 'app/logged-out-pages/logged-out-page.contexts';
import { AppButton } from 'components/app-button';
import { AppText } from 'components/app-text';
import { AppTextInput } from 'components/form-components';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AuthStatus, AuthUserRole } from 'store/auth/auth.types';
import { useUsersUpdateMutation } from 'store/users';
import {
  APP_GUTTER,
  BUTTON_COLOR_DISABLED,
  BUTTON_COLOR_PRIMARY,
  SPACING_MID,
  SPACING_SMALL,
} from 'styles';
import * as Yup from 'yup';
import { SignUpStackParamList } from './sign-up.types';

type Props = NativeStackScreenProps<SignUpStackParamList, 'CreateBio'>;

const formSchema = Yup.object({
  biography: Yup.string()
    .required()
    .max(150, 'Must be less than 150 characters'),
});

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

  async function onFormSubmit({ biography }: { biography: string }) {
    mutate({
      bio: biography,
    });
  }

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
    setFieldTouched,
    isValid,
    dirty,
  } = useFormik({
    validationSchema: formSchema,
    initialValues: { biography: '' },
    onSubmit: onFormSubmit,
  });

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

  const handleBioBlur = handleBlur('biography');

  const handleBioChange = handleChange('biography');

  const buttonDisabled = isSubmitting || !isValid || !dirty;

  return (
    <View style={{ flex: 1 }}>
      {/**View component needed to ensure KeyboardAvoidingView works correctly */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            padding: APP_GUTTER,
            paddingTop: '25%',
          }}
          showsVerticalScrollIndicator={false}
        >
          <AppText
            size="large"
            marginBottom={SPACING_MID}
          >
            Tell us about yourself
          </AppText>

          <AppTextInput
            handleChange={(e: string | React.ChangeEvent<any>) => {
              setFieldTouched('biography', true, true);
              handleBioChange(e);
            }}
            handleBlur={(e: any) => {
              handleBioBlur(e);
            }}
            value={values.biography}
            placeholder="e.g. 21 year old from London. I love 90's hip hop..."
            error={errors.biography}
            touched={touched.biography}
            borderless={false}
            multiline={true}
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
              <AppButton
                color={BUTTON_COLOR_DISABLED}
                text="Skip"
                handlePress={updateAuthState}
              ></AppButton>
            </View>
            <View
              style={{
                flexGrow: 1,
                flexShrink: 0,
              }}
            >
              <AppButton
                color={BUTTON_COLOR_PRIMARY}
                disabled={buttonDisabled}
                text="Submit"
                handlePress={handleSubmit}
                isSubmitting={isSubmitting}
              ></AppButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
