import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { AppText } from 'components/app-text';
import { FC, useState } from 'react';
import { Platform, TextInput } from 'react-native';

export type DateInputProps = {
  inputTitle: string;
  value: Date | undefined;
  handleDateSelected: (date?: Date) => void;
};

export const DateInput: FC<DateInputProps> = ({
  inputTitle,
  value,
  handleDateSelected,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();

  function handleDateInputPress() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value ?? today,
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
      <TextInput
        style={{
          width: '100%',
          display: 'flex',
        }}
        onPressIn={handleDateInputPress}
        value={value ? value.toLocaleDateString() : undefined}
        placeholder="DD/MM/YYYY"
      />
      {showDatePicker && (
        <DateTimePicker
          value={value ?? today}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};
