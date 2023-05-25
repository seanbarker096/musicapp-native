import { Column, ColumnWidth } from 'components/column';
import React, { FC } from 'react';
import { View } from 'react-native';

interface Row {
  children: React.ReactNode[];
}

export const Row: FC<Row> = ({ children }) => {
  const rowItemCount = children.length;
  const columnWidth = (12 / rowItemCount) as ColumnWidth;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
      {children.map((child, index) => {
        return <Column columnWidth={columnWidth}>{child}</Column>;
      })}
    </View>
  );
};
