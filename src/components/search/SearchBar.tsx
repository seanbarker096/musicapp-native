import { List, ListItem } from 'components/list';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  searchTermChanged: (searchTerm: string) => void;
  searchResults: readonly React.ReactNode[];
  scrollable?: boolean;
  height?: number; // if scrollable container used, this defines height of it
};

const SEARCH_DEBOUNCE_TIME = 500;

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
export const SearchBar: FC<Props> = ({
  scrollable = false,
  searchTermChanged,
  searchResults,
  height,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  let searchDebounceTimer: number | undefined = undefined;

  useEffect(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    // Once debounce timer is done, call parent callback so something
    // can be done with the search term
    searchDebounceTimer = setTimeout(
      () => searchTermChanged(searchTerm),
      SEARCH_DEBOUNCE_TIME,
    );

    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [searchTerm]);

  function handleSearchTermChange(term: string) {
    setSearchTerm(term);
  }

  return (
    <View
      style={{
        ...styles.container,
      }}
    >
      <TextInput
        style={styles.text}
        onChangeText={val => handleSearchTermChange(val)}
        value={searchTerm}
        placeholder="e.g. Eminem"
      />

      <>
        {searchResults && searchResults.length > 0 && (
          <List
            sidePadding="xxxsmall"
            verticalPadding="none"
            scrollable={scrollable}
            maxHeight={height}
          >
            {searchResults.map((searchResult, index) => (
              <ListItem key={index}>{searchResult}</ListItem>
            ))}
          </List>
        )}
        {searchResults && searchResults.length === 0 && (
          //   !isPerformersSearchError &&
          <Text>NO results</Text>
        )}
      </>
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
