import { AppText } from 'components/app-text';
import { FormikProps } from 'formik';
import { StyleSheet, TextInput } from 'react-native';
import {
  BORDER_COLOR,
  COLOR_ERROR,
  COLOR_NEUTRAL_XXLIGHT,
  SPACING_XSMALL,
  SPACING_XXXSMALL,
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
      {touched && error && (
        <AppText
          padding={SPACING_XSMALL}
          textColor={COLOR_ERROR}
        >
          {error}
        </AppText>
      )}
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
