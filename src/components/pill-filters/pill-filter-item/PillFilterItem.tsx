import { AppText } from 'components/app-text';
import { Pressable, StyleSheet } from 'react-native';
import {
  BORDER_COLOR,
  COLOR_NEUTRAL_XXXXLIGHT,
  COLOR_PRIMARY_DARK,
  COLOR_XXXXDARK,
} from 'styles';
import { FormControl } from 'utils/form-controls';

export const PillFilterItem = ({
  valueChanged,
  control,
  marginRight,
}: {
  valueChanged: (
    updatedControl: FormControl<boolean>,
    newValue: boolean,
  ) => void;
  control: FormControl<boolean>;
  marginRight?: number;
}) => {
  return (
    <Pressable
      style={{
        ...styles.pill,
        backgroundColor: control.value ? COLOR_PRIMARY_DARK : 'transparent',
        borderColor: control.value ? 'transparent' : BORDER_COLOR,
        alignItems: 'center',
        marginRight,
      }}
      onPress={() => valueChanged(control, !control.value)}
    >
      <AppText
        textColor={control.value ? COLOR_NEUTRAL_XXXXLIGHT : COLOR_XXXXDARK}
      >
        {control.field}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    display: 'flex',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 5,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

