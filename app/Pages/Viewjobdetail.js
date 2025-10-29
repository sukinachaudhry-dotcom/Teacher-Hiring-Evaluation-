import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";

const Viewjobdetail = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d8b4e2", padding: 20 }}>
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4A235A" }}>
          Job Details
        </Text>
      </View>

      {/* Job Info */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 12,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
          Physics Lecturer
        </Text>
        <Text style={{ fontSize: 16, color: "#555", marginTop: 10 }}>
          Applicants: 5
        </Text>

        <Text style={{ fontSize: 14, color: "#777", marginTop: 15 }}>
          This job requires a qualified teacher who can deliver engaging
          lectures and manage students effectively. More details about this job
          will be added here.
        </Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: "purple",
          padding: 15,
          borderRadius: 12,
          marginTop: 30,
        }}
      >
        <Text
          style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
        >
          Go Back
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Viewjobdetail;
