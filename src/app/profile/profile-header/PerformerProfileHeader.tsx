import { AppButton } from 'components/app-button';
import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { SPACING_MID, SPACING_XXSMALL } from 'styles';

interface PerformerHeaderProps {
  performerId: number;
  handleUploadPostPress: () => void;
}

const PerformerHeader: FC<PerformerHeaderProps> = ({
  performerId,
  handleUploadPostPress,
}) => {
  const { profileState } = useContext(ProfileContext);

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
              size="xlarge"
              imageUrl={performer.imageUrl}
            ></ProfileImage>
            <AppText
              size="large"
              weight="bold"
              marginBottom={SPACING_XXSMALL}
            >
              {performer.name}
            </AppText>
            {performer.biography && (
              <AppText
                textAlign="center"
                size="small"
              >
                {performer.biography}
              </AppText>
            )}
            {profileState.profileType === ProfileType.USER && (
              <>
                <AppText>
                  {`Seen ${performer.name} live? Share your videos from the show`}
                </AppText>
                <AppButton
                  text="Upload"
                  // TODO: Send in the performer id and prefill the performer field
                  handlePress={handleUploadPostPress}
                ></AppButton>
              </>
            )}
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
