import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from '@react-navigation/native-stack';
import { Post as PostComponent } from 'app/post/Post';
import { SearchStackScreenParamList } from 'app/search/search-types';
import React, { FC } from 'react';
import { PerformerProfileStackParamList } from './performer-profile.types';
import PerformerProfile from './PerformerProfile';

type Props = NativeStackScreenProps<
  SearchStackScreenParamList,
  'PerformerProfileStackScreen'
>;

const PerformerProfileStack =
  createNativeStackNavigator<PerformerProfileStackParamList>();

const PerformerProfileStackScreen: FC<Props> = ({
  route: {
    params: { performer },
  },
}) => {
  return (
    <PerformerProfileStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <PerformerProfileStack.Screen name="PerformerProfile">
        {props => (
          <PerformerProfile
            {...props}
            performer={performer}
          ></PerformerProfile>
        )}
      </PerformerProfileStack.Screen>

      <PerformerProfileStack.Screen
        name="ViewPost"
        component={PostComponent}
      ></PerformerProfileStack.Screen>
    </PerformerProfileStack.Navigator>
  );
};

export default PerformerProfileStackScreen;
