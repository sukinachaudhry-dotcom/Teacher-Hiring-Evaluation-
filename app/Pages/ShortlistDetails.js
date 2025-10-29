import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ShortlistDetails({navigation}) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Notification Details
      </Text>

      {/* Institute Shortlist Details */}
      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Shortlisted</Text>
        <Text style={{ marginTop: 5 }}>Institute: Lahore School</Text>
        <Text style={{ marginTop: 5 }}>Position: Physics Lecturer</Text>
        <Text style={{ marginTop: 5 }}>Shortlisted: Today</Text>

        <TouchableOpacity onPress={() => navigation.navigate("JobDetails")} style={{ backgroundColor: "purple", padding: 10, borderRadius: 20, marginTop: 10 }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>View More</Text>
        </TouchableOpacity>
      </View>

      
    </ScrollView>
  );
}
