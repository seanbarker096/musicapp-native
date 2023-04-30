import { AppText } from 'components/app-text';
import { SearchBar } from 'components/search';
import { UserSearchCard } from 'components/user-search-card';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { userUsersSearchQuery } from 'store/users';
import { User } from 'store/users/users.types';
import { useDebounceEffect } from 'utils/custom-hooks';

type UserSearchProps = {
  searchTermChanged: (searchTerm: string) => void;
  searchTerm?: string;
  // Fucntion to be executed once a performer is selected AND they are created or fetched succesfully from the backend
  onUserSelected: (performer: User) => void;
};

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
export const UserSearch: FC<UserSearchProps> = ({
  searchTermChanged,
  searchTerm,
  onUserSelected,
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<
    string | undefined
  >(undefined);

  useDebounceEffect<string | undefined>(searchTerm, setDebouncedSearchTerm);

  const {
    data,
    isLoading: usersLoading,
    error: usersGetError,
  } = userUsersSearchQuery({
    queryParams: {
      searchQuery: debouncedSearchTerm,
    },
    enabled: !!debouncedSearchTerm,
  });

  const users = !!debouncedSearchTerm ? data : [];

  console.log(users);

  const userSearchResults = users
    ? users.map(user => (
        <UserSearchCard
          user={user}
          onPress={() => onUserSelected(user)}
        ></UserSearchCard>
      ))
    : [];

  return (
    <View style={styles.container}>
      <SearchBar
        searchTermChanged={searchTermChanged}
        searchResults={userSearchResults}
        searchTerm={searchTerm}
      ></SearchBar>
      {usersLoading && <AppText>Loading...</AppText>}
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


