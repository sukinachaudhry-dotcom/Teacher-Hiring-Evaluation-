import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const teachers = [
  {
    id: "1",
    name: "Annaya",
    subject: "Classroom Teacher",
    availability: "Available for a job or private lessons",
    experience: "+15 Years Exp",
    image: require("./Ahmed.jpg"),
  },
  {
    id: "2",
    name: "Haya",
    subject: "English",
    availability: "Available for online private lessons",
    experience: "+4 Years Exp",
    image: require("./Ahmed.jpg"),
  },
  {
    id: "3",
    name: "Anas",
    subject: "Physics",
    availability: "Available for offline private lessons",
    experience: "+15 Years Exp",
    image: require("./Ahmed.jpg"),
  },
  {
    id: "4",
    name: "Ahmad",
    subject: "Math",
    availability: "Available for offline private lessons",
    experience: "+10 Years Exp",
    image: require("./Ahmed.jpg"),
  },
];

export default function TeachersScreen() {
  const [selectedTab, setSelectedTab] = useState("All");
  const [query, setQuery] = useState("");

  const renderTeacher = ({ item }) => (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 15,
        margin: 8,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
         borderWidth: 2,        // 👈 Border line add
    borderColor: "purple",
        elevation: 4,
      }}
    >
      {/* Profile Image */}
      <Image
        source={item.image}
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          alignSelf: "center",
        }}
      />

      {/* Name */}
      <Text
        style={{
          marginTop: 10,
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "center",
          color: "#4B0082",
        }}
      >
        {item.name}
      </Text>

      {/* Subject Badge */}
      <View
        style={{
          alignSelf: "center",
          marginTop: 4,
          backgroundColor: "#d8b4e2",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
          {item.subject}
        </Text>
      </View>

      {/* Availability */}
      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          color: "#555",
          textAlign: "center",
        }}
      >
        {item.availability}
      </Text>

      {/* Experience */}
      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          color: "#888",
          textAlign: "center",
        }}
      >
        {item.experience}
      </Text>

      {/* View Profile Button */}
      <TouchableOpacity
        style={{
          marginTop: 10,
          backgroundColor: "purple",
          paddingVertical: 8,
          borderRadius: 20,
        }}
        onPress={() => alert(`Profile of ${item.name}`)}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: 13,
            fontWeight: "600",
          }}
        >
          View Profile
        </Text>
      </TouchableOpacity>
    </View>
  );

  const filteredTeachers = teachers.filter((t) => {
    const inTab =
      selectedTab === "All" ? true : t.subject.toLowerCase().includes(selectedTab.toLowerCase());
    const inQuery =
      query.trim().length === 0
        ? true
        : (t.name + " " + t.subject + " " + t.availability)
            .toLowerCase()
            .includes(query.toLowerCase());
    return inTab && inQuery;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🔍 Clean Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f4f4f4",
          borderRadius: 25,
          paddingHorizontal: 14,
          marginHorizontal: 15,
          marginTop: 16,
          elevation: 2,
          borderWidth: 1,
          borderColor: "#e8e8e8",
          height: 46,
        }}
      >
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search teachers, subjects, availability..."
          placeholderTextColor="#888"
          style={{
            flex: 1,
            marginLeft: 8,
            fontSize: 14,
          }}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* 🔵 Tabs (Subjects) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 15,
          paddingHorizontal: 10,
        }}
      >
        {["All", "Computer", "Physics", "Chemistry", "Math"].map((tab, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedTab(tab)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 18,
              borderRadius: 20,
              backgroundColor: selectedTab === tab ? "purple" : "#d8b4e2",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🟣 Teachers Grid */}
      <FlatList
        data={filteredTeachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 5 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#666", marginTop: 30 }}>
            No teachers found.
          </Text>
        }
      />
    </View>
  );
}
