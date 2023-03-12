import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtistSearch } from 'components/artist-search';
import { ProfileType } from 'contexts/profile.context';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Artist } from 'store/artists';
import { InternalSearchStackScreenParamList } from './search-types';

type SearchProps = NativeStackScreenProps<
  InternalSearchStackScreenParamList,
  'search'
>;

// TODO: Add loading state for when an artist is selected and we nav to their artist profile
const Search: FC<SearchProps> = ({ navigation }) => {
  const onArtistSearchGetOrCreateSuccess = (artist: Artist) =>
    navigation.navigate('profileInternalStackScreen', {
      profileType: ProfileType.ARTIST,
      profileId: artist.id,
    });

  return (
    <View style={styles.container}>
      <ArtistSearch
        onArtistSelect={onArtistSearchGetOrCreateSuccess}
      ></ArtistSearch>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    width: '100%',
  },
  text: {
    height: 40,
    borderWidth: 1,
    width: '100%',
  },
});

export default Search;
