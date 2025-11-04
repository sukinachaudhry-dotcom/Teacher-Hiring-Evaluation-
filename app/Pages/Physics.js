import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CoursesPage({ navigation }) {
  const [search, setSearch] = useState("");

  // Dummy Teacher Data
  const teachers = [
    {
      name: "Ali Hassan",
      subject: "Computer",
      exp: "+5 Years Exp",
      desc: "Available for a job or private lessons",
      img: require("./Ali.jpeg"),
    },
    {
      name: "Sara Ali",
      subject: "Chemistry",
      exp: "+2 Years Exp",
      desc: "Available for online private lessons",
      img: require("./Ali.jpeg"),
    },
    {
      name: "Usman Khan",
      subject: "Physics",
      exp: "+7 Years Exp",
      desc: "Expert in Physics & Mechanics",
      img: require("./Ali.jpeg"),
    },
    {
      name: "Ayesha Noor",
      subject: "Maths",
      exp: "+4 Years Exp",
      desc: "Algebra & Calculus Specialist",
      img: require("./Ali.jpeg"),
    },
    {
      name: "Fatima Zahra",
      subject: "Biology",
      exp: "+3 Years Exp",
      desc: "Helping students in Medical fields",
      img: require("./Ali.jpeg"),
    },
  ];

  // 🔎 Search Filter
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 Reusable Teacher Card
  const TeacherCard = ({ teacher }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: "#d8b4e2",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: "purple",
      }}
    >
      <Image
        source={teacher.img}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          alignSelf: "center",
        }}
      />
      <Text
        style={{
          marginTop: 5,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {teacher.name}
      </Text>
      <Text
        style={{
          marginTop: 2,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {teacher.subject}
      </Text>
      <Text
        style={{
          marginTop: 2,
          color: "#555",
          textAlign: "center",
        }}
      >
        {teacher.desc}
      </Text>
      <Text
        style={{
          marginTop: 2,
          color: "#555",
          textAlign: "center",
        }}
      >
        {teacher.exp}
      </Text>

      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            padding: 8,
            borderRadius: 20,
            flex: 1,
            marginRight: 5,
          }}
          onPress={() => navigation.navigate("Instituteviewprofile")}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Detail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            padding: 8,
            borderRadius: 20,
            flex: 1,
            marginLeft: 5,
          }}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🔵 Header */}
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "purple",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
          Courses
        </Text>

        <Ionicons name="book" size={28} color="white" />
      </View>

      {/* 🔎 Search Bar */}
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Search Teachers by name or subject..."
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 40,
            fontSize: 14,
            borderWidth: 1,
            borderColor: "#ccc",
          }}
        />
      </View>

      {/* 🎴 Teachers List */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher, index) => (
              <TeacherCard key={index} teacher={teacher} />
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
              No teachers found
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
