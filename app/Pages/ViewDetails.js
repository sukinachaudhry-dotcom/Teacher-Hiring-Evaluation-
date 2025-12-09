import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Hiring Request Details
      </Text>

      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Student Information</Text>
        <Text style={{ marginTop: 5 }}>Name: {requestData.studentName || studentData?.fullname || "N/A"}</Text>
        {studentData?.email && (
          <Text style={{ marginTop: 5 }}>Email: {studentData.email}</Text>
        )}
        {studentData?.phonenumber && (
          <Text style={{ marginTop: 5 }}>Phone: {studentData.phonenumber}</Text>
        )}
        {studentData?.address && (
          <Text style={{ marginTop: 5 }}>Address: {studentData.address}</Text>
        )}
        {studentData?.selectclass && (
          <Text style={{ marginTop: 5 }}>Class: {studentData.selectclass}</Text>
        )}
        {studentData?.subjects && (
          <Text style={{ marginTop: 5 }}>Subject: {studentData.subjects}</Text>
        )}
        <Text style={{ marginTop: 5 }}>Requested: {formatDate(requestData.createdAt)}</Text>
        <Text style={{ marginTop: 5, fontWeight: "bold" }}>
          Status: {requestData.status || "Pending"}
        </Text>

        {requestData.status === "pending" && (
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Accept", {
                requestId: requestData.id,
                studentId: requestData.studentId,
                studentName: requestData.studentName,
                teacherId: requestData.teacherId,
              })}
              style={{ backgroundColor: "#4CAF50", padding: 10, borderRadius: 20, flex: 1, marginRight: 5 }}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Reject", {
                requestId: requestData.id,
                studentId: requestData.studentId,
                studentName: requestData.studentName,
                teacherId: requestData.teacherId,
              })}
              style={{ backgroundColor: "#F44336", padding: 10, borderRadius: 20, flex: 1, marginLeft: 5 }}
            >
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
