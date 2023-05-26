import { Column, ColumnWidth } from 'components/column';
import React, { FC } from 'react';
import { View } from 'react-native';

interface Row {
  children: React.ReactNode[];
  maxItems: number;
}

export const Row: FC<Row> = ({ children, maxItems }) => {
  const columnWidth = (12 / maxItems) as ColumnWidth;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      {children.map((child, index) => {
        return <Column columnWidth={columnWidth}>{child}</Column>;
      })}
    </View>
  );
};
