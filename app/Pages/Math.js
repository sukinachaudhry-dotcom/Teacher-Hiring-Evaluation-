// MathCoursesPage.js
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

export default function MathCoursesPage({ navigation }) {
  const [search, setSearch] = useState("");

  // ✅ Math Courses Data
  const mathCourses = [
    {
      name: "Algebra Basics",
      desc: "Learn equations, polynomials, and linear functions",
      exp: "8 Modules",
      img: require("./Ali.jpeg"),
    },
    {
      name: "Geometry",
      desc: "Shapes, angles, theorems, and constructions",
      exp: "10 Modules",
      img: require("./Ali.jpeg"),
    },
    {
      name: "Calculus",
      desc: "Differentiation & Integration with applications",
      exp: "12 Modules",
      img: require("./Ali.jpeg"),
    },
    {
      name: "Statistics",
      desc: "Probability, data analysis, and distributions",
      exp: "9 Modules",
      img: require("./Ali.jpeg"),
    },
  ];

  // ✅ Search Filter
  const filteredCourses = mathCourses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Course Card Component
  const CourseCard = ({ course }) => (
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
        
        
      }}
    >
      <Image
        source={course.img}
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
        {course.name}
      </Text>
      <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
        {course.desc}
      </Text>
      <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
        {course.exp}
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
          onPress={() => alert(`View details of ${course.name}`)}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>
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
          onPress={() => alert(`Enroll in ${course.name}`)}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>
            View
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🔥 Purple Header */}
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
       

        <TextInput
          placeholder="Search Math Courses"
          placeholderTextColor="#ddd"
          value={search}
          onChangeText={setSearch}
          style={{
            flex: 1,
            backgroundColor: "#fff",
            marginHorizontal: 10,
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 40,
            fontSize: 14,
          }}
        />

        
      </View>

      {/* ✅ Courses Grid */}
      <ScrollView style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
              No math courses found
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
