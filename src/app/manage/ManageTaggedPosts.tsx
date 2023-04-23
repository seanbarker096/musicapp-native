import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC } from 'react';
import { Text, View } from 'react-native';
import { ManageStackParamList } from './manage-types';

export type ManageTaggedPostProps = NativeStackScreenProps<
  ManageStackParamList,
  'ManageTaggedPosts'
>;

export const ManageTaggedPosts: FC<ManageTaggedPostProps> = ({
  navigation,
}) => {
  return (
    <View>
      <Text>Manage Featured Posts</Text>
    </View>
  );
};
