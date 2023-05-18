import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { LinkPostToPerformanceList } from 'components/performance-list/LinkPostToPerformanceList';
import { FC } from 'react';
import { PostStackParamList } from './post.types';

type Props = NativeStackScreenProps<
  PostStackParamList,
  'PostLinkToPerformance'
>;

export const LinkPostToPerformance: FC<Props> = ({
  navigation,
  route: {
    params: { postId, performerId },
  },
}) => {
  function handleCreatePerformancePress() {
    navigation.navigate('PostCreatePerformance');
  }
  return (
    <LinkPostToPerformanceList
      handleCreatePerformancePress={handleCreatePerformancePress}
      postId={postId}
      performerId={performerId}
    ></LinkPostToPerformanceList>
  );
};
