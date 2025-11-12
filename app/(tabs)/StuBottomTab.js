import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import AntDesign from '@expo/vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StuHomeStack from './StuHomeStack';
import InstJobs from '../Pages/InstJobs';
import ChatScreen from '../Pages/Chat';
import Studentviewprofile from '../Pages/Studentviewprofile';
// import Favourite from '../Pages/Favourite';
import HirePage from '../Pages/Hirepage';


const Tab = createBottomTabNavigator();

export default function StuBottomTab() {
    return (

        <Tab.Navigator screenOptions={{
            headerShown: false
        }} initialRouteName='Home'>
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} name="Home" component={StuHomeStack} />
            {/* <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} /> }} name="chat" component={ChatScreen} /> */}
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} name="Profile" component={Studentviewprofile} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="school-outline" size={24} color={color} /> }} name="My Teachers" component={HirePage} />




        </Tab.Navigator>

    );
}