import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { SPACING_MID } from 'styles';

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
            ...styles.colContainer,
            height: 200,
            width: '100%',
          }}
        >
          <View style={{ ...styles.colContainer, marginTop: SPACING_MID }}>
            <ProfileImage
              size="large"
              imageUrl={performer.imageUrl}
            ></ProfileImage>
            <AppText
              size="large"
              weight="bold"
            >
              {performer.name}
            </AppText>
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
    alignItems: 'center',
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
