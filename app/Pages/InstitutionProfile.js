import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import * as ImagePicker from 'expo-image-picker';

import { setUser, setRole } from "../Redux/Slices/HomeDataSlice";
import { addData, handleSignUp, uploadImageToCloudinary } from "../Helper/firebaseHelper";
import { Dropdown } from "react-native-element-dropdown";

const InstituteProfile = () => {
  const [institutionname, setInstitutionname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [address, setAddress] = useState(null);
  const [type, setType] = useState("");
  const instituteTypeData = [
    { label: "Kindergarten / Nursery / Prep", value: "kindergarten" },
    { label: "Primary School (1-5)", value: "primary" },
    { label: "Secondary School (6-8)", value: "secondary" },
    { label: "High School (9-10)", value: "highschool" },
    { label: "Intermediate (11-12)", value: "intermediate" },
    { label: "Undergraduate", value: "undergraduate" },
    { label: "Postgraduate", value: "postgraduate" },
  ];

  const [website, setWebsite] = useState("");
  const [hours, setHours] = useState("");
  const operatingHoursData = [
    { label: "Morning (8am - 12pm)", value: "morning" },
    { label: "Afternoon (12pm - 4pm)", value: "afternoon" },
    { label: "Evening (4pm - 8pm)", value: "evening" },
    { label: "Full Day", value: "full_day" },
    { label: "Flexible", value: "flexible" },
  ];
  const [certificate, setCertificate] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  
  // Function to pick profile image
  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Function to pick certificate image
  const pickCertificateImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCertificateImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Function to upload images to Cloudinary
  const uploadImages = async () => {
    const uploadPromises = [];
    
    if (profileImage) {
      uploadPromises.push(uploadImageToCloudinary(profileImage.uri));
    } else {
      uploadPromises.push(Promise.resolve(null));
    }
    
    if (certificateImage) {
      uploadPromises.push(uploadImageToCloudinary(certificateImage.uri));
    } else {
      uploadPromises.push(Promise.resolve(null));
    }

    try {
      const [profileImageUrl, certificateImageUrl] = await Promise.all(uploadPromises);
      return { profileImageUrl, certificateImageUrl };
    } catch (error) {
      throw new Error("Failed to upload images");
    }
  };
  
  const handleSubmit = async () => {
    // Form validation
    if (institutionname === "" || email === "" || password === "" || confirmpassword === "" || address === "" || type === "" || website === "" || hours === "") {
      Alert.alert("Error", "Please fill all fields before submitting.");
      return;
    }

    // Password validation
    if (password !== confirmpassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      setUploading(true);
      
      // Upload images to Cloudinary first
      const { profileImageUrl, certificateImageUrl } = await uploadImages();
      
      // Create Firebase user account
      const user = await handleSignUp(email, password, {
        role: "Institution",
        institutionname,
        email,
        address,
        type,
        website,
        hours,
        profileImage: profileImageUrl,
        certificate: certificateImageUrl,
      });

      if (user?.uid) {
        // Update Redux store
        dispatch(setRole("Institution"));
        dispatch(setUser(user));
        
        // Store additional institution data in Firestore
        await addData("Institution", {
          uid: user.uid,
          institutionname,
          email,
          address,
          type,
          website,
          hours,
          profileImage: profileImageUrl,
          certificate: certificateImageUrl,
          createdAt: new Date().toISOString(),
        });

        Alert.alert("Success", "Institution account created successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Navigation will be handled by Redux state change
            }
          }
        ]);
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", error.message || "Failed to create account. Please try again.");
    } finally {
      setUploading(false);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            Institution Sign Up
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
          {/* Institution Profile Photo */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 10 }}>
              Institution Profile Photo
            </Text>
            <TouchableOpacity 
              onPress={pickProfileImage} 
              style={{ 
                alignItems: "center", 
                justifyContent: "center",
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: "purple",
                borderStyle: "dashed",
                backgroundColor: "#f8f8f8"
              }}
            >
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage.uri }} 
                  style={{ width: 116, height: 116, borderRadius: 58 }}
                  resizeMode="cover"
                />
              ) : (
                <>
                  <Ionicons name="business-outline" size={40} color="purple" />
                  <Text style={{ color: "purple", fontWeight: "bold", marginTop: 5 }}>
                    Upload Photo
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Organization Name */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Institution Name
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
            <FontAwesome name="building" size={20} color="purple" />
            <TextInput
              style={{ flex: 1, color: "#333", marginLeft: 8 }}
              placeholder="Enter Name"
              placeholderTextColor="#999"
              // value={orgName}
              onChangeText={(e) => setInstitutionname(e)} />
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
            <TextInput
              onChangeText={(e) => setEmail(e)}
              placeholder="Enter Email"
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
            <TextInput
              secureTextEntry
              onChangeText={(e) => setPassword(e)}
              placeholder="Enter Password"
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
            <Ionicons name="key-outline" size={20} color="purple" style={{ marginRight: 8 }} />
            <TextInput
              onChangeText={(text) => setConfirmpassword(text)}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              style={{ flex: 1, height: 40, color: "#333" }}
            />
          </View>

          {/* Location */}
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
            <MaterialIcons name="location-on" size={20} color="purple" style={{ marginRight: 8 }} />
           <TextInput
              onChangeText={(e) => setAddress(e)}
              placeholder="Enter Full Address"
              placeholderTextColor="#999"
              style={{ flex: 1, height: 40, color: "#333" }}
            />
          </View>

          {/* Institute Type */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Institute Type
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
            <FontAwesome name="university" size={20} color="purple" />
            <Dropdown
              style={{ flex: 1, marginLeft: 8 }}
              placeholderStyle={{ fontSize: 14, color: "#999" }}
              selectedTextStyle={{ fontSize: 14, color: "#333" }}
              data={instituteTypeData}
              labelField="label"
              valueField="value"
              placeholder="Select Type"
              value={type}
              onChange={item => setType(item.value)}
              maxHeight={150}
            />
          </View>

          {/* Website */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Website / Link
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
            <FontAwesome name="globe" size={20} color="purple" />
            <TextInput
              style={{ flex: 1, color: "#333", marginLeft: 8 }}
              placeholder="Enter Website/Link"
              placeholderTextColor="#999"
              // value={website}
              onChangeText={(e) => setWebsite(e)}
            />
          </View>

          {/* Hours */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Operating Hours
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
            <MaterialIcons name="access-time" size={20} color="purple" />
            <Dropdown
              style={{ flex: 1, marginLeft: 8 }}
              placeholderStyle={{ fontSize: 14, color: "#999" }}
              selectedTextStyle={{ fontSize: 14, color: "#333" }}
              data={operatingHoursData}
              labelField="label"
              valueField="value"
              placeholder="Select Hours"
              value={hours}
              onChange={item => setHours(item.value)}
              maxHeight={150}
            />
          </View>

          {/* Certificate */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Upload Registration Certificate
          </Text>
          <TouchableOpacity
            onPress={pickCertificateImage}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              marginBottom: 15,
              height: 60,
              backgroundColor: "#fff",
            }}
          >
            <FontAwesome name="file" size={20} color="purple" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              {certificateImage ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image 
                    source={{ uri: certificateImage.uri }} 
                    style={{ width: 40, height: 30, borderRadius: 4, marginRight: 10 }}
                    resizeMode="cover"
                  />
                  <Text style={{ color: "#333", fontSize: 14 }}>
                    Certificate Selected
                  </Text>
                </View>
              ) : (
                <Text style={{ color: "#999", fontSize: 14 }}>
                  Tap to select certificate image
                </Text>
              )}
          </View>
            <Ionicons name="camera" size={20} color="purple" />
          </TouchableOpacity>

          {/* Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={uploading}
            style={{
              backgroundColor: uploading ? "#ccc" : "purple",
              paddingVertical: 12,
              borderRadius: 25,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {uploading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InstituteProfile;
