import { FC } from 'react';
import { View } from 'react-native';
import { SPACING_NONE, SPACING_XSMALL, SPACING_XXSMALL } from 'styles';
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
    <View style={{ flexDirection: 'row', marginBottom: SPACING_XXSMALL }}>
      {controls.map((control, index) => {
        return (
          <PillFilterItem
            key={index}
            control={control}
            valueChanged={valueChanged}
            marginRight={
              index === controls.length - 1 ? SPACING_NONE : SPACING_XSMALL
            }
          ></PillFilterItem>
        );
      })}
    </View>
  );
};
export { FormControl };
