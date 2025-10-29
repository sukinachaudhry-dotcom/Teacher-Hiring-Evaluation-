
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useDispatch } from "react-redux";
import { setUser, setRole } from "../Redux/Slices/HomeDataSlice";
import { handleSignUp } from "../Helper/firebaseHelper";
import { Dropdown } from "react-native-element-dropdown";

const StudentProfile = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [selectclass, setSelectClass] = useState("");

  const classData = [
    { label: "Kindergarten / Nursery / Prep", value: "kindergarten" },
    { label: "Class 1–5", value: "class1-5" },
    { label: "Class 6–8", value: "class6-8" },
    { label: "Class 9–10", value: "class9-10" },
    { label: "Intermediate (11-12)", value: "intermediate" },
    { label: "Undergraduate", value: "undergraduate" },
    { label: "Postgraduate", value: "postgraduate" },
  ];


  const [subjects, setSubjects] = useState("");
  const subjectData = [
    { label: "Mathematics", value: "math" },
    { label: "Physics", value: "physics" },
    { label: "Chemistry", value: "chemistry" },
    { label: "Biology", value: "biology" },
    { label: "English", value: "english" },
    { label: "Urdu", value: "urdu" },
    { label: "History", value: "history" },
    { label: "Geography", value: "geography" },
    { label: "Computer Science", value: "cs" },
    { label: "Economics", value: "economics" },
    { label: "Business Studies", value: "business" },
    { label: "Psychology", value: "psychology" },
    { label: "Political Science", value: "political" },
    { label: "Sociology", value: "sociology" },
    { label: "Engineering Courses", value: "engineering" },

  ];
  const [modeofteaching, setModeofteaching] = useState(null);
  const modeData = [
    { label: "Online", value: "online" },
    { label: "In-person", value: "inperson" },
    { label: "Hybrid", value: "hybrid" },
  ];
  const [confirmpassword, setConfirmpassword] = useState("");

  const dispatch = useDispatch();

  const handleStudentProfileSignUp = async () => {
    // Validation
    if (!fullname || !email || !password || !confirmpassword || !address || !phonenumber || !selectclass || !subjects || !modeofteaching) {
      alert("⚠ Please fill all fields before submitting.");
      return;
    }

    // Password validation
    if (password !== confirmpassword) {
      alert("⚠ Passwords do not match!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("⚠ Please enter a valid email address!");
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      alert("⚠ Password must be at least 6 characters long!");
      return;
    }

    try {
      // Create student data object
      const studentData = {
        role: "Student",
        fullname,
        email,
        password, // Note: In production, this should be hashed
        address,
        phonenumber,
        selectclass,
        subjects,
        modeofteaching,
        createdAt: new Date().toISOString(),
        profileCompleted: true
      };

      // Call the signup function from firebaseHelper
      const user = await handleSignUp(email, password, studentData);

      if (user?.uid) {
        dispatch(setRole("Student"));
        dispatch(setUser(user));
        alert("✅ Student account created successfully!");
        // Navigate to student home or dashboard
        navigation.navigate("StuBottomTab");
      } else {
        alert("❌ Error creating account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };


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
          Student Profile
        </Text>
      </View>

      {/* Form */}
      <View
        style={{
          padding: 20,
          marginTop: -20,
          backgroundColor: "white",
          borderRadius: 50,
        }}
      >
        {/* Full Name */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Full Name
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
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="person-circle-outline" size={20} color="purple" />
          <TextInput
            onChangeText={(e) => setFullname(e)}
            placeholder="Enter full name"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
          />
        </View>
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
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="mail-outline" size={20} color="purple" />

          <TextInput
            onChangeText={(text) => setEmail(text)}
            placeholder="  Enter Email"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
          />
        </View>
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
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
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
          <Ionicons name="key-outline" size={20} color="purple" style={{ marginRight: 8 }} />
          <TextInput
            secureTextEntry
            onChangeText={(text) => setConfirmpassword(text)}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            style={{ flex: 1, height: 40, color: "#333" }}
          />
        </View>

        {/* Phone Number */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Phone Number
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
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="call-outline" size={20} color="purple" />
          <TextInput
            onChangeText={(e) => setPhonenumber(e)}

            placeholder="Enter phone number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
          />
        </View>

        {/* Class */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Select Class
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
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <MaterialIcons name="class" size={20} color="purple" />
          <Dropdown
            style={{ flex: 1, marginLeft: 8 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={classData}
            labelField="label"
            valueField="value"
            placeholder="Select Class"
            value={selectclass}
            onChange={item => setSelectClass(item.value)}
            maxHeight={150}
          />
        </View>

        {/* Subjects */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Subjects
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
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <FontAwesome5 name="book" size={18} color="purple" />
          <Dropdown
            style={{ flex: 1, marginLeft: 8 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={subjectData}
            labelField="label"
            valueField="value"
            placeholder="Select Subject"
            value={subjects}
            onChange={item => setSubjects(item.value)}
            maxHeight={150}
          />
        </View>

        {/* Address */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Address
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
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="location-outline" size={20} color="purple" />
          <TextInput
            onChangeText={(e) => setAddress(e)}

            placeholder="Enter your address"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
          />
        </View>

        {/* Mode of Teaching */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Mode of Teaching
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
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="laptop-outline" size={20} color="purple" />
          <Dropdown
            style={{ flex: 1, marginLeft: 8 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={modeData}
            labelField="label"
            valueField="value"
            placeholder="Select Mode"
            value={modeofteaching}
            onChange={item => setModeofteaching(item.value)}
            maxHeight={150}
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          onPress={handleStudentProfileSignUp}
          style={{
            backgroundColor: "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Create Profile
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default StudentProfile;
