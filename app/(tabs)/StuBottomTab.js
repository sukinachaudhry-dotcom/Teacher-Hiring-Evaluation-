import { Ionicons } from '@expo/vector-icons'; // Using Ionicons
import AntDesign from '@expo/vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StuHomeStack from './StuHomeStack';
import InstJobs from '../Pages/InstJobs';
import ChatList from '../Pages/ChatList';
import ChatScreen from '../Pages/ChatScreen';
import Studentviewprofile from '../Pages/Studentviewprofile';
import StudentFeedback from '../Pages/StudentFeedback';
import HirePage from '../Pages/Hirepage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function StuBottomTab() {
    return (

        <Tab.Navigator screenOptions={{
            headerShown: false
        }} initialRouteName='Home'>
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />, tabBarLabel: 'Home' }} name="Home" component={StuHomeStack} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} />, tabBarLabel: 'Chat' }} name="Chat" component={ChatStack} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />, tabBarLabel: 'Feedback' }} name="Feedback" component={StudentFeedback} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />, tabBarLabel: 'Profile' }} name="Profile" component={Studentviewprofile} />
            <Tab.Screen options={{ tabBarIcon: ({ color }) => <Ionicons name="school-outline" size={24} color={color} />, tabBarLabel: 'My Teachers' }} name="My Teachers" component={HirePage} />




        </Tab.Navigator>

    );
}