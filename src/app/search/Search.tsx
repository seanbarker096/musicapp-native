import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from 'components/app-text';
import { PerformerSearchCard } from 'components/performer-search-card';
import { PillFilters } from 'components/pill-filters/PillFilters';
import { SearchBar } from 'components/search';
import { UserSearchCard } from 'components/user-search-card';
import { ProfileType } from 'contexts/profile.context';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Performer, PerformerSearchPerformer } from 'store/performers';
import {
  usePerformerGetOrCreateQuery,
  usePerformersSearchQuery,
} from 'store/performers/performers.queries';
import { userUsersSearchQuery } from 'store/users';
import { User } from 'store/users/users.types';
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
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [selectedSearchPerformer, setSelectedSearchPerformer] = useState<
    PerformerSearchPerformer | undefined
  >(undefined);

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
    navigation.navigate('searchProfile', {
      profileType: ProfileType.PERFORMER,
      profileId: performer.id,
    });

  const navigateToUserProfile = (user: User) =>
    navigation.navigate('searchProfile', {
      profileType: ProfileType.USER,
      profileId: user.id,
    });

  // user types a new character
  const {
    data: searchPerformers,
    isLoading: performersSearchLoading,
    isError: isPerformersSearchError,
  } = usePerformersSearchQuery({
    searchQuery: searchTerm,
    enabled: !!searchTerm && selectedFilter === 'Artist',
  });

  const {
    data: performer,
    isLoading: performersGetOrCreateLoading,
    isError: isPerformersGetOrCreateError,
  } = usePerformerGetOrCreateQuery({
    performerUUID: selectedSearchPerformer?.uuid,
    enabled:
      !!searchTerm && selectedFilter === 'Artist' && !!selectedSearchPerformer,
    onSuccess: navigateToPerformerProfile,
  });

  const {
    data: users,
    isLoading: userLoading,
    error: usersGetError,
  } = userUsersSearchQuery({
    queryParams: {
      searchQuery: searchTerm,
    },
    enabled: !!searchTerm && selectedFilter === 'User',
  });

  const userSearchResults = users
    ? users.map(user => (
        <UserSearchCard
          user={user}
          onPress={() => navigateToUserProfile(user)}
        ></UserSearchCard>
      ))
    : [];

  console.log(users);

  const performerSearchResults = searchPerformers
    ? searchPerformers.map(performer => (
        <PerformerSearchCard
          performer={performer}
          onPress={() => setSelectedSearchPerformer(performer)}
        ></PerformerSearchCard>
      ))
    : [];

  const searchLoading =
    (selectedFilter === 'Artist' && performersSearchLoading) ||
    (selectedFilter === 'User' && userLoading);

  const error =
    (selectedFilter === 'Artist' &&
      !performer &&
      (isPerformersGetOrCreateError || isPerformersSearchError)) ||
    (selectedFilter === 'User' && !users && usersGetError);

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
      <SearchBar
        searchTermChanged={handleSearchTermChange}
        searchResults={
          selectedFilter === 'User' ? userSearchResults : performerSearchResults
        }
      ></SearchBar>
      {searchLoading && <AppText>Loading...</AppText>}
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


