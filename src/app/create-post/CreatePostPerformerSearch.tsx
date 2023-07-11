import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PerformerSearch } from 'components/performer-search';
import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { Performer } from 'store/performers';
import { APP_GUTTER } from 'styles';
import { CreatePostStackParamList } from './create-post.types';

type Props = NativeStackScreenProps<
  CreatePostStackParamList,
  'CreatePostPerformerSearch'
>;

export const CreatePostPerformerSearch: FC<Props> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  function handleSearchTermChange(term: string) {
    setSearchTerm(term);
  }

  function navigateBackToCreatePost(performer: Performer) {
    // first post the previous create post screen from the stack
    navigation.pop();

    console.log('performer', performer);

    // then navigate back to the create post screen but with the performer selected
    navigation.navigate('CreatePost', { performer });
  }

  return (
    <View style={{ padding: APP_GUTTER }}>
      <PerformerSearch
        searchTermChanged={handleSearchTermChange}
        searchTerm={searchTerm}
        onPerformerSelected={navigateBackToCreatePost}
      ></PerformerSearch>
    </View>
  );
};
