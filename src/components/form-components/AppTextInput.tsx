import { AppText } from 'components/app-text';
import { FormikProps } from 'formik';
import { StyleSheet, TextInput, View } from 'react-native';
import { COLOR_ERROR, COLOR_NEUTRAL_XXLIGHT, SPACING_XXSMALL } from 'styles';

export const AppTextInput: React.FC<FormikProps<{ [key: string]: any }>> = ({
  handleChange,
  handleBlur,
  value,
  placeholder,
  error,
  touched,
  secureTextEntry = false,
  marginBottom = 0,
}) => {
  return (
    <View style={{ minHeight: styles.input.height, marginBottom }}>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 3,
          backgroundColor: COLOR_NEUTRAL_XXLIGHT,
          paddingLeft: SPACING_XXSMALL,
          paddingRight: SPACING_XXSMALL,
        }}
        onChangeText={handleChange}
        onBlur={handleBlur}
        value={value}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
      {touched && error && <AppText textColor={COLOR_ERROR}>{error}</AppText>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40 + 20, // 40 for text input, 20 for error text
  },
});
