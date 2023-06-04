import { AppText } from 'components/app-text';
import { FormikProps } from 'formik';
import { StyleSheet, TextInput, View } from 'react-native';
import { COLOR_ERROR, COLOR_NEUTRAL_XXLIGHT, SPACING_XXSMALL } from 'styles';

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
  marginBottom = 0,
  borderless = true,
}) => {
  return (
    <View style={{ marginBottom }}>
      <TextInput
        style={{
          backgroundColor: COLOR_NEUTRAL_XXLIGHT,
          paddingLeft: SPACING_XXSMALL,
          paddingRight: SPACING_XXSMALL,
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
          padding={SPACING_XXSMALL}
          textColor={COLOR_ERROR}
        >
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40 + 20, // 40 for text input, 20 for error text
  },
  border: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
  },
});
