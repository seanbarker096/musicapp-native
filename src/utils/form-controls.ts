import { useState } from 'react';

export interface FormControl<S> {
  field: string;
  value: S;
}

/**
 * Creates a form group.
 *
 * A form group is a collection of form controls, which can be used to easily manage form state. Examples include managing the state of a group of pressable/clickable filters. Users of this hook can decide what to do with updates to each form control by wrapping setFormGroupRawValues in their own functions within the React component using the hook.
 *
 * @param formObject An object which defines the form control fields, and their initial value
 *
 */
export function useFormGroup<
  S extends boolean | string | number,
  X extends { [key: string]: S },
>(
  formObject: X,
): {
  controls: FormControl<S>[];
  setFormGroupRawValues: React.Dispatch<React.SetStateAction<X>>;
  formGroupRawValues: X;
} {
  const keys = Object.keys(formObject);

  const [formGroupRawValues, setFormGroupRawValues] = useState<X>({
    ...formObject,
  });

  const controls = keys.map(key => ({
    value: formGroupRawValues[key],
    field: key,
  }));

  return {
    controls,
    setFormGroupRawValues,
    formGroupRawValues,
  };
}
