import { AppText } from 'components/app-text';
import { FormikProps } from 'formik';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  BORDER_COLOR,
  COLOR_ERROR,
  COLOR_NEUTRAL_XXLIGHT,
  COLOR_TRANSPARENT,
  SPACING_NONE,
  SPACING_SMALL,
  SPACING_XXXSMALL,
  TEXT_SIZE_REGULAR,
} from 'styles';

export const AppTextInput: React.FC<
  FormikProps<{ [key: string]: any }> & {
    borderless: boolean;
    renderValidationErrors: boolean;
    expandOnValidationError: boolean;
    backgroundColor: string;
    /**
     * Will not work if multiline is true
     */
    secureTextEntry: boolean;
    multiline: boolean;
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
  expandOnValidationError = false,
  backgroundColor = COLOR_NEUTRAL_XXLIGHT,
  multiline = false,
}) => {
  return (
    <>
      <View // this is needed for some reason to get multiline wrapping of text to work
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        <TextInput
          style={{
            flexDirection: 'column',
            alignItems: 'stretch', // ensures text container grows in height as new lines are added
            width: '100%',
            paddingHorizontal: SPACING_XXXSMALL,
            paddingVertical:
              backgroundColor === COLOR_TRANSPARENT || borderless
                ? SPACING_NONE
                : SPACING_XXXSMALL,
            backgroundColor,
            ...(borderless ? {} : styles.border),
            fontFamily: 'Quicksand',
          }}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={value}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          multiline={multiline} // Enable multiline input
          numberOfLines={multiline ? 1 : undefined} // This is required to make multiline work, but numberOfLines doesnt actually seem to actually limit the number of lines
          backgroundColor={backgroundColor}
          textAlignVertical="center"
        />
      </View>
      {renderValidationErrors && (
        <View
          style={{
            minHeight: expandOnValidationError
              ? 0
              : TEXT_SIZE_REGULAR + SPACING_SMALL,
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
