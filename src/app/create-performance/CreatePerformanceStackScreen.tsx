import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatePerformance from './CreatePerformance';
import { CreatePerformanceStackParamList } from './create-performance.types';

const CreatePeformanceStackScreen = () => {
  const CreatePerformanceStack =
    createNativeStackNavigator<CreatePerformanceStackParamList>();

  return (
    <CreatePerformanceStack.Navigator>
      <CreatePerformanceStack.Screen
        name="CreatePerformance"
        component={CreatePerformance}
      ></CreatePerformanceStack.Screen>
    </CreatePerformanceStack.Navigator>
  );
};

export default CreatePeformanceStackScreen;
