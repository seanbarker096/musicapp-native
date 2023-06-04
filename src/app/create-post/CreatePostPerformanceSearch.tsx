import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PerformanceList } from 'components/performance-list';
import { PerformanceWithEvent } from 'store/performances/performances.types';
import { CreatePostStackParamList } from './create-post.types';

type Props = NativeStackScreenProps<
  CreatePostStackParamList,
  'CreatePostPerformanceSearch'
>;

export const CreatePostPerformanceSearch: React.FC<Props> = ({
  navigation,
  route: {
    params: { performer },
  },
}) => {
  function navigateBackToCreatePost(performance: PerformanceWithEvent) {
    // first post the previous create post screen from the stack
    navigation.pop();

    // then navigate back to the create post screen but with the performer selected
    navigation.navigate('CreatePost', {
      performer,
      performance,
    });
  }
  return (
    <PerformanceList
      performerId={performer.id}
      handlePerformancePress={navigateBackToCreatePost}
    ></PerformanceList>
  );
};
