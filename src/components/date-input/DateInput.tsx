import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { AppText } from 'components/app-text';
import { FC, useState } from 'react';
import { Platform, Text } from 'react-native';
import { COLOR_ERROR } from 'styles';

export type DateInputProps = {
  inputTitle: string;
  value: Date | undefined | string; // We accept strings so we can use it with Formik
  handleDateSelected: (date?: Date) => void;
  handleBlur?: () => void;
  touched: boolean;
  error?: string;
};

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
    } else {
      setShowDatePicker(true);
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
      <AppText>{inputTitle}</AppText>
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
          : value}
      </Text>

      {touched && error && <AppText textColor={COLOR_ERROR}>{error}</AppText>}
      {showDatePicker && (
        <DateTimePicker
          value={!value ? today : isDate(value) ? value : new Date(value)}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};

function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}