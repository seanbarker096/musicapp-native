import React, { FC, ReactElement } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { COLOR_NEUTRAL_XXXXLIGHT, SPACING_XXSMALL } from 'styles';
import { ListItemComponent, ListItemProps } from './list-item/ListItem';
import { ListPadding, listPaddingMap } from './list.styles';

interface ListProps {
  children: ReactElement<ListItemProps, ListItemComponent>[];
  sidePadding?: ListPadding;
  verticalPadding?: ListPadding;
  scrollable?: boolean;
  maxHeight?: number; // Max height before which content becomes scrollable
}

export const List: FC<ListProps> = ({
  children,
  verticalPadding,
  sidePadding,
  scrollable = false,
  maxHeight,
}) => {
  const leftRightPadding = listPaddingMap[sidePadding ?? 'none'];
  const topBottomPadding = listPaddingMap[verticalPadding ?? 'none'];

  const childrenContent = children.map((listItem, i) => (
    <View
      key={i}
      style={{
        ...styles.listContainer,
        backgroundColor: COLOR_NEUTRAL_XXXXLIGHT,
        paddingLeft: leftRightPadding,
        paddingRight: leftRightPadding,
        paddingBottom: topBottomPadding,
        paddingTop: topBottomPadding,
      }}
    >
      {listItem}
    </View>
  ));

  return (
    <SafeAreaView
      style={{ height: maxHeight, width: '100%', zIndex: scrollable ? 1 : 0 }}
    >
      {scrollable ? (
        <ScrollView
          contentContainerStyle={{
            ...styles.listContainer,
            paddingLeft: leftRightPadding,
            paddingRight: leftRightPadding,
            paddingBottom: topBottomPadding,
            paddingTop: topBottomPadding,
          }}
          showsVerticalScrollIndicator={false}
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
