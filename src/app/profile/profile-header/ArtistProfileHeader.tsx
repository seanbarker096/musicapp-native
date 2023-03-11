import { AppText } from 'components/app-text';
import { ProfileImage } from 'components/profile-image';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useArtistsGetQuery } from 'store/artists/artists.queries';
import { FONT_WEIGHT_BOLD, SPACING_LARGE, SPACING_SMALL } from 'styles';

interface ArtistHeaderProps {
  artistId: number;
}

const ArtistHeader: FC<ArtistHeaderProps> = ({ artistId }) => {
  const {
    isLoading: artistGetLoading,
    isError: isArtistsGetError,
    data: artistData,
    error: artistsGetError,
  } = useArtistsGetQuery({
    queryParams: { id: artistId },
  });

  const artist = artistData ? artistData[0] : undefined;

  const artistLoading = !artist && artistGetLoading;

  const artistError = !artist && artistsGetError;

  return (
    <>
      {artist && (
        <View
          style={{
            ...styles.rowContainer,
            height: '30%',
            width: '100%',
          }}
        >
          <View style={{ ...styles.colContainer }}>
            <ProfileImage imageUrl={artist.imageUrl}></ProfileImage>
            <AppText
              size="large"
              weight="bold"
            >
              {artist.name}
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
      {artistGetLoading && <AppText>Loading...</AppText>}
      {isArtistsGetError && <AppText>Error...</AppText>}
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

export default ArtistHeader;
