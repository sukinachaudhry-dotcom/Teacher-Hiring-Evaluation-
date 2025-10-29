import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';

// import JobDetail from '../Pages/Jobdetails';

import ChatScreen from '../Pages/Chat';
import Studenthome from '../Pages/Studenthome';
import Studentviewprofile from '../Pages/Studentviewprofile';
import Applicants from '../Pages/Applicants'


const Stack = createNativeStackNavigator();

const StuHomeStack = () => {
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Studenthome">

        <Stack.Screen name="Studenthome" component={Studenthome} />
        <Stack.Screen name="Studentviewprofile" component={Studentviewprofile} />
        <Stack.Screen name="Applicants" component={Applicants} />
        <Stack.Screen name="Chat" component={ChatScreen} />

      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default StuHomeStack;