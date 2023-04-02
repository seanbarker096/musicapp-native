import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { VideoCameraSVG } from 'components/icon/svg-components';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PerformanceWithCounts } from 'store/performances-counts';
import { SPACING_XSMALL } from 'styles';

type Props = {
  performanceWithCounts: PerformanceWithCounts;
  onListItemPress: (performanceWithCounts: PerformanceWithCounts) => void;
};

export const PerformanceListItem: FC<Props> = ({
  performanceWithCounts,
  onListItemPress,
}) => {
  const date = new Date(performanceWithCounts.createTime * 1000);

  const captures =
    performanceWithCounts.featuresCount + performanceWithCounts.tagCount;

  const captureText = captures === 1 ? '1 capture' : `${captures} captures`;

  return (
    <Pressable
      onPress={() => onListItemPress(performanceWithCounts)}
      style={styles.columnContainer}
    >
      <AppText>{date.toLocaleDateString()}</AppText>
      <View style={styles.rowContainer}>
        <SVGIcon styles={{ marginRight: SPACING_XSMALL }}>
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
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
