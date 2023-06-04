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
  onTextInputBlur?: (e: any) => void;
  emptyStateMessage?: string;
};

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
export const PerformerSearch: FC<PerformerSearchProps> = ({
  searchTermChanged,
  searchTerm,
  onPerformerSelected,
  onTextInputBlur,
  emptyStateMessage = 'No results found',
}) => {
  const [selectedSearchPerformer, setSelectedSearchPerformer] = useState<
    PerformerSearchPerformer | undefined
  >(undefined);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<
    string | undefined
  >(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useDebounceEffect<string | undefined>(searchTerm, setDebouncedSearchTerm);

  // user types a new character
  const { data: searchPerformers, error: performersSearchError } =
    usePerformersSearchQuery({
      searchQuery: debouncedSearchTerm,
      onSettled: () => setIsLoading(false),
    });

  const {
    data: performer,
    isLoading: performersGetOrCreateLoading,
    error: performersGetOrCreateError,
  } = usePerformerGetOrCreateQuery({
    performerUUID: selectedSearchPerformer?.uuid,
    enabled: !!selectedSearchPerformer,
    onSuccess: performer => {
      setSelectedSearchPerformer(undefined);
      onPerformerSelected(performer);
    },
  });

  const performerSearchResults = searchPerformers?.length
    ? searchPerformers.map(performer => (
        <PerformerSearchCard
          performer={performer}
          onPress={() => setSelectedSearchPerformer(performer)}
        ></PerformerSearchCard>
      ))
    : [];

  const error = performersSearchError || performersGetOrCreateError;

  const searchReady = !isLoading && !performersSearchError;

  return (
    <View style={styles.container}>
      <SearchBar
        searchTermChanged={searchTerm => {
          setIsLoading(true);
          searchTermChanged(searchTerm);
        }}
        searchResults={performerSearchResults}
        searchTerm={searchTerm}
        handleBlur={onTextInputBlur}
        scrollable={true}
      ></SearchBar>
      {isLoading && <AppText>Loading...</AppText>}
      {searchReady && searchTerm && performerSearchResults.length === 0 && (
        <AppText>{emptyStateMessage}</AppText>
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
