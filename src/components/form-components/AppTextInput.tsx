import { AppText } from 'components/app-text';
import { FormikProps } from 'formik';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  BORDER_COLOR,
  COLOR_ERROR,
  COLOR_NEUTRAL_XXLIGHT,
  SPACING_SMALL,
  SPACING_XXXSMALL,
  TEXT_SIZE_REGULAR,
} from 'styles';

export const AppTextInput: React.FC<
  FormikProps<{ [key: string]: any }> & {
    borderless: boolean;
    renderValidationErrors: boolean;
    backgroundColor: string;
  }
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
  backgroundColor = COLOR_NEUTRAL_XXLIGHT,
}) => {
  return (
    <>
      <TextInput
        style={{
          width: '100%',
          paddingRight: SPACING_XXXSMALL,
          paddingLeft: SPACING_XXXSMALL,
          backgroundColor,
          ...(borderless ? {} : styles.border),
        }}
        onChangeText={handleChange}
        onBlur={handleBlur}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={true} // Enable multiline input
        numberOfLines={3} // Set the desired number of visible lines
        backgroundColor={backgroundColor}
        textAlignVertical="top"
      />

      {renderValidationErrors && (
        <View
          style={{
            minHeight: TEXT_SIZE_REGULAR + SPACING_SMALL,
            width: '100%',
          }}
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
