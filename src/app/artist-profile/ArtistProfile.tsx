import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchStackScreenParamList } from 'app/search/search-types';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

type ArtistProfileProps = NativeStackScreenProps<
  SearchStackScreenParamList,
  'ArtistProfile'
>;

const ArtistProfile: FC<ArtistProfileProps> = ({
  route: {
    params: { artist },
  },
}) => (
  <View>
    <Text>Artist Profile</Text>
    <Text>{artist.name}</Text>
    <Text>{artist.uuid}</Text>
  </View>
);

export default ArtistProfile;
