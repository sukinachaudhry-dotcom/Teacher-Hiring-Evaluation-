import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import { setUser, setRole } from "../Redux/Slices/HomeDataSlice";
import { handleSignUp } from "../Helper/firebaseHelper";
import { Dropdown } from "react-native-element-dropdown";



const TeacherProfile = ({ navigation }) => {
  const [highestqualification, setHighestqualification] = useState(null);
  const qualificationData = [
    { label: "Matric", value: "matric" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Bachelor", value: "bachelor" },
    { label: "Master", value: "master" },
    { label: "Courses", value: "courses" },

  ];
  const [experience, setExperience] = useState("");
  const [teachingsubjects, setTeachingsubjects] = useState(null);
  const subjectsData = [
    { label: "Mathematics", value: "math" },
    { label: "Physics", value: "physics" },
    { label: "Chemistry", value: "chemistry" },
    { label: "Biology", value: "biology" },
    { label: "English", value: "english" },
    { label: "Computer Science", value: "cs" },
    { label: "Urdu", value: "urdu" },
    { label: "Islamiyat", value: "islamiyat" },
    { label: "Pakistan Studies", value: "pakstudies" },
    { label: "React.js", value: "react" },
    { label: "Node.js", value: "node" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "Web Development", value: "webdev" },
    { label: "Mobile App Development", value: "mobiledev" },
    { label: "Machine Learning", value: "ml" },
    { label: "Artificial Intelligence", value: "ai" },
  ];

  const [location, setLocation] = useState(null);
  const locationData = [
    { label: "Lahore", value: "lahore" },
    { label: "Karachi", value: "karachi" },
    { label: "Islamabad", value: "islamabad" },
    { label: "Faisalabad", value: "faisalabad" },
    { label: "Multan", value: "multan" },
    { label: "Peshawar", value: "peshawar" },
    { label: "Quetta", value: "quetta" },
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [preferredteachinglevel, setPreferredteachinglevel] = useState(null);

  const teachingLevelData = [
    { label: "Primary (Grade 1–5)", value: "primary" },
    { label: "Middle (Grade 6–8)", value: "middle" },
    { label: "High School (Grade 9–10)", value: "highschool" },
    { label: "Intermediate (Grade 11–12)", value: "intermediate" },
    { label: "Undergraduate (Bachelor’s Level)", value: "undergrad" },
    { label: "Postgraduate (Master’s/PhD Level)", value: "postgrad" },
    { label: "Professional Courses (IT, Skills, Test Prep)", value: "professional" },
  ];
  const [preferredteachingtype, setPreferredteachingtype] = useState(null);
  const teachingTypeData = [
    { label: "Home Tuition", value: "home" },
    { label: "School/College", value: "school" },
    { label: "Online Classes", value: "online" },
    { label: "Courses", value: "exam" },
  ];




  const dispatch = useDispatch();

  const goToRegister = async () => {



    // if(experience == ""){
    //   alert ("Please fill all information");
    //   return
    // }



    navigation.navigate("Docs", {
      data: {
        name,
        email,
        password,
        confirmpassword,
        highestqualification,
        preferredteachinglevel,
        preferredteachingtype,
        experience,
        teachingsubjects,
        location,
      }
    })

    

    
    const user = await handleSignUp(name, email, password, confirmpassword, highestqualification, preferredteachinglevel, preferredteachingtype, experience, teachingsubjects, location, {

      role: "Teacher",
      name,
      email,
      password,
      confirmpassword,
      highestqualification,
      preferredteachinglevel,
      preferredteachingtype,
      experience,
      teachingsubjects,
      location,
    });

    if (user?.uid) {
      dispatch(setRole("Teacher"));
      dispatch(setUser(user));

    } else {
      alert("Error in sign up");
    }
  };

  async function handleCreateProfile() {
    try {
      const rawEmail = email; // however you read it from state/inputs
      console.log("email before signup:", typeof rawEmail, `"${rawEmail}"`);

      const emailTrim = (rawEmail || "").toString().trim().toLowerCase();
      // simple email regex (not exhaustive)
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailTrim || !emailRe.test(emailTrim)) {
        alert("Please enter a valid email address.");
        return;
      }

      // If using Firebase v9 modular API:
      // import { createUserWithEmailAndPassword } from "firebase/auth";
      // await createUserWithEmailAndPassword(auth, emailTrim, password);

      // If using namespaced API (older):
      // await auth().createUserWithEmailAndPassword(emailTrim, password);

      // ...existing code to continue after successful signup...
    } catch (err) {
      console.error("signup error:", err);
      alert(err?.message || "Signup failed");
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>
      {/* Header */}
      <View
        style={{
          height: 150,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
          Create Teacher Profile
        </Text>
      </View>

      {/* Form */}
      <View style={{ padding: 20, marginTop: -20, backgroundColor: "white", borderRadius: 50 }}>
        {/* Profile Photo */}
        <TouchableOpacity onPress={() => navigation.navigate("Upload")} style={{ alignItems: "center", marginBottom: 20 }}>
          <Ionicons name="person-circle-outline" size={80} color="gray" />
          <Text style={{ color: "purple", fontWeight: "bold" }}>Upload</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Name
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="person-circle-outline" size={20} color="purple" />
          <TextInput
            onChangeText={(text) => setName(text)}
            placeholder="Enter Name"
            placeholderTextColor="#999"
            style={{ flex: 1, height: 40, color: "#333", marginLeft: 8 }}
          />
        </View>

        {/* Email */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Email
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="mail-outline" size={20} color="purple" />
          <TextInput
            onChangeText={(e) => setEmail(e)}
            placeholder="Enter Email"
            placeholderTextColor="#999"
            style={{ flex: 1, height: 40, color: "#333", marginLeft: 8 }}
          />
        </View>



        {/* Password */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="lock-closed-outline" size={20} color="purple" />
          <TextInput
            secureTextEntry
            onChangeText={(e) => setPassword(e)}
            placeholder="Enter Password"
            placeholderTextColor="#999"
            style={{ flex: 1, height: 40, color: "#333", marginLeft: 8 }}
          />
        </View>
        {/* Confirm Password */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Confirm Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="key-outline" size={20} color="purple" />
          <TextInput

            onChangeText={(text) => setConfirmpassword(text)}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            style={{ flex: 1, height: 40, color: "#333", marginLeft: 8 }}
          />
        </View>

        {/* Highest Qualification */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Highest Qualification</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15,
          height: 45,
          backgroundColor: "#fff",
        }}>
          <MaterialIcons name="school" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={qualificationData}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={highestqualification}
            onChange={(item) => {
              setHighestqualification(item.value);
            }}

          />
        </View>

        {/* Preferred Teaching Level */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Preferred Teaching Level</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15,
          height: 45,
          backgroundColor: "#fff",
        }}>
          <Ionicons name="book-outline" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={teachingLevelData}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={preferredteachinglevel}
            onChange={(item) => {
              setPreferredteachinglevel(item.value);
            }}

          />
        </View>

        {/* Preferred Teaching Type */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Preferred Teaching Type</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15,
          height: 45,
          backgroundColor: "#fff",
        }}>
          <Ionicons name="layers-outline" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={teachingTypeData}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={preferredteachingtype}
            onChange={(item) => {
              setPreferredteachingtype(item.value);
            }}
          />
        </View>

        {/* Experience */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Experience</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15,
          height: 45,
          backgroundColor: "#fff",
        }}>
          <Ionicons name="briefcase-outline" size={20} color="purple" />
          <TextInput
            onChangeText={(e) => setExperience(e)}
            placeholderTextColor="#999"
            placeholder="(if any)" style={{ flex: 1, color: "#333", marginLeft: 8 }} />
        </View>

        {/* Teaching Subjects */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Teaching Subject</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15,
          height: 45,
          backgroundColor: "#fff",
        }}>
          <Ionicons name="school-outline" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={subjectsData}
            labelField="label"
            valueField="value"
            placeholder="Select Subject"
            value={teachingsubjects}
            onChange={(item) => {
              setTeachingsubjects(item.value);
            }}
          />
        </View>


        {/* Location */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Location</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15,
          height: 45,
          backgroundColor: "#fff",
        }}>
          <Ionicons name="location-outline" size={20} color="purple" style={{ marginRight: 8 }} />
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={locationData}
            labelField="label"
            valueField="value"
            placeholder="Select City"
            value={location}
            onChange={(item) => {
              setLocation(item.value);
            }}
          />
        </View>

        {/* <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Location</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 15,
          height: 45,
          backgroundColor: "#fff",
        }}>
          <Ionicons name="location-outline" size={20} color="purple" />
          <TextInput
            onChangeText={(e) => setLocation(e)}

            placeholder="Select" style={{ flex: 1, color: "#333", marginLeft: 8 }} />
        </View> */}

        {/* Button */}
        <TouchableOpacity onPress={goToRegister} style={{
          backgroundColor: "purple",
          paddingVertical: 12,
          borderRadius: 25,
          alignItems: "center",
          marginTop: 10,
        }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};



export default TeacherProfile;
