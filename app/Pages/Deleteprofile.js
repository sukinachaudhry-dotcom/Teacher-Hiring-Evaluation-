import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Deleteprofile = () => {
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
          <TouchableOpacity style={{ marginLeft: 10 }}>
            <MaterialIcons name="radio-button-on" size={28} color="purple" />
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
          <TouchableOpacity style={{ marginLeft: 10 }}>
            <MaterialIcons name="radio-button-off" size={28} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            paddingVertical: 15,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Deleteprofile;
