import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import { getDataById, updateData, uploadImageToCloudinary } from "../Helper/firebaseHelper";
import { Dropdown } from "react-native-element-dropdown";

const EditStudentProfile = ({ navigation, route }) => {
  const initialData = route?.params?.profileData || null;
  
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [selectclass, setSelectClass] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [modeofteaching, setModeofteaching] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [localImageUri, setLocalImageUri] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  useEffect(() => {
    // Use initial data if available, otherwise fetch from Firebase
    if (initialData) {
      setFullname(initialData.fullname || "");
      setEmail(initialData.email || "");
      setAddress(initialData.address || "");
      setPhonenumber(initialData.phonenumber || "");
      setSelectClass(initialData.selectclass || null);
      setSubjects(initialData.subjects || null);
      setModeofteaching(initialData.modeofteaching || null);
      setProfilePicUrl(initialData.profilePicUrl || "");
      setFetching(false);
    } else {
      fetchProfileData();
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      setFetching(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        setFetching(false);
        return;
      }

      const data = await getDataById("users", user.uid);
      if (data) {
        setFullname(data.fullname || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setPhonenumber(data.phonenumber || "");
        setSelectClass(data.selectclass || null);
        setSubjects(data.subjects || null);
        setModeofteaching(data.modeofteaching || null);
        setProfilePicUrl(data.profilePicUrl || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setFetching(false);
    }
  };

  // Request image picker permissions
  const requestImagePickerPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant camera roll permissions to upload photos.");
      return false;
    }
    return true;
  };

  // Handle image picker
  const handleImagePicker = async () => {
    try {
      const hasPermission = await requestImagePickerPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile picture
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setLocalImageUri(imageUri);
        // Preview the selected image locally
        // The actual upload will happen when user clicks Update Profile
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleUpdateProfile = async () => {
    // Validation
    if (!fullname || !email || !address || !phonenumber || !selectclass || !subjects || !modeofteaching) {
      Alert.alert("⚠️ Validation Error", "Please fill all fields before submitting.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailTrim = email.trim().toLowerCase();
    if (!emailRegex.test(emailTrim)) {
      Alert.alert("⚠️ Email Error", "Please enter a valid email address!");
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Error", "User not logged in");
        setLoading(false);
        return;
      }

      let finalProfilePicUrl = profilePicUrl; // Keep existing URL if no new image

      // Upload image if a new one was selected
      if (localImageUri) {
        try {
          setUploadingImage(true);
          finalProfilePicUrl = await uploadImageToCloudinary(localImageUri);
          setProfilePicUrl(finalProfilePicUrl);
          setLocalImageUri(null); // Clear local URI after successful upload
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          Alert.alert("⚠️ Upload Error", "Failed to upload profile picture. Profile will be updated without the new image.");
          // Continue with update even if image upload fails
        } finally {
          setUploadingImage(false);
        }
      }

      // Prepare updated data including profilePicUrl
      const updatedData = {
        fullname,
        email: emailTrim,
        address,
        phonenumber,
        selectclass,
        subjects,
        modeofteaching,
        profilePicUrl: finalProfilePicUrl,
        updatedAt: new Date().toISOString(),
      };

      // Update in Firestore
      await updateData("users", user.uid, updatedData);

      Alert.alert("✅ Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("❌ Error", error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  if (fetching) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#d8b4e2" }}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading profile data...</Text>
      </View>
    );
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
          Edit Student Profile
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
        {/* Profile Picture Upload */}
        <View style={styles.avatarUploadSection}>
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 15, textAlign: "center" }}>
            Profile Picture
          </Text>
          
          <TouchableOpacity 
            onPress={handleImagePicker} 
            disabled={uploadingImage || loading}
            style={styles.avatarUploadContainer}
          >
            {localImageUri ? (
              // Show selected image preview
              <Image source={{ uri: localImageUri }} style={styles.avatarPreview} />
            ) : profilePicUrl ? (
              // Show existing profile picture
              <Image source={{ uri: profilePicUrl }} style={styles.avatarPreview} />
            ) : (
              // Show placeholder
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera-outline" size={40} color="#999" />
                <Text style={styles.avatarPlaceholderText}>Tap to upload</Text>
              </View>
            )}
            
            {/* Edit icon overlay */}
            <View style={styles.avatarEditOverlay}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          
          {uploadingImage && (
            <View style={styles.uploadingIndicator}>
              <ActivityIndicator size="small" color="purple" />
              <Text style={styles.uploadingText}>Uploading image...</Text>
            </View>
          )}
        </View>

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
            editable={false}
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

        {/* Update Button */}
        <TouchableOpacity
          onPress={handleUpdateProfile}
          disabled={loading || uploadingImage}
          style={{
            backgroundColor: loading || uploadingImage ? "#ccc" : "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          {loading || uploadingImage ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              Update Profile
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles for avatar upload section
const styles = StyleSheet.create({
  avatarUploadSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarUploadContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d8b4e2",
    borderStyle: "dashed",
    overflow: "hidden",
    position: "relative",
  },
  avatarPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  avatarPlaceholderText: {
    marginTop: 5,
    fontSize: 12,
    color: "#999",
  },
  avatarEditOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "purple",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  uploadingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  uploadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#666",
  },
});

export default EditStudentProfile;

