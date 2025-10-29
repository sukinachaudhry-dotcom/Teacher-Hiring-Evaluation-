import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Notifications({navigation}) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Notifications
      </Text>

      {/* Notification 1 */}
      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="person-add-outline" size={22} color="black" style={{ marginRight: 10 }} />
          <Text>Ali Khan sent you a hiring request</Text>
        </View>
        <Text style={{ color: "gray", marginTop: 5, fontSize: 12 }}>1 hr ago</Text>
        <TouchableOpacity  style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, marginTop: 10 }}>
          <Text onPress={() => navigation.navigate("ViewDetails")} style={{ color: "#fff", textAlign: "center" }}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Notification 2 */}
      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="checkmark-done-outline" size={22} color="black" style={{ marginRight: 10 }} />
          <Text>Lahore College shortlisted your profile</Text>
        </View>
        <Text style={{ color: "gray", marginTop: 5, fontSize: 12 }}>2 hrs ago</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ShortlistDetails")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, marginTop: 10 }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Notification 3 */}
      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="calendar-outline" size={22} color="black" style={{ marginRight: 10 }} />
          <Text>Beaconhouse University scheduled your interview</Text>
        </View>
        <Text style={{ color: "gray", marginTop: 5, fontSize: 12 }}>3 hrs ago</Text>
        <TouchableOpacity onPress={() => navigation.navigate("InterviewDetails")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, marginTop: 10 }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>View</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
