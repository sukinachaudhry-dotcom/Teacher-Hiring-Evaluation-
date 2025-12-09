import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
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
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Request Accepted
      </Text>

      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{studentName || "Student"}</Text>
        <Text style={{ marginTop: 5 }}>Request has been accepted successfully!</Text>
        <Text style={{ marginTop: 5, color: "#4CAF50", fontWeight: "bold" }}>
          The student has been notified.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
            style={{ backgroundColor: "purple", padding: 10, borderRadius: 20, flex: 1, marginRight: 5 }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Go to Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Home1")}
            style={{ backgroundColor: "purple", padding: 10, borderRadius: 20, flex: 1, marginLeft: 5 }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
