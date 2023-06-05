import { AppText } from 'components/app-text';
import { FormikProps } from 'formik';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  BORDER_COLOR,
  COLOR_ERROR,
  COLOR_NEUTRAL_XXLIGHT,
  SPACING_SMALL,
  SPACING_XSMALL,
  SPACING_XXXSMALL,
  TEXT_SIZE_REGULAR,
} from 'styles';

export const AppTextInput: React.FC<
  FormikProps<{ [key: string]: any }> & { borderless: boolean }
> = ({
  handleChange,
  handleBlur,
  value,
  placeholder,
  error,
  touched,
  secureTextEntry = false,
  borderless = true,
  renderValidationErrors = true,
}) => {
  return (
    <>
      <TextInput
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          backgroundColor: COLOR_NEUTRAL_XXLIGHT,
          paddingLeft: SPACING_XSMALL,
          paddingRight: SPACING_XSMALL,
          paddingTop: SPACING_XXXSMALL,
          paddingBottom: SPACING_XXXSMALL,
          ...(borderless ? {} : styles.border),
        }}
        onChangeText={handleChange}
        onBlur={handleBlur}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
      <View
        style={{ minHeight: TEXT_SIZE_REGULAR + SPACING_SMALL, width: '100%' }}
      >
        {touched && error && (
          <AppText
            padding={SPACING_XXXSMALL}
            textColor={COLOR_ERROR}
          >
            {error}
          </AppText>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  border: {
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRadius: 3,
  },
});
