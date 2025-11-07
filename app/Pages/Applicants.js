import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Applicants() {
  
  const applicants = [
    {
      id: "1",
      name: "Ali Khan",
      subject: "Computer Science",
      experience: "3 years",
      location: "Karachi",
      image: require("./Ahmed.jpg"),
    },
    {
      id: "2",
      name: "Ayesha Malik",
      subject: "Mathematics",
      experience: "5 years",
      location: "Lahore",
      image: require("./Ali.jpeg"),
    },
    {
      id: "3",
      name: "Mahira Ahmed",
      subject: "English",
      experience: "2 years",
      location: "Islamabad",
      image: require("./Ali.jpeg"),
    },
  ];

  const renderApplicant = ({ item }) => (
    <View style={styles.card}>
      {/* Profile Row */}
      <View style={styles.row}>
        <Image source={item.image} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>{item.subject} Teacher</Text>
          <Text style={styles.detail}>Experience: {item.experience}</Text>
          <Text style={styles.detail}>
            <Icon name="location-on" size={14} color="purple" /> {item.location}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: "purple" }]}>
          <Text style={styles.btnText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: "purple" }]}>
          <Text style={styles.btnText}>Take Evaluation Test</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: "purple" }]}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
      <Text style={styles.header}>Applicants</Text>

      <FlatList
        data={applicants}
        renderItem={renderApplicant}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "purple",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "purple",
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  detail: { fontSize: 13, color: "#555", marginTop: 2 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
});
