import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ViewDetails({navigation}) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Notification Details
      </Text>

      {/* Student Hiring Request Details */}
      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Hiring Request</Text>
        <Text style={{ marginTop: 5 }}>Student Name: Ali Khan</Text>
        <Text style={{ marginTop: 5 }}>Subject: Mathematics Tuition</Text>
        <Text style={{ marginTop: 5 }}>Location: Lahore</Text>
        <Text style={{ marginTop: 5 }}>Applied: 2 hours ago</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Accept")} style={{ backgroundColor: "purple", padding: 10, borderRadius: 20, flex: 1, marginRight: 5 }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Reject")} style={{ backgroundColor: "purple", padding: 10, borderRadius: 20, flex: 1, marginLeft: 5 }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>

  
     
    </ScrollView>
  );
}
