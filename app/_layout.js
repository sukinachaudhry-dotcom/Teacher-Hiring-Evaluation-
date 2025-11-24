import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { persistReducer, persistStore } from "redux-persist";
import { setUser, setRole } from './Redux/Slices/HomeDataSlice';
import { persistor, store } from "./Redux/Store";

import Splash from "./Pages/Splash";
import Login from './Pages/Login';
import Submitted from './Pages/Submitted';
import UniJobs from './Pages/UniJobs';
import PrivBrowse from './Pages/PrivBrowse';
import Signup from './Pages/Signup';
import Role from './Pages/Role';
import Createprofile from './Pages/Createprofile';
import Docs from './Pages/Docs';
import Home1 from './Pages/Home1';
import Jobdetails from './Pages/Jobdetails';
import Application from './Pages/Application';
import EditProfile from './Pages/EditProfile';
import EditDocs from './Pages/EditDocs';
import ForgotPass from './Pages/ForgotPass';
import ChangePass from './Pages/ChangePass';
import Settings from './Pages/Settings';
import Privacy from './Pages/Privacy';
import NotificationScreen from './Pages/NotificationScreen';
import StudentProfile from './Pages/StudentProfile';
import StudentSignup from './Pages/StudentSignup';
import InstitutionProfile from './Pages/InstitutionProfile';
import InstBrowse from './Pages/InstBrowse';
// import ChatScreen from './Pages/Chat';
import ClgJobs from './Pages/ClgJobs';
import TuitionJobs from './Pages/TuitionJobs';
import CoursesJobs from './Pages/CoursesJobs';
import Upload from './Pages/Upload';
import ViewDetails from './Pages/ViewDetails';
import Accept from './Pages/Accept';
import Reject from './Pages/Reject';
import ShortlistDetails from './Pages/ShortlistDetails';
import InterviewDetails from './Pages/InterviewDetails';
import ConfirmInterview from './Pages/ConfirmInterview';
import Institutehome from './Pages/Institutehome';
import Viewjobdetail from "./Pages/Viewjobdetail";
import Viewprofile from './Pages/Viewprofile';
import InstBottomTab from './(tabs)/InstBottomTab';
import BottomTab from './(tabs)/BottomTab';
import StuBottomTab from './(tabs)/StuBottomTab';
import { useState } from "react";
import Deleteprofile from "./Pages/Deleteprofile";
import Applicants from './Pages/Applicants';
import Postjob from './Pages/Postjob';
import InstJobs from './Pages/InstJobs';
import Studentviewprofile from './Pages/Studentviewprofile';
import EditStudentProfile from './Pages/EditStudentProfile';
import Computer from './Pages/Computer';
import MathCoursesPage from "./Pages/Math";
import PhysicsCoursesPage from "./Pages/Physics";
import Viewall from "./Pages/Viewall";
import HirePage from "./Pages/Hirepage";
import instJobdetails from './Pages/instJobdetails';
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermAndConditions from "./Pages/TermAndConditions";
import EditJob from './Pages/EditJob';
import EditInstitutionProfile from './Pages/EditInstitutionProfile';
import TestList from './Pages/TestList';
import TakeTest from './Pages/TakeTest';
import TestResult from './Pages/TestResult';

const Stack = createNativeStackNavigator();


const TeacherStack = () => (
  <Stack.Navigator initialRouteName="BottomTab">
    <Stack.Screen name="Splash" component={Splash} />
    {/* <Stack.Screen name="Login" component={Login} />/ */}
    <Stack.Screen name="Submitted" component={Submitted} />
    <Stack.Screen name="UniJobs" component={UniJobs} />
    <Stack.Screen name="PrivBrowse" component={PrivBrowse} />
    {/* <Stack.Screen name="Signup" component={Signup} /> */}
    <Stack.Screen name="Role" component={Role} />
    <Stack.Screen name="Createprofile" component={Createprofile} />
    <Stack.Screen name="Docs" component={Docs} />
    <Stack.Screen name="ClgJobs" component={ClgJobs} />
    <Stack.Screen name="TuitionJobs" component={TuitionJobs} />
    <Stack.Screen name="CoursesJobs" component={CoursesJobs} />
    <Stack.Screen name="Upload" component={Upload} />
    <Stack.Screen name="Home1" component={Home1} />
    <Stack.Screen name="Jobdetails" component={Jobdetails} />
    <Stack.Screen name="Application" component={Application} />
    <Stack.Screen name="BottomTab" component={BottomTab} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
    <Stack.Screen name="EditDocs" component={EditDocs} />
    <Stack.Screen name="ForgotPass" component={ForgotPass} />
    <Stack.Screen name="ChangePass" component={ChangePass} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Deleteprofile" component={Deleteprofile} />
    <Stack.Screen name="Privacy" component={Privacy} />
    <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    <Stack.Screen name="InstitutionProfile" component={InstitutionProfile} />
    <Stack.Screen name="InstBrowse" component={InstBrowse} />
    {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}
    <Stack.Screen name="ViewDetails" component={ViewDetails} />
    <Stack.Screen name="Accept" component={Accept} />
    <Stack.Screen name="Reject" component={Reject} />
    <Stack.Screen name="ShortlistDetails" component={ShortlistDetails} />
    <Stack.Screen name="InterviewDetails" component={InterviewDetails} />
    <Stack.Screen name="ConfirmInterview" component={ConfirmInterview} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}/>
    <Stack.Screen name="TermAndConditions" component={TermAndConditions}/>
    <Stack.Screen name="TestList" component={TestList} options={{ title: 'Available Tests' }} />
    <Stack.Screen name="TakeTest" component={TakeTest} options={{ title: 'Take Test' }} />
    <Stack.Screen name="TestResult" component={TestResult} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const StudentStack = () => (
  <Stack.Navigator initialRouteName="StuBottomTab">
    <Stack.Screen name="Splash" component={Splash} />
    {/* <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} /> */}
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="ForgotPass" component={ForgotPass} />
    <Stack.Screen name="ChangePass" component={ChangePass} />
    <Stack.Screen name="Deleteprofile" component={Deleteprofile} />
    <Stack.Screen name="Privacy" component={Privacy} />
    <Stack.Screen name="Role" component={Role} />
    <Stack.Screen name="StudentProfile" component={StudentProfile} />
    <Stack.Screen name="StudentSignup" component={StudentSignup} />
    <Stack.Screen name="Viewjobdetail" component={Viewjobdetail} />
    <Stack.Screen name="Applicants" component={Applicants} />
    <Stack.Screen name="StuBottomTab" component={StuBottomTab} />
    <Stack.Screen name="Studentviewprofile" component={Studentviewprofile} />
    <Stack.Screen name="EditStudentProfile" component={EditStudentProfile} />
    <Stack.Screen name="Computer" component={Computer} />
    <Stack.Screen name="Physics" component={PhysicsCoursesPage} />
    <Stack.Screen name="Maths" component={MathCoursesPage} />
    <Stack.Screen name="CoursesJobs" component={CoursesJobs} />
    <Stack.Screen name="Viewall" component={Viewall} />
    <Stack.Screen name="HirePage" component={HirePage}/>
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}/>
    <Stack.Screen name="TermAndConditions" component={TermAndConditions}/>


    {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}
  </Stack.Navigator>
);

const InstitutionStack = () => (
  <Stack.Navigator initialRouteName="InstBottomTab">
    <Stack.Screen name="Splash" component={Splash} />
    {/* <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} /> */}
    <Stack.Screen name="Role" component={Role} />
    <Stack.Screen name="ForgotPass" component={ForgotPass} />
    <Stack.Screen name="ChangePass" component={ChangePass} />
    <Stack.Screen name="Deleteprofile" component={Deleteprofile} />
    <Stack.Screen name="Privacy" component={Privacy} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="InstitutionProfile" component={InstitutionProfile} />
    <Stack.Screen name="Institutehome" component={Institutehome} />
    <Stack.Screen name="InstBottomTab" component={InstBottomTab} />
    <Stack.Screen name="Viewjobdetail" component={Viewjobdetail} />
    <Stack.Screen name="Viewprofile" component={Viewprofile} />
    <Stack.Screen name="Applicants" component={Applicants} />
    <Stack.Screen name="Postjob" component={Postjob} />
    {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}
    <Stack.Screen name="InstJobs" component={InstJobs} />
    <Stack.Screen name="Computer" component={Computer} />
    <Stack.Screen name="Physics" component={PhysicsCoursesPage} />
    <Stack.Screen name="Maths" component={MathCoursesPage} />
    <Stack.Screen name="CoursesJobs" component={CoursesJobs} />
    <Stack.Screen name="Viewall" component={Viewall} />
    <Stack.Screen name="InstJobdetails" component={instJobdetails} />
    <Stack.Screen name="EditJob" component={EditJob} />
    <Stack.Screen name="EditInstitutionProfile" component={EditInstitutionProfile} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}/>
    <Stack.Screen name="TermAndConditions" component={TermAndConditions}/>
  </Stack.Navigator>
);

// Root navigator with role check
const RenderStack = () => {
  const role = useSelector((state) => state.home.role);



  switch (role) {
    case "Teacher":
      return <TeacherStack />;
    case "Student":
      return <StudentStack />;
    case "Institution":
      return <InstitutionStack />;
    default:
      return (
        <Stack.Navigator initialRouteName="Login">
          {/* <Stack.Screen name="Signup" component={Signup} /> */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Role" component={Role} />
          <Stack.Screen name="Createprofile" component={Createprofile} />
          <Stack.Screen name="Docs" component={Docs} />
          <Stack.Screen name="StudentProfile" component={StudentProfile} />
          <Stack.Screen name="StudentSignup" component={StudentSignup} />
          <Stack.Screen name="InstitutionProfile" component={InstitutionProfile} />
          <Stack.Screen name="Home1" component={Home1} />
          <Stack.Screen name="Viewprofile" component={Viewprofile} />

        </Stack.Navigator>
      );
  }
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

          <RenderStack />

        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;