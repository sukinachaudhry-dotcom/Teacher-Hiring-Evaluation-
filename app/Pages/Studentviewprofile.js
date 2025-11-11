import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getDataById } from "../Helper/firebaseHelper";

export default function StudentProfileView({ navigation }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudentProfile = useCallback(async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "User not logged in");
        setLoading(false);
        return;
      }

      const data = await getDataById("users", user.uid);
      if (data) {
        setProfileData(data);
      } else {
        Alert.alert("Error", "Profile not found");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchStudentProfile();
    }, [fetchStudentProfile])
  );

  // Helper function to get label from value
  const getClassLabel = (value) => {
    const classData = {
      kindergarten: "Kindergarten / Nursery / Prep",
      "class1-5": "Class 1–5",
      "class6-8": "Class 6–8",
      "class9-10": "Class 9–10",
      intermediate: "Intermediate (11-12)",
      undergraduate: "Undergraduate",
      postgraduate: "Postgraduate",
    };
    return classData[value] || value;
  };

  const getSubjectLabel = (value) => {
    const subjectData = {
      math: "Mathematics",
      physics: "Physics",
      chemistry: "Chemistry",
      biology: "Biology",
      english: "English",
      urdu: "Urdu",
      history: "History",
      geography: "Geography",
      cs: "Computer Science",
      economics: "Economics",
      business: "Business Studies",
      psychology: "Psychology",
      political: "Political Science",
      sociology: "Sociology",
      engineering: "Engineering Courses",
    };
    return subjectData[value] || value;
  };

  const getModeLabel = (value) => {
    const modeData = {
      online: "Online",
      inperson: "In-person",
      hybrid: "Hybrid",
    };
    return modeData[value] || value;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#666", fontSize: 16 }}>No profile data found</Text>
        <TouchableOpacity
          onPress={fetchStudentProfile}
          style={[styles.editBtn, { marginTop: 20 }]}
        >
          <Text style={styles.editBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      
        <Image 
         source={require("./splash.jpeg")}
          style={styles.avatar} 
        />
      

      {/* Profile Info */}
      <View style={{ alignItems: "center", marginTop: 70 }}>
        <Text style={styles.name}>{profileData.fullname || "Student Name"}</Text>
        <Text style={styles.role}>Student</Text>
        <Text style={styles.subject}>{getSubjectLabel(profileData.subjects)}</Text>
        <Text style={styles.availability}>
          {getClassLabel(profileData.selectclass) || "Class not specified"}
        </Text>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Profile Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{profileData.email || "N/A"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone Number:</Text>
          <Text style={styles.detailValue}>{profileData.phonenumber || "N/A"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{profileData.address || "N/A"}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Class:</Text>
          <Text style={styles.detailValue}>
            {getClassLabel(profileData.selectclass) || "N/A"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Subject:</Text>
          <Text style={styles.detailValue}>
            {getSubjectLabel(profileData.subjects) || "N/A"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mode of Teaching:</Text>
          <Text style={styles.detailValue}>
            {getModeLabel(profileData.modeofteaching) || "N/A"}
          </Text>
        </View>
      </View>

      {/* Edit Button */}
      <View style={styles.editButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditStudentProfile", { profileData })}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  coverImg: {
    width: "100%",
    height: 180,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: -40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: -60,
    alignSelf: "center",
    backgroundColor: "#eee",
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#000" },
  role: { fontSize: 16, color: "purple", marginTop: 4 },
  subject: { fontSize: 15, fontWeight: "600", marginTop: 6, color: "#333" },
  availability: { fontSize: 13, color: "#666", marginTop: 4 },

  detailsBox: {
    marginTop: 20,
    marginHorizontal: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },

  editButtonContainer: {
    marginVertical: 30,
    marginHorizontal: 15,
    marginBottom: 40,
  },
  editBtn: {
    backgroundColor: "purple",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
