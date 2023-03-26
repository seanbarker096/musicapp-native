import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { FONT_WEIGHT_BOLD, SPACING_LARGE, SPACING_SMALL } from 'styles';

interface PerformerHeaderProps {
  performerId: number;
}

const PerformerHeader: FC<PerformerHeaderProps> = ({ performerId }) => {
  const {
    isLoading: performerGetLoading,
    isError: isPerformersGetError,
    data: performerData,
    error: performersGetError,
  } = usePerformersGetQuery({
    queryParams: { id: performerId },
  });

  const performer = performerData ? performerData[0] : undefined;

  const performerLoading = !performer && performerGetLoading;

  const performerError = !performer && performersGetError;

  return (
    <>
      {performer && (
        <View
          style={{
            ...styles.rowContainer,
            height: '30%',
            width: '100%',
          }}
        >
          <View style={{ ...styles.colContainer }}>
            <ProfileImage imageUrl={performer.imageUrl}></ProfileImage>
            <AppText
              size="large"
              weight="bold"
            >
              {performer.name}
            </AppText>
          </View>
          <View
            style={{
              ...styles.rowContainer,
              flexGrow: 1,
              justifyContent: 'space-between',
              marginTop: SPACING_SMALL,
              paddingLeft: SPACING_LARGE,
              paddingRight: SPACING_LARGE,
            }}
          >
            <AppText weight={FONT_WEIGHT_BOLD}>20 Posts</AppText>
            <AppText weight={FONT_WEIGHT_BOLD}>5 Features</AppText>
            <Pressable>
              <AppText weight={FONT_WEIGHT_BOLD}>12 Tags</AppText>
            </Pressable>
          </View>
        </View>
      )}
      {performerGetLoading && <AppText>Loading...</AppText>}
      {isPerformersGetError && <AppText>Error...</AppText>}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  rowContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  colContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

export default PerformerHeader;
