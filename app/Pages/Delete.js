import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function DeleteJobPost({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
      }}
    >
      {/* Confirmation Text */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "purple",
          marginBottom: 15,
          textAlign: "center",
        }}
      >
        Delete Job Post?
      </Text>
      <Text style={{ fontSize: 16, color: "#555", textAlign: "center", marginBottom: 30 }}>
        Are you sure you want to delete this job post?  
        This action cannot be undone.
      </Text>

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
        {/* Cancel Button */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "purple",
            padding: 15,
            borderRadius: 30,
            marginRight: 10,
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "purple",
            padding: 15,
            borderRadius: 30,
            marginLeft: 10,
            alignItems: "center",
          }}
          onPress={() => {
            alert("Job Post Deleted Successfully!");
            navigation.goBack(); // Peechay le jane ke liye
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
