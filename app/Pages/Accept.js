import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { addData } from "../Helper/firebaseHelper";

export default function Accept({ navigation, route }) {
  const { requestId, studentId, studentName, teacherId } = route.params || {};
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    if (requestId && !completed) {
      handleAccept();
    }
  }, [requestId]);

  const handleAccept = async () => {
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

      // Update request status to accepted
      await updateDoc(doc(db, "hiring requests", requestId), {
        status: "accepted",
        updatedAt: new Date().toISOString(),
      });

      // Get teacher data for notification
      const teacherDoc = await getDoc(doc(db, "users", teacherId || user.uid));
      const teacherData = teacherDoc.data();

      // Create notification for student
      const notificationData = {
        userId: studentId,
        type: "request_accepted",
        title: "Request Accepted",
        message: `${teacherData?.name || "Teacher"} has accepted your hiring request`,
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
      Alert.alert("Success", "Request accepted successfully! Student has been notified.");
    } catch (error) {
      console.error("Error accepting request:", error);
      Alert.alert("Error", "Failed to accept request. Please try again.");
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
          Request Accepted
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" style={{ marginRight: 6 }} />
          <Text style={styles.successText}>Request has been accepted successfully!</Text>
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
  successText: {
    fontSize: 14,
    color: "#4CAF50",
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
