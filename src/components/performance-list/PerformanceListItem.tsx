import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { VideoCameraSVG } from 'components/icon/svg-components';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PerformanceWithCounts } from 'store/performances-counts';

type Props = {
  performanceWithCounts: PerformanceWithCounts;
};

export const PerformanceListItem: FC<Props> = ({ performanceWithCounts }) => {
  const date = new Date(performanceWithCounts.createTime * 1000);

  const captures =
    performanceWithCounts.featuresCount + performanceWithCounts.tagCount;

  const captureText =
    captures > 1 ? `${captures} captures` : `${captures} capture`;

  return (
    <Pressable style={styles.columnContainer}>
      <AppText>{date.toLocaleDateString()}</AppText>
      <View>
        <SVGIcon>
          <VideoCameraSVG></VideoCameraSVG>
        </SVGIcon>
        <AppText>{captureText}</AppText>
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
