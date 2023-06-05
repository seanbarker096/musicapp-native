import { AppTextInput } from 'components/form-components';
import React, { FC, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';

type Props = {
  searchTermChanged: (searchTerm: string) => void;
  searchTerm?: string;
  searchResults: readonly any[];
  searchResultRenderItem: (item: ListRenderItemInfo<any>) => JSX.Element;
  handleBlur?: (e: any) => void;
  onEndReached?: () => void;
  hasMoreData?: boolean;
  itemHeight: number;
};

// TODO: Add loading state for when an performer is selected and we nav to their performer profile
export const SearchBar: FC<Props> = ({
  searchTermChanged,
  searchTerm,
  searchResults,
  searchResultRenderItem,
  handleBlur,
  onEndReached,
  hasMoreData,
  itemHeight,
}) => {
  const [scrollOffset, setScrollOffset] = useState(0);

  const renderFooter = () => {
    if (!hasMoreData) {
      return null;
    }

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator
          size="small"
          color="#000000"
        />
      </View>
    );
  };

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);
  };

  const windowHeight = Dimensions.get('window').height;
  const initialNumToRender = Math.ceil((0.8 * windowHeight) / itemHeight);

  return (
    <View style={styles.container}>
      <AppTextInput
        handleChange={val => searchTermChanged(val)}
        handleBlur={handleBlur}
        value={searchTerm}
        placeholder="Search"
        borderless={false}
        renderValidationErrors={false}
      />
      {searchResults && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={searchResultRenderItem}
          ListFooterComponent={renderFooter}
          onEndReached={({ distanceFromEnd }) => {
            if (distanceFromEnd < 0) return;
            onEndReached();
          }}
          onEndReachedThreshold={0.9}
          showsVerticalScrollIndicator={false}
          // This appears to make the list jump to the top whenever new items come in
          getItemLayout={(data, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
          onScroll={handleScroll} // Track the scroll offset
          initialNumToRender={initialNumToRender} // Render initial items based on window height
          initialScrollIndex={Math.floor(scrollOffset / itemHeight)} // Set initial scroll index based on scroll offset
        ></FlatList>
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
