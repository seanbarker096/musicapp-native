import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navHeaderFactory } from 'utils/utils';
import CreatePerformance from './CreatePerformance';
import { CreatePerformanceStackParamList } from './create-performance.types';

const CreatePeformanceStackScreen = () => {
  const CreatePerformanceStack =
    createNativeStackNavigator<CreatePerformanceStackParamList>();

  return (
    <CreatePerformanceStack.Navigator screenOptions={navHeaderFactory()}>
      <CreatePerformanceStack.Screen
        name="CreatePerformance"
        component={CreatePerformance}
        options={{ headerTitle: 'Create Gig' }}
      ></CreatePerformanceStack.Screen>
    </CreatePerformanceStack.Navigator>
  );
};

export default CreatePeformanceStackScreen;
