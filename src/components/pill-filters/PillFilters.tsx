import { AppText } from 'components/app-text';
import { FC } from 'react';
import { Pressable } from 'react-native';

export interface FilterControl<S> {
  value: S;
}

export type FilterFormGroup<T> = {
  controls: Record<keyof T, FilterControl<T[keyof T]>>;
};

export interface PillFiltersProps {
  filterFormGroup: FilterFormGroup<{ performer: boolean; user: boolean }>;
}

export const PillFilters: FC<PillFiltersProps> = ({ filterFormGroup }) => {
  const [formGroupState, setFormControl] =
    useFormGroup<PillFiltersProps['filterFormGroup']>(filterFormGroup);

  const filterFields = Object.keys(formGroupState.controls) as (
    | 'user'
    | 'performer'
  )[];

  const controls = filterFields.map(
    filterField => filterFormGroup.controls[filterField],
  );

  return (
    <>
      {filterFields.map((field, index) => {
        return (
          <Pressable
            onPress={() => setFormControl(field, !!controls[index].value)}
          >
            <AppText>
              {field}: {controls[index].value}
            </AppText>
          </Pressable>
        );
      })}
    </>
  );
};

function useFormGroup<T>(formGroup: FilterFormGroup<T>):  {
  const [formGroupState, setFormGroupState] = useState(formGroup.controls);

  function setFormControl(
    formControlsKey: keyof FilterFormGroup<T>['controls'],
    newValue: FilterFormGroup<T>['controls'][keyof FilterFormGroup<T>['controls']]['value'],
  ) {
    setFormGroupState({
      ...formGroup.controls,
      [formControlsKey]: { value: newValue },
    });
  }

  return [formGroupState, setFormControl];
}
