import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

const Password = ({ navigation }) => {
  const [email, setEmail] = useState("");

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
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#333" }}>
          Forgot Password
        </Text>
        <Text
          style={{
            color: "#555",
            marginTop: 10,
            textAlign: "center",
            paddingHorizontal: 30,
          }}
        >
          Enter your registered email to reset your password
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
        {/* Email Input */}
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
          Email
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 20,
            height: 45,
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={{ flex: 1, color: "#333", height: 40 }}
          />
        </View>

        {/* Send Verification Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Send Verification Code
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 10 }}>
          <Text
            style={{
              color: "purple",
              textAlign: "center",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Password;
