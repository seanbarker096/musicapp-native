import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC } from 'react';
import { Text, View } from 'react-native';
import { CreatePerformanceStackParamList } from './create-performance.types';

type CreatePerformanceProps = NativeStackScreenProps<
  CreatePerformanceStackParamList,
  'CreatePerformance'
>;

const CreatePerformance: FC<CreatePerformanceProps> = () => {
  return (
    <View>
      <Text>CreatePerformance</Text>
    </View>
  );
};

export default CreatePerformance;
