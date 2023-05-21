import { List, ListItem } from 'components/list';
import React, { FC } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
  searchTermChanged: (searchTerm: string) => void;
  searchTerm?: string;
  searchResults: readonly React.ReactNode[];
  handleBlur?: (e: any) => void;
  scrollable?: boolean;
  height?: number; // if scrollable container used, this defines height of it
};

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
export const SearchBar: FC<Props> = ({
  scrollable = false,
  searchTermChanged,
  searchTerm,
  searchResults,
  handleBlur,
  height,
}) => {
  return (
    <View
      style={{
        ...styles.container,
      }}
    >
      <TextInput
        style={styles.text}
        onChangeText={val => searchTermChanged(val)}
        onBlur={handleBlur}
        value={searchTerm}
        placeholder="Search"
      />
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
