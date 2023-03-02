import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Post as PostComponent } from 'app/post/Post';
import { SearchStackScreenParamList } from 'app/search/search-types';
import React, { FC } from 'react';
import { ArtistProfileStackParamList } from './artist-profile.types';
import ArtistProfile from './ArtistProfile';

type Props = NativeStackScreenProps<
  SearchStackScreenParamList,
  'ArtistProfileStackScreen'
>;

const ArtistProfileStack =
  createNativeStackNavigator<ArtistProfileStackParamList>();

const ArtistProfileStackScreen: FC<Props> = ({
  route: {
    params: { artist },
  },
}) => {
  return (
    <ArtistProfileStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <ArtistProfileStack.Screen name="ArtistProfile">
        {props => (
          <ArtistProfile
            {...props}
            artist={artist}
          ></ArtistProfile>
        )}
      </ArtistProfileStack.Screen>

      <ArtistProfileStack.Screen
        name="ViewPost"
        component={PostComponent}
      ></ArtistProfileStack.Screen>
    </ArtistProfileStack.Navigator>
  );
};

export default ArtistProfileStackScreen;
