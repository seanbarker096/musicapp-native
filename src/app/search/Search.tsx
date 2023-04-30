import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PerformerSearch } from 'components/performer-search';
import { PillFilters } from 'components/pill-filters/PillFilters';
import { UserSearch } from 'components/user-search';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Performer } from 'store/performers';
import { User } from 'store/users/users.types';
import { FormControl, useFormGroup } from 'utils/form-controls';
import { InternalSearchStackScreenParamList } from './search-types';

type SearchProps = NativeStackScreenProps<
  InternalSearchStackScreenParamList,
  'Search'
>;

type SearchFilterGroup = {
  Artist: boolean;
  User: boolean;
};

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
const Search: FC<SearchProps> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const { controls, setFormGroupRawValues, formGroupRawValues } = useFormGroup<
    boolean,
    SearchFilterGroup
  >({
    Artist: true,
    User: false,
  });

  const selectedFilter = controls.find(control => control.value)?.field as
    | 'Artist'
    | 'User';

  const navigateToPerformerProfile = (performer: Performer) =>
    navigation.navigate('SearchProfile', {
      profileType: ProfileType.PERFORMER,
      profileId: performer.id,
    });

  const navigateToUserProfile = (user: User) =>
    navigation.navigate('SearchProfile', {
      profileType: ProfileType.USER,
      profileId: user.id,
    });

  // user types a new character

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

  function handleSearchTermChange(term: string) {
    setSearchTerm(term);
  }

  return (
    <View style={styles.container}>
      <PillFilters
        controls={controls}
        valueChanged={handleFormControlValueChanged}
      ></PillFilters>
      {selectedFilter === 'Artist' && (
        <PerformerSearch
          searchTermChanged={handleSearchTermChange}
          searchTerm={searchTerm}
          onPerformerSelected={navigateToPerformerProfile}
        ></PerformerSearch>
      )}
      {selectedFilter === 'User' && (
        <UserSearch
          searchTermChanged={handleSearchTermChange}
          onUserSelected={navigateToUserProfile}
          searchTerm={searchTerm}
        ></UserSearch>
      )}
    </View>
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
