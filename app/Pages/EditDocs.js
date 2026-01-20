import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../Helper/firebaseHelper";

const EditDocs = ({ navigation, route }) => {
  const { formData, profileData } = route?.params || {};
  const [resume, setResume] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [availability, setAvailability] = useState(null);
  const availabilityData = [
    { label: "Morning (8am–12pm)", value: "morning" },
    { label: "Afternoon (12pm–4pm)", value: "afternoon" },
    { label: "Evening (4pm–8pm)", value: "evening" },
    { label: "Night (After 8pm)", value: "night" },
    { label: "Weekdays Only", value: "weekdays" },
    { label: "Weekends Only", value: "weekends" },
    { label: "Flexible", value: "flexible" },
  ];
  const [languages, setLanguages] = useState(null);
  const languageData = [
    { label: "English", value: "english" },
    { label: "Urdu", value: "urdu" },
    { label: "French", value: "french" },
    { label: "Spanish", value: "spanish" },
    { label: "Arabic", value: "arabic" },
  ];
  const [bio, setBio] = useState("");

  // Load existing profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        let data = profileData;
        
        // If profileData not passed, fetch from Firebase
        if (!data) {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser?.uid) {
            const docSnap = await getDoc(doc(db, "users", currentUser.uid));
            if (docSnap.exists()) {
              data = { id: docSnap.id, ...docSnap.data() };
            }
          }
        }

        if (data) {
          // Pre-fill form fields with existing data
          setResume(data.resume || "");
          // Handle certificates - can be string or array
          const certData = data.certificates || "";
          setCertificates(Array.isArray(certData) ? certData : (certData ? [certData] : []));
          setAvailability(data.availability || null);
          setLanguages(data.languageknown || data.languages || null);
          setBio(data.introduction || data.bio || data.description || "");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, [profileData]);

  const handlePickResume = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const uploadedUrl = await uploadImageToCloudinary(imageUri);
        setResume(uploadedUrl);
        alert("Resume uploaded");
      }
    } catch (err) {
      alert("Failed to upload resume");
    }
  };

  const handlePickCertificate = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const uploadedUrl = await uploadImageToCloudinary(imageUri);
        setCertificates(prev => [...prev, uploadedUrl]);
        alert("Certificate uploaded");
      }
    } catch (err) {
      alert("Failed to upload certificate");
    }
  };

  const removeCertificate = (index) => {
    setCertificates(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser?.uid) {
        alert("Error", "User not logged in");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        resume,
        certificates,
        availability,
        languageknown: languages,
        introduction: bio,
        updatedAt: new Date().toISOString(),
      });

      alert("Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
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
          Update Documents & Availability
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
        {/* Resume Upload */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Resume / CV</Text>
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
          placeholderTextColor: "#999",
        }}>
          <Ionicons name="document-outline" size={20} color="purple" />
          <TextInput
            value={resume ? "Resume uploaded" : ""}
            placeholder="No File Chosen"
            placeholderTextColor="#999"
            editable={false}
            style={{ flex: 1, color: "#999", marginLeft: 8 }}
          />
          <TouchableOpacity onPress={handlePickResume} style={{ marginLeft: 8 }}>
            <Ionicons name="cloud-upload-outline" size={22} color="purple" />
          </TouchableOpacity>
        </View>

        {/* Certificates - Job Related */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Certificates (Job Related)</Text>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 10,
          height: 45,
          backgroundColor: "#fff",
          placeholderTextColor: "#999",
        }}>
          <Ionicons name="medal-outline" size={20} color="purple" />
          <TextInput
            value={certificates.length > 0 ? `${certificates.length} certificate(s) uploaded` : ""}
            placeholder="No File Chosen"
            placeholderTextColor="#999"
            editable={false}
            style={{ flex: 1, color: "#999", marginLeft: 8 }}
          />
          <TouchableOpacity onPress={handlePickCertificate} style={{ marginLeft: 8 }}>
            <Ionicons name="cloud-upload-outline" size={22} color="purple" />
          </TouchableOpacity>
        </View>

        {/* Show uploaded certificates */}
        {certificates.length > 0 && (
          <View style={{ marginBottom: 15 }}>
            {certificates.map((cert, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Ionicons name="document-text-outline" size={18} color="purple" />
                <Text style={{ flex: 1, marginLeft: 8, color: "#333", fontSize: 12 }}>
                  Certificate {index + 1}
                </Text>
                <TouchableOpacity onPress={() => removeCertificate(index)}>
                  <Ionicons name="close-circle" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Availability */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Availability</Text>
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
          <Ionicons name="time-outline" size={20} color="purple"  style={{ marginRight: 8 }}/>
          <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={availabilityData}
            labelField="label"
            valueField="value"
            placeholder="Select Availability"
            value={availability}
            onChange={item => setAvailability(item.value)}
            maxHeight={150}
          />
        </View>

        {/* Languages */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Languages Known</Text>
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
          <Ionicons name="language-outline" size={20} color="purple" style={{ marginRight: 8 }} />
           <Dropdown
            style={{ flex: 1 }}
            placeholderStyle={{ fontSize: 14, color: "#999" }}
            selectedTextStyle={{ fontSize: 14, color: "#333" }}
            data={languageData}
            labelField="label"
            valueField="value"
            placeholder="Select Language"
            value={languages}
            onChange={item => setLanguages(item.value)}
            maxHeight={150}
          />
        </View>

        {/* Bio */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Bio / Introduction</Text>
        <View
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            placeholder="Enter your bio or introduction"
            placeholderTextColor="#999"
            style={{ height: 80, color: "#333", textAlignVertical: "top" }}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditDocs;
