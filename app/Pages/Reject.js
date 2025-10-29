import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function Reject({navigation}) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
        Request Rejected
      </Text>

      <View style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Ali Khan</Text>
        <Text>Mathematics Teacher</Text>
        <Text>ABC School, Lahore</Text>
        <Text>Request has been rejected successfully!</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Go to Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Home1")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
