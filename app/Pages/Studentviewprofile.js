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

export default function StudentProfileView({ navigation, route }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get teacherId from route params if viewing a teacher profile
  const teacherId = route?.params?.teacherId;

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      
      // If teacherId is provided, fetch teacher's profile, otherwise fetch student's own profile
      if (teacherId) {
        // Fetch teacher profile
        const data = await getDataById("users", teacherId);
        if (data) {
          setProfileData(data);
        } else {
          Alert.alert("Error", "Teacher profile not found");
        }
      } else {
        // Fetch student's own profile
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
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
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

  // Helper functions for teacher-specific fields
  const getQualificationLabel = (value) => {
    const qualData = {
      matric: "Matric",
      intermediate: "Intermediate",
      bachelor: "Bachelor",
      master: "Master",
      courses: "Courses",
    };
    return qualData[value] || value;
  };

  const getTeachingLevelLabel = (value) => {
    const levelData = {
      primary: "Primary (Grade 1–5)",
      middle: "Middle (Grade 6–8)",
      highschool: "High School (Grade 9–10)",
      intermediate: "Intermediate (Grade 11–12)",
      undergrad: "Undergraduate (Bachelor's Level)",
      postgrad: "Postgraduate (Master's/PhD Level)",
      professional: "Professional Courses (IT, Skills, Test Prep)",
    };
    return levelData[value] || value;
  };

  const getTeachingTypeLabel = (value) => {
    const typeData = {
      home: "Home Tuition",
      school: "School/College",
      online: "Online Classes",
      exam: "Courses",
    };
    return typeData[value] || value;
  };

  const getAvailabilityLabel = (value) => {
    const availData = {
      morning: "Morning (8am–12pm)",
      afternoon: "Afternoon (12pm–4pm)",
      evening: "Evening (4pm–8pm)",
      night: "Night (After 8pm)",
      weekdays: "Weekdays Only",
      weekends: "Weekends Only",
      flexible: "Flexible",
    };
    return availData[value] || value;
  };

  const getLanguageLabel = (value) => {
    const langData = {
      english: "English",
      urdu: "Urdu",
      french: "French",
      spanish: "Spanish",
      arabic: "Arabic",
    };
    return langData[value] || value;
  };

  // Check if viewing teacher profile
  const isTeacherProfile = teacherId || profileData?.role === 'Teacher';

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
          onPress={fetchProfile}
          style={[styles.editBtn, { marginTop: 20 }]}
        >
          <Text style={styles.editBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Profile Image */}
      <Image 
        source={
          profileData.photoUrl || profileData.profileImage 
            ? { uri: profileData.photoUrl || profileData.profileImage } 
            : require("./splash.jpeg")
        }
        style={styles.avatar} 
      />

      {/* Profile Info */}
      <View style={{ alignItems: "center", marginTop: 70 }}>
        <Text style={styles.name}>
          {isTeacherProfile ? (profileData.name || "Teacher Name") : (profileData.fullname || "Student Name")}
        </Text>
        <Text style={styles.role}>
          {isTeacherProfile ? "Teacher" : "Student"}
        </Text>
        {isTeacherProfile ? (
          <>
            <Text style={styles.subject}>
              {getSubjectLabel(profileData.teachingsubjects) || "Subject not specified"}
            </Text>
            <Text style={styles.availability}>
              {profileData.location || "Location not specified"}
            </Text>
            {profileData.experience && (
              <Text style={styles.availability}>
                Experience: {profileData.experience}
              </Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.subject}>{getSubjectLabel(profileData.subjects)}</Text>
            <Text style={styles.availability}>
              {getClassLabel(profileData.selectclass) || "Class not specified"}
            </Text>
          </>
        )}
      </View>

      {/* Profile Details */}
      <View style={styles.detailsBox}>
        <Text style={styles.detailsTitle}>Profile Information</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{profileData.email || "N/A"}</Text>
        </View>

        {isTeacherProfile ? (
          <>
            {/* Teacher-specific fields */}
            {profileData.experience && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Experience:</Text>
                <Text style={styles.detailValue}>{profileData.experience}</Text>
              </View>
            )}

            {profileData.location && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{profileData.location}</Text>
              </View>
            )}

            {profileData.highestqualification && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Highest Qualification:</Text>
                <Text style={styles.detailValue}>
                  {getQualificationLabel(profileData.highestqualification)}
                </Text>
              </View>
            )}

            {profileData.preferredteachinglevel && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Preferred Teaching Level:</Text>
                <Text style={styles.detailValue}>
                  {getTeachingLevelLabel(profileData.preferredteachinglevel)}
                </Text>
              </View>
            )}

            {profileData.preferredteachingtype && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Preferred Teaching Type:</Text>
                <Text style={styles.detailValue}>
                  {getTeachingTypeLabel(profileData.preferredteachingtype)}
                </Text>
              </View>
            )}

            {profileData.teachingsubjects && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Teaching Subject:</Text>
                <Text style={styles.detailValue}>
                  {getSubjectLabel(profileData.teachingsubjects)}
                </Text>
              </View>
            )}

            {profileData.availability && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Availability:</Text>
                <Text style={styles.detailValue}>
                  {getAvailabilityLabel(profileData.availability)}
                </Text>
              </View>
            )}

            {profileData.languageknown && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Language Known:</Text>
                <Text style={styles.detailValue}>
                  {getLanguageLabel(profileData.languageknown)}
                </Text>
              </View>
            )}

            {profileData.introduction && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Introduction:</Text>
                <Text style={styles.detailValue}>{profileData.introduction}</Text>
              </View>
            )}

            {profileData.resume && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Resume:</Text>
                <Text style={styles.detailValue}>Available</Text>
              </View>
            )}

            {profileData.certificates && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Certificates:</Text>
                <Text style={styles.detailValue}>Available</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {/* Student-specific fields */}
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
          </>
        )}
      </View>

      {/* Edit Button - Only show for student's own profile */}
      {!isTeacherProfile && (
        <View style={styles.editButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditStudentProfile", { profileData })}
            style={styles.editBtn}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}
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
