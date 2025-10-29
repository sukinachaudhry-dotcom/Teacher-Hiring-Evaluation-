import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import AntDesign from '@expo/vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import Viewprofile from '../Pages/Viewprofile';
import Browse from '../Pages/PrivBrowse';
import MyApplicationsScreen from '../Pages/Application';
import ChatScreen from '../Pages/Chat';


const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (

        <Tab.Navigator screenOptions={{
            headerShown:false 
        }} initialRouteName='Home'>
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} name="Home" component={HomeStack}/>
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} name="Profile" component={Viewprofile} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} /> }} name="Jobs" component={Browse} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} /> }} name="applications" component={MyApplicationsScreen} />
            {/* <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} /> }} name="chat" component={ChatScreen} /> */}



        </Tab.Navigator>

    );
}