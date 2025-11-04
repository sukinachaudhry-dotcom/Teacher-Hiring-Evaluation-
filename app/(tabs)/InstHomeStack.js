import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';

// import JobDetail from '../Pages/Jobdetails';

import ChatScreen from '../Pages/Chat';
import Institutehome from '../Pages/Institutehome';
import InstJobs from '../Pages/InstJobs';
import Viewprofile from '../Pages/Viewprofile';
import Applicants from '../Pages/Applicants'


const Stack = createNativeStackNavigator();

const InstHomeStack = () => {
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Institutehome">

        <Stack.Screen name="Institutehome" component={Institutehome} />
        <Stack.Screen name="InstJobs" component={InstJobs} />
        <Stack.Screen name="Viewprofile" component={Viewprofile} />
        <Stack.Screen name="Applicants" component={Applicants} />
        {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}

      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default InstHomeStack;