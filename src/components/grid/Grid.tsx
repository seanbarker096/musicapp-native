import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

interface GridProps {
  children: React.ReactNode | React.ReactNode[];
  gridPadding: { [style: string]: number };
}

export const Grid: FC<GridProps> = ({ children, gridPadding }) => (
  <View style={{ ...styles.grid, ...gridPadding }}>{children}</View>
);

const styles = StyleSheet.create({
  grid: {
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});
