import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ColumnWidth, columnWidths } from './column.types';

interface ColumnProps {
  columnWidth: ColumnWidth;
  children: React.ReactNode;
}

export const Column: FC<ColumnProps> = ({ columnWidth, children }) => {
  console.log(children);
  return (
    <View
      style={{ ...colWidthStyles[`colWidth${columnWidth}`], ...mainStyles }}
    >
      {children}
    </View>
  );
};

const colWidthStyles = StyleSheet.create({
  colWidth1: {
    flexBasis: columnWidths[1],
    maxWidth: columnWidths[1],
  },
  colWidth2: {
    flexBasis: columnWidths[2],
    maxWidth: columnWidths[2],
  },
  colWidth3: {
    flexBasis: columnWidths[3],
    maxWidth: columnWidths[3],
  },
  colWidth4: {
    flexBasis: columnWidths[4],
    maxWidth: columnWidths[4],
  },
  colWidth5: {
    flexBasis: columnWidths[5],
    maxWidth: columnWidths[5],
  },
  colWidth6: {
    flexBasis: columnWidths[6],
    maxWidth: columnWidths[6],
  },
  colWidth7: {
    flexBasis: columnWidths[7],
    maxWidth: columnWidths[7],
  },
  colWidth8: {
    flexBasis: columnWidths[8],
    maxWidth: columnWidths[8],
  },
  colWidth9: {
    flexBasis: columnWidths[9],
    maxWidth: columnWidths[9],
  },
  colWidth10: {
    flexBasis: columnWidths[10],
    maxWidth: columnWidths[10],
  },
  colWidth11: {
    flexBasis: columnWidths[11],
    maxWidth: columnWidths[11],
  },
  colWidth12: {
    flexBasis: columnWidths[12],
    maxWidth: columnWidths[12],
  },
});

const mainStyles = StyleSheet.create({
  column: {
    flexGrow: 0,
    flexShrink: 0,
  },
});
