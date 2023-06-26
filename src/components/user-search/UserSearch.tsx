import { AppText } from 'components/app-text';
import { SearchBar } from 'components/search';
import { UserSearchCard } from 'components/user-search-card';
import React, { FC, useState } from 'react';
import { ListRenderItemInfo, View } from 'react-native';
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

  const [limit, setLimit] = useState(10);

  // We cant use the isLoading prop from the usePerformersSearchQuery hook because we are debouncing the search term, so we immediately want to render a loading state when user types, rather than waiting for debounce to finish and querys isLoading to then be set to true
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useDebounceEffect<string | undefined>(searchTerm, setDebouncedSearchTerm);

  const {
    data: searchUsers,
    isLoading: usersLoading,
    error: usersGetError,
  } = userUsersSearchQuery({
    queryParams: {
      searchQuery: debouncedSearchTerm,
      limit,
    },
    enabled: !!debouncedSearchTerm,
    onSettled: () => setIsLoading(false),
  });

  const searchResultItem = ({ item, index }: ListRenderItemInfo<User>) => {
    return (
      <UserSearchCard
        user={item}
        onPress={() => onUserSelected(item)}
      ></UserSearchCard>
    );
  };

  const searchReady = !isLoading && !usersGetError;

  const hasNextPage = searchUsers ? searchUsers.length >= limit : false;

  return (
    <View style={{ width: '100%' }}>
      <SearchBar
        searchTermChanged={searchTerm => {
          setIsLoading(true);
          setLimit(10);
          searchTermChanged(searchTerm);
        }}
        searchResults={searchUsers ?? []}
        searchResultRenderItem={searchResultItem}
        searchTerm={searchTerm}
        onEndReached={() => {
          if (hasNextPage) {
            setLimit(limit + 10);
          }
        }}
        hasMoreData={hasNextPage}
        itemHeight={30 + 10} // height of the UserSearchCard component
      ></SearchBar>
      {isLoading && <AppText>Loading...</AppText>}
      {searchReady && searchTerm && searchUsers?.length === 0 && (
        <AppText>No results found</AppText>
      )}
    </View>
  );
};


