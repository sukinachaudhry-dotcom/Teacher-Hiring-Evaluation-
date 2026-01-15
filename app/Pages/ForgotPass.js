import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { forgotPassword } from "../Helper/firebaseHelper";

const Password = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    // Email validation
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email.trim());
      Alert.alert(
        "Success",
        "Password reset email has been sent to your email address. Please check your inbox and follow the instructions to reset your password.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login")
          }
        ]
      );
    } catch (error) {
      console.error("Forgot password error:", error);
      let errorMessage = "Failed to send password reset email. Please try again.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          onPress={handleForgotPassword}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginBottom: 20,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Send Reset Link
            </Text>
          )}
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
