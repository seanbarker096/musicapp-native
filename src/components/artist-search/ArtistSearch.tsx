import { ArtistSearchCard } from 'components/artist-search-card';
import { List, ListItem } from 'components/list';
import React, { FC, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Artist, ArtistSearchArtist } from 'store/artists';
import {
  useArtistGetOrCreateQuery,
  useArtistsSearchQuery,
} from 'store/artists/artists.queries';

type Props = {
  onArtistSelect?: (artist: Artist) => void;
  scrollable?: boolean;
  height?: number; // if scrollable container used, this defines height of it
};

const SEARCH_DEBOUNCE_TIME = 500;

// TODO: Add loading state for when an artist is selected and we nav to their artist profile
export const ArtistSearch: FC<Props> = ({
  scrollable = false,
  onArtistSelect = () => {},
  height,
}) => {
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
    onSuccess: onArtistSelect,
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
        {searchArtists && searchArtists.length > 0 && !isArtistsSearchError && (
          <List
            sidePadding="small"
            scrollable={scrollable}
            maxHeight={height}
          >
            {searchArtists.map(artist => (
              <Pressable key={artist.uuid}>
                <ListItem>
                  <ArtistSearchCard
                    artist={artist}
                    onPress={() => handleArtistSelection(artist)}
                  ></ArtistSearchCard>
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
