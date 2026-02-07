import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getDataById } from "../Helper/firebaseHelper";

export default function ViewDetails({ navigation, route }) {
  const { requestId, studentId, studentName } = route.params || {};
  const [requestData, setRequestData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch request details
      if (requestId) {
        const requestDoc = await getDoc(doc(db, "hiring requests", requestId));
        if (requestDoc.exists()) {
          const data = requestDoc.data();
          setRequestData({ id: requestDoc.id, ...data });
          
          // Fetch student details
          if (data.studentId) {
            const studentInfo = await getDataById("users", data.studentId);
            setStudentData(studentInfo);
          }
        }
      } else if (studentId) {
        // If only studentId is provided, fetch student data
        const studentInfo = await getDataById("users", studentId);
        setStudentData(studentInfo);
        setRequestData({
          studentId: studentId,
          studentName: studentName || studentInfo?.fullname || "Student",
        });
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
      Alert.alert("Error", "Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10 }}>Loading request details...</Text>
      </View>
    );
  }

  if (!requestData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "#666", fontSize: 16 }}>Request details not found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: "purple", padding: 10, borderRadius: 20, marginTop: 20 }}
        >
          <Text style={{ color: "#fff" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {requestData.studentName || studentData?.fullname || "Student"} - Hiring Request
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Ionicons name="person-outline" size={18} color="black" style={{ marginRight: 6 }} />
          <Text style={styles.label}>Name: </Text>
          <Text style={styles.value}>{requestData.studentName || studentData?.fullname || "N/A"}</Text>
        </View>

        {studentData?.email && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="mail-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text style={styles.label}>Email: </Text>
            <Text style={styles.value}>{studentData.email}</Text>
          </View>
        )}

        {studentData?.phonenumber && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="call-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text style={styles.label}>Phone: </Text>
            <Text style={styles.value}>{studentData.phonenumber}</Text>
          </View>
        )}

        {studentData?.address && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="location-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text style={styles.label}>Address: </Text>
            <Text style={styles.value}>{studentData.address}</Text>
          </View>
        )}

        {studentData?.selectclass && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text style={styles.label}>Class: </Text>
            <Text style={styles.value}>{studentData.selectclass}</Text>
          </View>
        )}

        {studentData?.subjects && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="book-outline" size={18} color="black" style={{ marginRight: 6 }} />
            <Text style={styles.label}>Subject: </Text>
            <Text style={styles.value}>{studentData.subjects}</Text>
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
          <Text style={styles.label}>Requested: </Text>
          <Text style={styles.value}>{formatDate(requestData.createdAt)}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <MaterialCommunityIcons name="progress-clock" size={18} color="black" style={{ marginRight: 6 }} />
          <Text style={styles.status}>Status: {requestData.status || "Pending"}</Text>
        </View>

        {requestData.status === "pending" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Accept", {
                requestId: requestData.id,
                studentId: requestData.studentId,
                studentName: requestData.studentName,
                teacherId: requestData.teacherId,
              })}
              style={[styles.button, styles.acceptButton]}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Reject", {
                requestId: requestData.id,
                studentId: requestData.studentId,
                studentName: requestData.studentName,
                teacherId: requestData.teacherId,
              })}
              style={[styles.button, styles.rejectButton]}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    color: "purple",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  acceptButton: {
    backgroundColor: "purple",
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: "purple",
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
