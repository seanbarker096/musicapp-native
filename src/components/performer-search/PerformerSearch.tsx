import { List, ListItem } from 'components/list';
import { PerformerSearchCard } from 'components/performer-search-card';
import React, { FC, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Performer, PerformerSearchPerformer } from 'store/performers';
import {
  usePerformerGetOrCreateQuery,
  usePerformersSearchQuery,
} from 'store/performers/performers.queries';

type Props = {
  onPerformerSelect?: (performer: Performer) => void;
  scrollable?: boolean;
  height?: number; // if scrollable container used, this defines height of it
};

const SEARCH_DEBOUNCE_TIME = 500;

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
export const PerformerSearch: FC<Props> = ({
  scrollable = false,
  onPerformerSelect = () => {},
  height,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  let searchDebounceTimer: number | undefined = undefined;

  const [selectedSearchPerformer, setSelectedSearchPerformer] = useState<
    PerformerSearchPerformer | undefined
  >(undefined);

  // TODO: consider adding logic to cancel queries on the fly whenever
  // user types a new character
  const {
    data: searchPerformers,
    isLoading: performersSearchLoading,
    isError: isPerformersSearchError,
  } = usePerformersSearchQuery({ searchQuery: debouncedSearchTerm });

  const {
    data: performer,
    isLoading: performersGetOrCreateLoading,
    isError: isPerformersGetOrCreateError,
  } = usePerformerGetOrCreateQuery({
    performerUUID: selectedSearchPerformer?.uuid,
    enabled: !!selectedSearchPerformer,
    onSuccess: onPerformerSelect,
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

  function handlePerformerSelection(performer: PerformerSearchPerformer) {
    setSelectedSearchPerformer(performer);
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
        {searchPerformers &&
          searchPerformers.length > 0 &&
          !isPerformersSearchError && (
            <List
              sidePadding="xxxsmall"
              verticalPadding="none"
              scrollable={scrollable}
              maxHeight={height}
            >
              {searchPerformers.map(performer => (
                <Pressable key={performer.uuid}>
                  <ListItem>
                    <PerformerSearchCard
                      performer={performer}
                      onPress={() => handlePerformerSelection(performer)}
                    ></PerformerSearchCard>
                  </ListItem>
                </Pressable>
              ))}
            </List>
          )}
        {searchPerformers &&
          searchPerformers.length === 0 &&
          !isPerformersSearchError && <Text>NO results</Text>}
        {performersSearchLoading && <Text>Loading...</Text>}
        {isPerformersSearchError && <Text>Error</Text>}
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
