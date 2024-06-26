import { Column, ColumnWidth } from 'components/column';
import React, { FC, memo } from 'react';
import { View } from 'react-native';

interface Row {
  children: React.ReactNode[];
  maxItems: number;
}

export const Row: FC<Row> = memo(({ children, maxItems }) => {
  const columnWidth = (12 / maxItems) as ColumnWidth;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      {children.map((child, index) => {
        return (
          <Column
            key={index}
            columnWidth={columnWidth}
          >
            {child}
          </Column>
        );
      })}
    </View>
  );
});
