import React, { FC, ReactElement } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { SPACING_XXSMALL } from 'styles';
import { ListItemComponent, ListItemProps } from './list-item/ListItem';
import { ListPadding, listPaddingMap } from './list.styles';

interface ListProps {
  children: ReactElement<ListItemProps, ListItemComponent>[];
  sidePadding?: ListPadding;
  scrollable?: boolean;
  maxHeight?: number; // Max height before which content becomes scrollable
}

export const List: FC<ListProps> = ({
  children,
  sidePadding,
  scrollable = false,
  maxHeight,
}) => {
  const listPadding = listPaddingMap[sidePadding ?? 'none'];

  const childrenContent = children.map((listItem, i) => (
    <View
      key={i}
      style={{
        ...styles.listContainer,
        paddingLeft: listPadding,
        paddingRight: listPadding,
      }}
    >
      {listItem}
    </View>
  ));

  return (
    <SafeAreaView style={{ height: maxHeight, width: '100%' }}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={{
            ...styles.listContainer,
            paddingLeft: listPadding,
            paddingRight: listPadding,
          }}
        >
          {childrenContent}
        </ScrollView>
      ) : (
        <View>{childrenContent}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  listItemContainer: {
    marginBottom: SPACING_XXSMALL,
    width: '100%',
  },
});
