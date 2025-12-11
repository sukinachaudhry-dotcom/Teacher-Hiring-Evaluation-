import React, { useEffect, useState } from "react";
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
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../Helper/firebaseHelper";

const EditInstitutionProfile = ({ navigation, route }) => {
  const profileData = route?.params?.profileData || null;
  const [institutionname, setInstitutionname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [website, setWebsite] = useState("");
  const [hours, setHours] = useState("");
  const [yearsRequired, setYearsRequired] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [profileImage, setProfileImage] = useState(null); // local asset object
  const [certificateImage, setCertificateImage] = useState(null); // local asset object
  const [profileImageUrl, setProfileImageUrl] = useState(null); // remote URL
  const [certificateUrl, setCertificateUrl] = useState(null); // remote URL
  const [saving, setSaving] = useState(false);

  // Load existing profile
  useEffect(() => {
    const load = async () => {
      try {
        let data = profileData;
        
        // If profileData not passed, fetch from Firebase
        if (!data) {
          const uid = auth?.currentUser?.uid;
          if (!uid) return;
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) {
            data = { id: snap.id, ...snap.data() };
          }
        }

        if (data) {
          setInstitutionname(data.institutionname || "");
          setEmail(data.email || "");
          setAddress(data.address || "");
          setType(data.type || "");
          setWebsite(data.website || "");
          setHours(data.hours || "");
          setYearsRequired(data.yearsRequired || "");
          setJobDescription(data.jobDescription || "");
          setProfileImageUrl(data.profileImage || null);
          setCertificateUrl(data.certificate || null);
        }
      } catch (e) {
        Alert.alert("Error", "Failed to load profile");
      }
    };
    load();
  }, [profileData]);

  // Pickers (same UX as create form)
  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) setProfileImage(result.assets[0]);
    } catch (e) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const pickCertificateImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) setCertificateImage(result.assets[0]);
    } catch (e) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadIfNeeded = async () => {
    const uploads = [];
    // Profile image
    if (profileImage?.uri) {
      uploads.push(uploadImageToCloudinary(profileImage.uri).then((url) => ({ key: 'profileImage', url })));
    }
    // Certificate
    if (certificateImage?.uri) {
      uploads.push(uploadImageToCloudinary(certificateImage.uri).then((url) => ({ key: 'certificate', url })));
    }
    const results = await Promise.all(uploads);
    const out = {};
    results.forEach(({ key, url }) => {
      out[key] = url || null;
    });
    return out;
  };

  const onSave = async () => {
    // Basic validation like create screen (but lighter, email change optional)
    if (!institutionname || !address || !type || !website || !hours) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      const uid = auth?.currentUser?.uid;
      if (!uid) throw new Error("Not authenticated");

      // Upload images if changed
      const uploaded = await uploadIfNeeded();

      const payload = {
        institutionname,
        email,
        address,
        type,
        website,
        hours,
        yearsRequired,
        jobDescription,
        ...(uploaded.profileImage ? { profileImage: uploaded.profileImage } : {}),
        ...(uploaded.certificate ? { certificate: uploaded.certificate } : {}),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", uid), payload, { merge: true });
      Alert.alert("Saved", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to save profile");
    } finally {
      setSaving(false);
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
            Edit Institution Profile
          </Text>
        </View>

        {/* Form container (same as create) */}
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
                backgroundColor: "#f8f8f8",
              }}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage.uri }} style={{ width: 116, height: 116, borderRadius: 58 }} resizeMode="cover" />
              ) : profileImageUrl ? (
                <Image source={{ uri: profileImageUrl }} style={{ width: 116, height: 116, borderRadius: 58 }} resizeMode="cover" />
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

          {/* Institution Name */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Institution Name</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, height: 45, backgroundColor: "#fff" }}>
            <FontAwesome name="building" size={20} color="purple" />
            <TextInput style={{ flex: 1, color: "#333", marginLeft: 8 }} placeholder="Enter Name" placeholderTextColor="#999" value={institutionname} onChangeText={setInstitutionname} />
          </View>

          {/* Email (read-only optional) */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Email</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, backgroundColor: "#fff" }}>
            <Ionicons name="mail-outline" size={20} color="purple" style={{ marginRight: 8 }} />
            <TextInput value={email} onChangeText={setEmail} placeholder="Enter Email" placeholderTextColor="#999" style={{ flex: 1, height: 40, color: "#333", marginLeft: 8 }} keyboardType="email-address" autoCapitalize="none" />
          </View>

          {/* Address */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Address</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, height: 45, backgroundColor: "#fff" }}>
            <MaterialIcons name="location-on" size={20} color="purple" style={{ marginRight: 8 }} />
            <TextInput onChangeText={setAddress} placeholder="Enter Full Address" placeholderTextColor="#999" style={{ flex: 1, height: 40, color: "#333" }} value={address} />
          </View>

          {/* Institute Type */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Institute Type</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, height: 45, backgroundColor: "#fff" }}>
            <FontAwesome name="university" size={20} color="purple" />
            <TextInput style={{ flex: 1, marginLeft: 8, color: "#333" }} placeholder="Enter Institute Type" placeholderTextColor="#999" value={type} onChangeText={setType} />
          </View>

          {/* Website */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Website / Link</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, height: 45, backgroundColor: "#fff" }}>
            <FontAwesome name="globe" size={20} color="purple" />
            <TextInput style={{ flex: 1, color: "#333", marginLeft: 8 }} placeholder="Enter Website/Link" placeholderTextColor="#999" value={website} onChangeText={setWebsite} keyboardType="url" autoCapitalize="none" />
          </View>

          {/* Hours */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Operating Hours</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, height: 45, backgroundColor: "#fff" }}>
            <MaterialIcons name="access-time" size={20} color="purple" />
            <TextInput style={{ flex: 1, marginLeft: 8, color: "#333" }} placeholder="Enter Operating Hours" placeholderTextColor="#999" value={hours} onChangeText={setHours} />
          </View>

          {/* Certificate */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Upload Registration Certificate</Text>
          <TouchableOpacity onPress={pickCertificateImage} style={{ flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, height: 60, backgroundColor: "#fff" }}>
            <FontAwesome name="file" size={20} color="purple" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              {certificateImage ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: certificateImage.uri }} style={{ width: 40, height: 30, borderRadius: 4, marginRight: 10 }} resizeMode="cover" />
                  <Text style={{ color: "#333", fontSize: 14 }}>Certificate Selected</Text>
                </View>
              ) : certificateUrl ? (
                <Text style={{ color: "#333", fontSize: 14 }} numberOfLines={1}>Existing certificate set</Text>
              ) : (
                <Text style={{ color: "#999", fontSize: 14 }}>Tap to select certificate image</Text>
              )}
            </View>
            <Ionicons name="camera" size={20} color="purple" />
          </TouchableOpacity>

          {/* Years Required */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Years Required</Text>
          <View style={{ flexDirection: "row", alignItems: "center", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, height: 45, backgroundColor: "#fff" }}>
            <MaterialIcons name="calendar-today" size={20} color="purple" style={{ marginRight: 8 }} />
            <TextInput placeholder="Enter required years" placeholderTextColor="#999" style={{ flex: 1, color: "#333", marginLeft: 8 }} keyboardType="numeric" value={yearsRequired} onChangeText={setYearsRequired} />
          </View>

          {/* Job Description */}
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>Job Description</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-start", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 5, backgroundColor: "#fff", minHeight: 80 }}>
            <Ionicons name="document-text-outline" size={20} color="purple" style={{ marginTop: 10, marginRight: 8 }} />
            <TextInput multiline numberOfLines={4} placeholder="Enter job description" placeholderTextColor="#999" style={{ flex: 1, color: "#333", marginLeft: 8, textAlignVertical: "top" }} value={jobDescription} onChangeText={setJobDescription} />
          </View>

          {/* Save Button */}
          <TouchableOpacity onPress={onSave} disabled={saving} style={{ backgroundColor: saving ? "#ccc" : "purple", paddingVertical: 12, borderRadius: 25, alignItems: "center", marginTop: 10 }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditInstitutionProfile;
