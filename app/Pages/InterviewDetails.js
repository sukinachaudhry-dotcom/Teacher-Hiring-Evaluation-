import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ShortlistDetails({navigation}) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Notification Details
      </Text>

      {/* Interview Scheduled Details */}
      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Interview Scheduled</Text>
        <Text style={{ marginTop: 5 }}>Institute: University of Karachi</Text>
        <Text style={{ marginTop: 5 }}>Position: CS Lecturer</Text>
        <Text style={{ marginTop: 5 }}>Date & Time: 10th Sep, 3 PM</Text>

        <TouchableOpacity onPress={() => navigation.navigate("ConfirmInterview")} style={{ backgroundColor: "purple", padding: 10, borderRadius: 20, marginTop: 10 }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>Confirm Attendance</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
