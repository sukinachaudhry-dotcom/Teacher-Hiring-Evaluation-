import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { addData } from "../Helper/firebaseHelper";

export default function Reject({ navigation, route }) {
  const { requestId, studentId, studentName, teacherId } = route.params || {};
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    if (requestId && !completed) {
      handleReject();
    }
  }, [requestId]);

  const handleReject = async () => {
    if (!requestId) {
      Alert.alert("Error", "Request ID not found");
      return;
    }

    try {
      setProcessing(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      // Update request status to rejected
      await updateDoc(doc(db, "hiring requests", requestId), {
        status: "rejected",
        updatedAt: new Date().toISOString(),
      });

      // Get teacher data for notification
      const teacherDoc = await getDoc(doc(db, "users", teacherId || user.uid));
      const teacherData = teacherDoc.data();

      // Create notification for student
      const notificationData = {
        userId: studentId,
        type: "request_rejected",
        title: "Request Rejected",
        message: `${teacherData?.name || "Teacher"} has rejected your hiring request`,
        requestId: requestId,
        studentId: studentId,
        studentName: studentName || "Student",
        teacherId: teacherId || user.uid,
        teacherName: teacherData?.name || "Teacher",
        read: false,
        createdAt: new Date().toISOString(),
      };
      await addData("notifications", notificationData);

      setCompleted(true);
      Alert.alert("Success", "Request rejected. Student has been notified.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      Alert.alert("Error", "Failed to reject request. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10 }}>Processing...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Request Rejected
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Ionicons name="close-circle" size={18} color="#F44336" style={{ marginRight: 6 }} />
          <Text style={styles.errorText}>Request has been rejected successfully!</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <Ionicons name="person-outline" size={18} color="black" style={{ marginRight: 6 }} />
          <Text style={styles.label}>Student: </Text>
          <Text style={styles.value}>{studentName || "Student"}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Ionicons name="notifications-outline" size={18} color="black" style={{ marginRight: 6 }} />
          <Text style={styles.label}>The student has been notified.</Text>
        </View>

        <View style={{ marginTop: 15 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home1")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
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
  errorText: {
    fontSize: 14,
    color: "#F44336",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "purple",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
