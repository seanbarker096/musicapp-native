import { FC } from 'react';

type PerformancePostsProps = {
  performanceId: number;
};

export const PerformancePosts: FC<PerformancePostsProps> = ({
  performanceId,
}) => {
  const {
    data: performanceTags,
    isLoading: performanceTagsLoading,
    error: performanceTagsGetError,
  } = useTagsGetQuery({
    queryParams: {
      performanceId,
    },
  });

  return (
    <View>
      <Text>PerformancePosts</Text>
    </View>
  );
};
