import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";

const ChangePass = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !retypePassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== retypePassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert("Error", "New password must be different from current password");
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !user.email) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      Alert.alert(
        "Success",
        "Password changed successfully",
        [
          {
            text: "OK",
            onPress: () => {
              setCurrentPassword("");
              setNewPassword("");
              setRetypePassword("");
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error changing password:", error);
      let errorMessage = "Failed to change password. Please try again.";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "New password is too weak. Please use a stronger password";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log out and log in again before changing your password";
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
            secureTextEntry={!showCurrentPassword}
            style={{ flex: 1, color: "#333", height: 40 }}
          />
          <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
            <Text style={{ color: "purple", fontSize: 12 }}>
              {showCurrentPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
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
            secureTextEntry={!showNewPassword}
            style={{ flex: 1, color: "#333", height: 40 }}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Text style={{ color: "purple", fontSize: 12 }}>
              {showNewPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
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
            secureTextEntry={!showRetypePassword}
            style={{ flex: 1, color: "#333", height: 40 }}
          />
          <TouchableOpacity onPress={() => setShowRetypePassword(!showRetypePassword)}>
            <Text style={{ color: "purple", fontSize: 12 }}>
              {showRetypePassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")} style={{ marginBottom: 20 }}>
          <Text style={{ color: "purple", fontWeight: "600", textAlign: "right" }}>
            Forgot your password?
          </Text>
        </TouchableOpacity>

        {/* Change Password Button */}
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "purple",
            paddingVertical: 12,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {loading && (
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
          )}
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {loading ? "Changing Password..." : "Change Password"}
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
