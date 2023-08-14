import { AppText } from 'components/app-text';
import { PerformerSearchCard } from 'components/performer-search-card';
import { SearchBar } from 'components/search';
import React, { FC, useEffect, useState } from 'react';
import { ListRenderItemInfo, View } from 'react-native';
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

  const [limit, setLimit] = useState(10);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<
    string | undefined
  >(undefined);

  // We cant use the isLoading prop from the usePerformersSearchQuery hook because we are debouncing the search term, so we immediately want to render a loading state when user types, rather than waiting for debounce to finish and querys isLoading to then be set to true
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useDebounceEffect<string | undefined>(searchTerm, setDebouncedSearchTerm);

  // user types a new character
  const { data: searchPerformers, error: performersSearchError } =
    usePerformersSearchQuery({
      searchQuery: debouncedSearchTerm,
      limit,
      onSettled: () => setIsLoading(false),
    });

  const {
    data: performer,
    isLoading: performersGetOrCreateLoading,
    error: performersGetOrCreateError,
  } = usePerformerGetOrCreateQuery({
    performerUUID: selectedSearchPerformer?.uuid,
    enabled: !!selectedSearchPerformer,
  });

  useEffect(() => {
    console.log(performer);
    if (performer) {
      onPerformerSelected(performer);
    }
  }, [performer]);

  const searchResultItem = ({
    item,
    index,
  }: ListRenderItemInfo<PerformerSearchPerformer>) => {
    return (
      <PerformerSearchCard
        performer={item}
        onPress={() => setSelectedSearchPerformer(item)}
      ></PerformerSearchCard>
    );
  };

  const error = performersSearchError || performersGetOrCreateError;

  const searchReady = !isLoading && !performersSearchError;

  const hasNextPage = searchPerformers
    ? searchPerformers.length >= limit
    : false;

  return (
    <View style={{ width: '100%' }}>
      <SearchBar
        searchTermChanged={searchTerm => {
          setIsLoading(true);
          setLimit(10);
          searchTermChanged(searchTerm);
        }}
        searchResults={searchPerformers ?? []}
        searchResultRenderItem={searchResultItem}
        searchTerm={searchTerm}
        handleBlur={onTextInputBlur}
        onEndReached={() => {
          if (hasNextPage) {
            setLimit(limit + 10);
          }
        }}
        hasMoreData={hasNextPage}
        itemHeight={30} // height of the PerformerSearchCard component
      ></SearchBar>
      {isLoading && <AppText>Loading...</AppText>}
      {searchReady && searchTerm && searchPerformers?.length === 0 && (
        <AppText>{emptyStateMessage}</AppText>
      )}
    </View>
  );
};

