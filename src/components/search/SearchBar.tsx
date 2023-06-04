import React, { FC, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

type Props = {
  searchTermChanged: (searchTerm: string) => void;
  searchTerm?: string;
  searchResults: readonly any[];
  searchResultRenderItem: (item: ListRenderItemInfo<any>) => JSX.Element;
  handleBlur?: (e: any) => void;
  height?: number; // if scrollable container used, this defines height of it
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
  height,
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
    console.log(
      'event.nativeEvent.contentOffset.y',
      event.nativeEvent.contentOffset.y,
    );
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);

    console.log('scroll index', Math.floor(scrollOffset / itemHeight));
  };

  const windowHeight = Dimensions.get('window').height;
  const initialNumToRender = Math.ceil((0.8 * windowHeight) / itemHeight);

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
