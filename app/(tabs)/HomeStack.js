import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
import Home1 from '../Pages/Home1';
import Jobdetails from '../Pages/Jobdetails';
// import Profile from '../Pages/Profile';
import MyApplicationsScreen from '../Pages/Application';
import ChatScreen from '../Pages/ChatScreen';
import Browse from '../Pages/PrivBrowse';
import Viewprofile from '../Pages/Viewprofile';
import HomeTuitionJobs from '../Pages/HomeTuitionJobs';
import Studentviewprofile from '../Pages/Studentviewprofile';
import SchoolCollegeJobs from '../Pages/SchoolCollegeJobs';
import CoursesJobs from '../Pages/CoursesJobs';
import AllJobs from '../Pages/AllJobs';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Home1">
        
        <Stack.Screen name="Home1" component={Home1} />
        <Stack.Screen name="Browse" component={Browse} />
        <Stack.Screen name="Viewprofile" component={Viewprofile} />        
        <Stack.Screen name="application" component={MyApplicationsScreen} />
        <Stack.Screen name="Jobdetails" component={Jobdetails} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="HomeTuitionJobs" component={HomeTuitionJobs} />
        <Stack.Screen name="Studentviewprofile" component={Studentviewprofile} />
        <Stack.Screen name="SchoolCollegeJobs" component={SchoolCollegeJobs} />
        <Stack.Screen name="CoursesJobs" component={CoursesJobs} />
        <Stack.Screen name="AllJobs" component={AllJobs} />
    

      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default HomeStack;