import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

const ChangePass = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>
      {/* Header */}
      <View
        style={{
          height: 200,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#333" }}>
          Change Password
        </Text>
        <Text style={{ color: "#555", marginTop: 10, textAlign: "center" }}>
          Your password must be at least 6 characters and include a combination{"\n"}
          of numbers, letters, and special characters (!@$%).
        </Text>
      </View>

      {/* Form Section */}
      <View
        style={{
          padding: 30,
          marginTop: -25,
          backgroundColor: "white",
          borderRadius: 50,
        }}
      >
        {/* Current Password */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Current Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            placeholder="Current password"
            placeholderTextColor="#999"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={{ flex: 1, color: "#333", height: 40 }}
          />
        </View>

        {/* New Password */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          New Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            placeholder="New password"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            style={{ flex: 1, color: "#333", height: 40 }}
          />
        </View>

        {/* Re-type New Password */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Re-type New Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            placeholder="Re-type new password"
            placeholderTextColor="#999"
            value={retypePassword}
            onChangeText={setRetypePassword}
            style={{ flex: 1, color: "#333", height: 40 }}
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")} style={{ marginBottom: 20 }}>
          <Text style={{ color: "purple", fontWeight: "600", textAlign: "right" }}>
            Forgot your password?
          </Text>
        </TouchableOpacity>

        {/* Change Password Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Change Password
          </Text>
        </TouchableOpacity>

        {/* Back to Profile / Login */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: "purple", textAlign: "center", fontWeight: "600", fontSize: 16 }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChangePass;
