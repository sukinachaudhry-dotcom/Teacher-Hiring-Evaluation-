import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { deleteData } from "../Helper/firebaseHelper";
import { useDispatch } from 'react-redux';
import { setRole, setUser } from '../Redux/Slices/HomeDataSlice';
import { persistor } from '../Redux/Store/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Deleteprofile = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState("delete"); // "deactivate" or "delete"
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    if (selectedOption === "deactivate") {
      Alert.alert(
        "Deactivate Account",
        "Account deactivation feature is not yet implemented. Please use delete account instead.",
        [{ text: "OK" }]
      );
      return;
    }

    // For delete account, require password confirmation
    if (!password) {
      Alert.alert("Error", "Please enter your password to confirm account deletion");
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone. All your data will be permanently removed.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !user.email) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      // Re-authenticate user with password
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user document from Firestore
      try {
        await deleteData("users", user.uid);
        console.log("User document deleted from Firestore");
      } catch (firestoreError) {
        console.error("Error deleting user document:", firestoreError);
        // Continue with account deletion even if Firestore deletion fails
      }

      // Delete Firebase Auth user
      await deleteUser(user);

      // Clear Redux state
      dispatch(setRole(""));
      dispatch(setUser({}));

      // Clear persisted Redux state
      await persistor.purge();

      // Clear AsyncStorage
      try {
        await AsyncStorage.clear();
      } catch (storageError) {
        console.warn("Error clearing AsyncStorage:", storageError);
      }

      // Navigate to login screen with complete reset
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });

      Alert.alert(
        "Account Deleted",
        "Your account has been permanently deleted. We're sorry to see you go."
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      setLoading(false);
      let errorMessage = "Failed to delete account. Please try again.";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "For security reasons, please log out and log in again before deleting your account.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>
      {/* Header */}
      <View
        style={{
          height: 150,
          borderBottomLeftRadius: 80,
          borderBottomRightRadius: 80,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "#d8b4e2",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
          Deactivating or deleting your account
        </Text>
        <Text
          style={{
            color: "#555",
            marginTop: 10,
            textAlign: "center",
            paddingHorizontal: 10,
          }}
        >
          If you want to take a break from this app, you can temporarily
          deactivate your account. If you want to permanently delete your
          account, you can also do that. You can only deactivate your account
          once a week.
        </Text>
      </View>

      {/* Options */}
      <View style={{ padding: 40, marginTop: -30 }}>
        {/* Deactivate Account */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#333",
                marginBottom: 5,
              }}
            >
              Deactivate account
            </Text>
            <Text style={{ color: "#555", fontSize: 14 }}>
              Deactivating your account is temporary. Your profile and
              information will be hidden until you log in again.
            </Text>
          </View>
          <TouchableOpacity 
            style={{ marginLeft: 10 }}
            onPress={() => setSelectedOption("deactivate")}
          >
            <MaterialIcons 
              name={selectedOption === "deactivate" ? "radio-button-on" : "radio-button-off"} 
              size={28} 
              color={selectedOption === "deactivate" ? "purple" : "gray"} 
            />
          </TouchableOpacity>
        </View>

        {/* Delete Account */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#333",
                marginBottom: 5,
              }}
            >
              Delete account
            </Text>
            <Text style={{ color: "#555", fontSize: 14 }}>
              Deleting your account is permanent. All your profile details,
              applications, messages, and activity will be permanently removed.
            </Text>
          </View>
          <TouchableOpacity 
            style={{ marginLeft: 10 }}
            onPress={() => setSelectedOption("delete")}
          >
            <MaterialIcons 
              name={selectedOption === "delete" ? "radio-button-on" : "radio-button-off"} 
              size={28} 
              color={selectedOption === "delete" ? "purple" : "gray"} 
            />
          </TouchableOpacity>
        </View>

        {/* Password Input for Delete Account */}
        {selectedOption === "delete" && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 15,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 8, color: "#333" }}>
              Enter your password to confirm:
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                height: 45,
                backgroundColor: "#fff",
              }}
            >
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ flex: 1, color: "#333", height: 40 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ color: "purple", fontSize: 12 }}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "purple",
            paddingVertical: 15,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {loading && (
            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
          )}
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {loading ? "Deleting Account..." : "Confirm"}
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "purple", textAlign: "center", fontWeight: "600", fontSize: 16 }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Deleteprofile;
