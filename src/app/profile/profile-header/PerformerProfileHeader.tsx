import { AppButton } from 'components/app-button';
import { AppText } from 'components/app-text';
import { ClaimProfileModal } from 'components/claim-profile-modal';
import { ProfileImage } from 'components/profile-image';
import { ProfileContext, ProfileType } from 'contexts/profile.context';
import React, { FC, useContext, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Performer } from 'store/performers';
import { usePerformersGetQuery } from 'store/performers/performers.queries';
import { BUTTON_COLOR_DISABLED, SPACING_XSMALL } from 'styles';

interface PerformerHeaderProps {
  performerId: number;
  handleUploadPostPress: (performer: Performer) => void;
}

const PerformerHeader: FC<PerformerHeaderProps> = ({
  performerId,
  handleUploadPostPress,
}) => {
  const { profileState } = useContext(ProfileContext);
  const [isOpen, setIsOpen] = useState(false);

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
            minHeight: 200,
            width: '100%',
          }}
        >
          <View
            style={{
              ...styles.colContainer,
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <ProfileImage
              size="xlarge"
              imageUrl={performer.imageUrl}
            ></ProfileImage>
            <AppText
              size="large"
              weight="bold"
              marginBottom={SPACING_XSMALL}
            >
              {performer.name}
            </AppText>
          </View>
          {performer.biography && (
            <AppText
              marginBottom={SPACING_XSMALL}
              maxLines={4}
            >
              {performer.biography}
            </AppText>
          )}
          {profileState.profileType === ProfileType.USER && (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                marginBottom: SPACING_XSMALL,
              }}
            >
              <View style={{ flexGrow: 1 }}>
                <AppButton
                  color={BUTTON_COLOR_DISABLED}
                  handlePress={() => handleUploadPostPress(performer)}
                  size="mini"
                  text="Create Post"
                  marginRight={SPACING_XSMALL}
                ></AppButton>
              </View>
              <View style={{ flexGrow: 1 }}>
                <AppButton
                  color={BUTTON_COLOR_DISABLED}
                  handlePress={() => setIsOpen(true)}
                  size="mini"
                  text="Claim Profile"
                ></AppButton>
              </View>
            </View>
          )}
          <Modal
            visible={isOpen}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setIsOpen(false)}
          >
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1}
              onPress={() => setIsOpen(false)}
            >
              <ClaimProfileModal></ClaimProfileModal>
            </TouchableOpacity>
          </Modal>
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
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default PerformerHeader;
