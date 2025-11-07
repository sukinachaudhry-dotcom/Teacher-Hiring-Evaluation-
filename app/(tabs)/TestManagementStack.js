import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
import TestManagement from '../Pages/TestManagement';
import SubjectQuestions from '../Pages/SubjectQuestions';
import AddSubject from '../Pages/AddSubject';
import AddQuestion from '../Pages/AddQuestion';

const Stack = createNativeStackNavigator();

const TestManagementStack = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TestManagement">
        <Stack.Screen name="TestManagement" component={TestManagement} />
        <Stack.Screen name="SubjectQuestions" component={SubjectQuestions} />
        <Stack.Screen name="AddSubject" component={AddSubject} />
        <Stack.Screen name="AddQuestion" component={AddQuestion} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default TestManagementStack;


