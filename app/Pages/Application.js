import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function MyApplicationsScreen({navigation}) {
  // Dummy data for applications
  const applications = [
    {
      id: "1",
      title: "Home Tuition for Class 8th",
      institute: "Haya Academy, Karachi",
      salary: "Rs. 25,000",
      status: "Pending",
    },
    {
      id: "2",
      title: "Mathematics Teacher",
      institute: "Bright Future School, Lahore",
      salary: "Rs. 40,000",
      status: "Shortlisted",
    },
    {
      id: "3",
      title: "Science Instructor",
      institute: "City Academy, Islamabad",
      salary: "Rs. 35,000",
      status: "Interview Scheduled",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
        <Text style={styles.institute}>{item.institute}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
        <Text style={styles.salary}>{item.salary}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <MaterialCommunityIcons name="progress-clock" size={18} color="black" style={{ marginRight: 6 }} />
        <Text style={styles.status}>Status: {item.status}</Text>
      </View>

                
      <TouchableOpacity   onPress={() => navigation.navigate("Jobdetails")} style={styles.button}>
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 15 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
        My Applications
      </Text>
      <FlatList
        data={applications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  institute: {
    fontSize: 14,
    color: "#555",
  },
  salary: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    color: "purple",
  },
  button: {
    backgroundColor: "purple",
    padding: 8,
    borderRadius: 20,
    marginTop: 10,
  },
});
