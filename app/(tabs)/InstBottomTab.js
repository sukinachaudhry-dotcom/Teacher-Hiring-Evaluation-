import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InstHomeStack from './InstHomeStack';
import InstJobs from '../Pages/InstJobs';
import Applicants from '../Pages/Applicants';
import instJobdetails from '../Pages/instJobdetails';
import TestManagementStack from './TestManagementStack';
import CustomTabBar from '../components/CustomTabBar';
import Jobdetails from '../Pages/Jobdetails';
import ApplicantDetails from '../Pages/ApplicantDetails';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ApplicantsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ApplicantsList" component={Applicants} />
      <Stack.Screen name="ApplicantDetails" component={ApplicantDetails} />
    </Stack.Navigator>
  );
}

export default function InstBottomTab() {
  return (
    <Tab.Navigator 
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }} 
      initialRouteName='Home'
    >
      <Tab.Screen 
        name="Home" 
        component={InstHomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={instJobdetails}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Jobs" 
        component={InstJobs}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Applicants" 
        component={ApplicantsStack}
        options={{
          tabBarLabel: 'Applicants',
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Tests" 
        component={TestManagementStack}
        options={{
          tabBarLabel: 'Tests',
          tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
}