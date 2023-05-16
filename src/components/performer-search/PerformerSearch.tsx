import { AppText } from 'components/app-text';
import { PerformerSearchCard } from 'components/performer-search-card';
import { SearchBar } from 'components/search';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Performer, PerformerSearchPerformer } from 'store/performers';
import {
  usePerformerGetOrCreateQuery,
  usePerformersSearchQuery,
} from 'store/performers/performers.queries';
import { useDebounceEffect } from 'utils/custom-hooks';

type PerformerSearchProps = {
  searchTermChanged: (searchTerm: string) => void;
  searchTerm?: string;
  // Fucntion to be executed once a performer is selected AND they are created or fetched succesfully from the backend
  onPerformerSelected: (performer: Performer) => void;
};

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
export const PerformerSearch: FC<PerformerSearchProps> = ({
  searchTermChanged,
  searchTerm,
  onPerformerSelected,
}) => {
  const [selectedSearchPerformer, setSelectedSearchPerformer] = useState<
    PerformerSearchPerformer | undefined
  >(undefined);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<
    string | undefined
  >(undefined);

  useDebounceEffect<string | undefined>(searchTerm, setDebouncedSearchTerm);

  // user types a new character
  const {
    data: searchPerformers,
    isLoading: performersSearchLoading,
    error: performersSearchError,
  } = usePerformersSearchQuery({
    searchQuery: debouncedSearchTerm,
    enabled: !!debouncedSearchTerm,
  });

  const performers = !!debouncedSearchTerm ? searchPerformers : [];

  const {
    data: performer,
    isLoading: performersGetOrCreateLoading,
    error: performersGetOrCreateError,
  } = usePerformerGetOrCreateQuery({
    performerUUID: selectedSearchPerformer?.uuid,
    enabled: !!selectedSearchPerformer,
    onSuccess: onPerformerSelected,
  });

  const performerSearchResults = performers
    ? performers.map(performer => (
        <PerformerSearchCard
          performer={performer}
          onPress={() => setSelectedSearchPerformer(performer)}
        ></PerformerSearchCard>
      ))
    : [];

  const error = performersSearchError || performersGetOrCreateError;

  return (
    <View style={styles.container}>
      <SearchBar
        searchTermChanged={searchTermChanged}
        searchResults={performerSearchResults}
        searchTerm={searchTerm}
        scrollable={true}
      ></SearchBar>
      {performersSearchLoading && <AppText>Loading...</AppText>}
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
