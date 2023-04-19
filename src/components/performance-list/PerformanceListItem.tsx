import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon';
import { VideoCameraSVG } from 'components/icon/svg-components';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import { SPACING_XSMALL } from 'styles';

type Props = {
  performances: PerformanceWithEvent;
  onListItemPress: (performances: PerformanceWithEvent) => void;
};

export const PerformanceListItem: FC<Props> = ({
  performances,
  onListItemPress,
}) => {
  const date = new Date(performances.performanceDate * 1000);

  const captures = performances.attendanceCount;

  const captureText = captures === 1 ? '1 capture' : `${captures} captures`;

  return (
    <Pressable
      onPress={() => onListItemPress(performances)}
      style={styles.columnContainer}
    >
      <AppText>{`${
        performances.venueName
      } ${date.toLocaleDateString()}`}</AppText>
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
