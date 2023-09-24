import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { AppText } from 'components/app-text';
import { FC, useState } from 'react';
import { Platform, Text } from 'react-native';
import { COLOR_ERROR, SPACING_XXXSMALL } from 'styles';

export type DateInputProps = {
  inputTitle: string;
  value: Date | undefined | string; // Typically the date emitted by handleDateSelected, as we should use this as a controlled component. We accept strings so we can use it with Formik
  handleDateSelected: (date?: Date) => void;
  handleBlur?: () => void;
  touched: boolean;
  error?: string;
};

/**
 * A component that allows the selection of a date. The selected vlaue is emitted to parents as a Date object. Changes in the selected date are emitted to parent components as a Date object. We display the value in the locale string, which will vary depending on the users location.
 */
export const DateInput: FC<DateInputProps> = ({
  inputTitle,
  value,
  handleDateSelected,
  handleBlur,
  touched,
  error,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();

  function handleDateInputPress() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: !value ? today : isDate(value) ? value : new Date(value),
        onChange: handleDateChange,
        mode: 'date',
        is24Hour: true,
      });
    }
  }

  function handleDateChange(event: DateTimePickerEvent, date?: Date) {
    if (event.type === 'set') {
      handleDateSelected(date);
    }

    setShowDatePicker(false);
  }

  return (
    <>
      <AppText
        weight="bold"
        marginBottom={SPACING_XXXSMALL}
      >
        {inputTitle}
      </AppText>
      {Platform.OS === 'android' && (
        <Text
          // We cant use TextInput here sa we dont want the user to be able to edit the field other than via DatePicker, so we have to makeshift a placeholder and the corresponding text color
          style={{
            width: '100%',
            display: 'flex',
            color: value ? 'black' : 'grey',
          }}
          onPress={handleDateInputPress}
          onPressOut={handleBlur}
        >
          {!value
            ? 'DD/MM/YY'
            : isDate(value)
            ? value.toLocaleDateString()
            : new Date(value).toLocaleDateString()}
        </Text>
      )}
      {Platform.OS !== 'android' && (
        <DateTimePicker
          value={!value ? today : isDate(value) ? value : new Date(value)}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
      {touched && error && <AppText textColor={COLOR_ERROR}>{error}</AppText>}
    </>
  );
};

function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}
