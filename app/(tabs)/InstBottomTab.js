import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import AntDesign from '@expo/vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InstHomeStack from './InstHomeStack';
import InstJobs from '../Pages/InstJobs';
import ChatScreen from '../Pages/Chat';
import Viewprofile from '../Pages/Viewprofile';
import Applicants from '../Pages/Applicants';
import ViewDetails from '../Pages/ViewDetails';


const Tab = createBottomTabNavigator();

export default function InstBottomTab() {
    return (

        <Tab.Navigator screenOptions={{
            headerShown: false
        }} initialRouteName='Home'>
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} name="Home" component={InstHomeStack} />
            {/* <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} /> }} name="chat" component={ChatScreen} /> */}
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} name="Profile" component={ViewDetails} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} /> }} name="Jobs" component={InstJobs} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} /> }} name="Applicants" component={Applicants} />




        </Tab.Navigator>

    );
}