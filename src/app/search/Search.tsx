import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ArtistSearchCard from 'components/artist-search-card/ArtistSearchCard';
import { List, ListItem } from 'components/list';
import React, { FC, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ArtistSearchArtist } from 'store/artists';
import {
  useArtistGetOrCreateQuery,
  useArtistsSearchQuery,
} from 'store/artists/artists.queries';
import { SearchStackScreenParamList } from './search-types';

type SearchProps = NativeStackScreenProps<SearchStackScreenParamList, 'Search'>;

const SEARCH_DEBOUNCE_TIME = 500;

const Search: FC<SearchProps> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  let searchDebounceTimer: number | undefined = undefined;

  const [selectedSearchArtist, setSelectedSearchArtist] = useState<
    ArtistSearchArtist | undefined
  >(undefined);

  // TODO: consider adding logic to cancel queries on the fly whenever
  // user types a new character
  const {
    data: searchArtists,
    isLoading: artistsSearchLoading,
    isError: isArtistsSearchError,
  } = useArtistsSearchQuery(debouncedSearchTerm);

  const {
    data: artist,
    isLoading: artistsGetOrCreateLoading,
    isError: isArtistsGetOrCreateError,
  } = useArtistGetOrCreateQuery({
    artistUUID: selectedSearchArtist?.uuid,
    enabled: !!selectedSearchArtist,
    onSuccess: artist => navigation.navigate('ArtistProfile', { artist }),
  });

  useEffect(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(
      () => setDebouncedSearchTerm(searchTerm),
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

  function handleArtistSelection(artist: ArtistSearchArtist) {
    setSelectedSearchArtist(artist);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        onChangeText={val => handleSearchTermChange(val)}
        value={searchTerm}
        placeholder="e.g. Eminem"
      />

      <>
        {searchArtists && searchArtists.length > 0 && !isArtistsSearchError && (
          <List sidePadding="small">
            {searchArtists.map(artist => (
              <Pressable
                onPress={() => handleArtistSelection(artist)}
                key={artist.uuid}
              >
                <ListItem>
                  <ArtistSearchCard artist={artist}></ArtistSearchCard>
                </ListItem>
              </Pressable>
            ))}
          </List>
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
