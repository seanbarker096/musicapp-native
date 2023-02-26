import React, { FC, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING_XXSMALL } from 'styles';
import { ListItemComponent, ListItemProps } from './list-item/ListItem';
import { ListPadding, listPaddingMap } from './list.styles';

interface ListProps {
  children: ReactElement<ListItemProps, ListItemComponent>[];
  sidePadding?: ListPadding;
}

export const List: FC<ListProps> = ({ children, sidePadding }) => {
  const listPadding = listPaddingMap[sidePadding ?? 'none'];
  return (
    <View
      style={{
        ...styles.listContainer,
        paddingLeft: listPadding,
        paddingRight: listPadding,
      }}
    >
      {children.map((listItem, i) => (
        <View
          style={{
            ...styles.listItemContainer,
            marginBottom:
              i === children.length - 1
                ? 0
                : styles.listItemContainer.marginBottom,
          }}
        >
          {listItem}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listItemContainer: {
    marginBottom: SPACING_XXSMALL,
  },
});
