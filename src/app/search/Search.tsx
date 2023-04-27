import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { PerformerSearch } from 'components/performer-search';
import { PillFilters } from 'components/pill-filters/PillFilters';
import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Performer } from 'store/performers';
import { FormControl, useFormGroup } from 'utils/form-controls';
import { InternalSearchStackScreenParamList } from './search-types';

type SearchProps = NativeStackScreenProps<
  InternalSearchStackScreenParamList,
  'search'
>;

type SearchFilterGroup = {
  Artist: boolean;
  User: boolean;
};

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
const Search: FC<SearchProps> = ({ navigation }) => {
  const onPerformerSearchGetOrCreateSuccess = (performer: Performer) =>
    navigation.navigate('profileInternalStackScreen', {
      profileType: ProfileType.PERFORMER,
      profileId: performer.id,
    });

  const { controls, setFormGroupRawValues, formGroupRawValues } = useFormGroup<
    boolean,
    SearchFilterGroup
  >({
    Artist: false,
    User: false,
  });

  function handleFormControlValueChanged(
    updatedControl: FormControl<boolean>,
    newValue: boolean,
  ) {
    const otherControls = Object.keys(formGroupRawValues).filter(
      filterField => filterField !== updatedControl.field,
    );

    const newOtherFilterValues = otherControls.reduce(
      (otherControlsObject, otherControl) => ({
        ...otherControlsObject,
        [otherControl]: !newValue,
      }),
      {} as SearchFilterGroup,
    );

    setFormGroupRawValues({
      ...newOtherFilterValues,
      [updatedControl.field]: newValue,
    });
  }

  return (
    <>
      <View style={styles.container}>
        <PillFilters
          controls={controls}
          valueChanged={handleFormControlValueChanged}
        ></PillFilters>
        {formGroupRawValues.Artist && (
          <PerformerSearch
            onPerformerSelect={onPerformerSearchGetOrCreateSuccess}
          ></PerformerSearch>
        )}
        {formGroupRawValues.User && <AppText>tEST</AppText>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    width: '100%',
  },
  text: {
    height: 40,
    borderWidth: 1,
    width: '100%',
  },
});

export default Search;


