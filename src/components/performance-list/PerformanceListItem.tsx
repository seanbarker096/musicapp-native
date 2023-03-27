import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { VideoCameraSVG } from 'components/icon/svg-components';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Performance } from 'store/performances/performances.types';

type Props = {
  performance: Performance;
};

export const PerformanceListItem: FC<Props> = ({ performance }) => {
  const date = new Date(performance.createTime * 1000);

  return (
    <Pressable style={styles.columnContainer}>
      <AppText>{date.toLocaleDateString()}</AppText>
      <View>
        <SVGIcon>
          <VideoCameraSVG></VideoCameraSVG>
        </SVGIcon>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
