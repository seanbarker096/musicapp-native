import React, { FC, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useArtistsSearchQuery } from 'store/artists/artists.queries';

interface SearchProps {}

const Search: FC<SearchProps> = () => {
  const [searchTerm, setsearchTerm] = useState<string>('');

  const {
    data: searchArtists,
    isLoading: artistsSearchLoading,
    isError: isArtistsSearchError,
  } = useArtistsSearchQuery(searchTerm);

  return (
    <View>
      <View>
        <TextInput
          style={styles.text}
          onChangeText={val => setsearchTerm(val)}
          value={searchTerm}
          placeholder="e.g. Eminem"
        />
      </View>
      <>
        {searchArtists && searchArtists.length > 0 && !isArtistsSearchError && (
          <Text>Name: {searchArtists[0].name}</Text>
        )}
        {searchArtists &&
          searchArtists.length === 0 &&
          !isArtistsSearchError && <Text>NO results</Text>}
        {artistsSearchLoading && <Text>Loading...</Text>}
        {isArtistsSearchError && <Text>Error</Text>}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Search;
