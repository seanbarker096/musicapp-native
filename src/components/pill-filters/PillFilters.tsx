import { FC } from 'react';
import { View } from 'react-native';
import { FormControl } from 'utils/form-controls';
import { PillFilterItem } from './pill-filter-item/PillFilterItem';

export interface PillFiltersProps {
  controls: FormControl<boolean>[];
  valueChanged: (
    updatedControl: FormControl<boolean>,
    newValue: boolean,
  ) => void;
}

export const PillFilters: FC<PillFiltersProps> = ({
  controls,
  valueChanged,
}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {controls.map((control, index) => {
        return (
          <PillFilterItem
            key={index}
            control={control}
            valueChanged={valueChanged}
          ></PillFilterItem>
        );
      })}
    </View>
  );
};
export { FormControl };
