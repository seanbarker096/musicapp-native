import { SearchBar } from 'components/search';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

type Props = {};

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
export const PerformerSearch: FC<Props> = ({}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState(undefined);

  function handleSearchTermChange(term: string) {
    setSearchTerm(term);
  }

  function handlePerformerSelection(user: any) {
    setSelectedUser(user);
  }

  function handleUserSelected() {
    console.log('user selected');
  }

  const searchResults = [<Pressable onPress={handleUserSelected}></Pressable>];

  return (
    <>
      <SearchBar
        searchTermChanged={handleSearchTermChange}
        searchResults={searchResults}
      ></SearchBar>
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
