import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ApplicationSuccess({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 }}>
      
      {/* Success Icon */}
      <Ionicons name="checkmark-circle-outline" size={80} color="green" />

      {/* Message */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 15, color: "#333" }}>
        Application Submitted!
      </Text>
      <Text style={{ fontSize: 14, textAlign: "center", color: "#555", marginTop: 8, marginBottom: 20 }}>
        Your application has been successfully submitted. You can track the status in My Applications.
      </Text>
       <Text style={{ marginTop: 5 }}>You will be notified if the institute shortlists you.</Text>

      {/* Buttons */}
      <TouchableOpacity 
        style={{ backgroundColor: "purple", padding: 12, borderRadius: 25, width: "80%", marginTop: 10 }}
        onPress={() => navigation.navigate("Application")}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>Go to My Applications</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ backgroundColor: "purple", padding: 12, borderRadius: 25, width: "80%", marginTop: 10 }}
        onPress={() => navigation.navigate("Home1")}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>Back to Home</Text>
      </TouchableOpacity>

    </View>
  );
}
