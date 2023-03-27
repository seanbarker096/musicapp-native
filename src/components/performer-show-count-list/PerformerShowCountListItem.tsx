import { AppText } from 'components/app-text';
import { SVGIcon } from 'components/icon/';
import { CalendarSVG } from 'components/icon/svg-components';
import { ProfileImage } from 'components/profile-image';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Performer } from 'store/performers';
import { SPACING_XXSMALL } from 'styles';

type Props = {
  performer: Performer;
  showCount: number;
};

export const PerformerShowCountsListItem: FC<Props> = ({
  performer,
  showCount,
}) => {
  return (
    <Pressable style={styles.rowContainer}>
      <ProfileImage
        styles={{ marginRight: SPACING_XXSMALL }}
        imageUrl={performer.imageUrl}
      ></ProfileImage>
      <View style={styles.columnContainer}>
        <AppText
          size={'regular'}
          weight={'bold'}
        >
          {performer.name}
        </AppText>
        <View style={styles.rowContainer}>
          <SVGIcon
            height={18}
            width={18}
            styles={{ marginRight: SPACING_XXSMALL }}
          >
            <CalendarSVG></CalendarSVG>
          </SVGIcon>
          <AppText>
            {showCount > 1
              ? `${showCount} shows attended`
              : `${showCount} show attended`}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
