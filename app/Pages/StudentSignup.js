import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useDispatch } from "react-redux";
import { setUser, setRole } from "../Redux/Slices/HomeDataSlice";
import { handleSignUp, uploadImageToCloudinary } from "../Helper/firebaseHelper";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from 'expo-image-picker';

const StudentSignup = ({ navigation }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [selectclass, setSelectClass] = useState("");
  const [subjects, setSubjects] = useState("");
  const [modeofteaching, setModeofteaching] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const classData = [
    { label: "Kindergarten / Nursery / Prep", value: "kindergarten" },
    { label: "Class 1–5", value: "class1-5" },
    { label: "Class 6–8", value: "class6-8" },
    { label: "Class 9–10", value: "class9-10" },
    { label: "Intermediate (11-12)", value: "intermediate" },
    { label: "Undergraduate", value: "undergraduate" },
    { label: "Postgraduate", value: "postgraduate" },
  ];

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

  const modeData = [
    { label: "Online", value: "online" },
    { label: "In-person", value: "inperson" },
    { label: "Hybrid", value: "hybrid" },
  ];

  const dispatch = useDispatch();

  // Function to pick profile image
  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleStudentSignUp = async () => {
    // Basic validation
    if (!fullname || !email || !password || !confirmpassword || !address || !phonenumber || !selectclass || !subjects || !modeofteaching) {
      Alert.alert("⚠️ Validation Error", "Please fill all fields before submitting.");
      return;
    }

    // Password validation
    if (password !== confirmpassword) {
      Alert.alert("⚠️ Password Error", "Passwords do not match!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("⚠️ Email Error", "Please enter a valid email address!");
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      Alert.alert("⚠️ Password Error", "Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      // Upload profile image to Cloudinary if selected
      let profileImageUrl = null;
      if (profileImage) {
        setUploading(true);
        try {
          profileImageUrl = await uploadImageToCloudinary(profileImage.uri);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          Alert.alert("⚠️ Upload Error", "Failed to upload profile image. Please try again.");
          setUploading(false);
          setLoading(false);
          return;
        }
        setUploading(false);
      }

      // Create student data object
      const studentData = {
        role: "Student",
        fullname,
        email,
        address,
        phonenumber,
        selectclass,
        subjects,
        modeofteaching,
        profileImage: profileImageUrl, // Add profile image URL
        createdAt: new Date().toISOString(),
        profileCompleted: true
      };

      // Call the signup function from firebaseHelper
      const user = await handleSignUp(email, password, studentData);

      if (user?.uid) {
        dispatch(setRole("Student"));
        dispatch(setUser(user));
        Alert.alert("✅ Success", "Student account created successfully!", [
          {
            text: "Continue",
            onPress: () => navigation.navigate("StuBottomTab")
          }
        ]);
      } else {
        Alert.alert("❌ Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("❌ Error", error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          Student Sign Up
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
        {/* Profile Photo */}
        <TouchableOpacity onPress={pickProfileImage} style={{ alignItems: "center", marginBottom: 20 }}>
          {profileImage ? (
            <Image 
              source={{ uri: profileImage.uri }} 
              style={{ width: 80, height: 80, borderRadius: 40 }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color="gray" />
          )}
          <Text style={{ color: "purple", fontWeight: "bold", marginTop: 5 }}>
            {profileImage ? "Change Photo" : "Upload"}
          </Text>
        </TouchableOpacity>

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
            onChangeText={(text) => setFullname(text)}
            placeholder="Enter full name"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
            value={fullname}
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
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <Ionicons name="mail-outline" size={20} color="purple" />
          <TextInput
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter Email"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
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
            onChangeText={(text) => setPassword(text)}
            placeholder="Enter Password"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
            value={password}
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
            value={confirmpassword}
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
            onChangeText={(text) => setPhonenumber(text)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
            value={phonenumber}
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
            onChangeText={(text) => setAddress(text)}
            placeholder="Enter your address"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", marginLeft: 8 }}
            value={address}
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
          onPress={handleStudentSignUp}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {uploading ? "Uploading Photo..." : loading ? "Creating Account..." : "Create Student Account"}
          </Text>
        </TouchableOpacity>

        {/* Already have account */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
          <Text style={{ color: "#666" }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "purple", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default StudentSignup;

