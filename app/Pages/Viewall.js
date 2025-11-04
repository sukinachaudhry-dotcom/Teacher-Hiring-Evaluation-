import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

export default function Viewall({ navigation }) {
  // Dummy teachers data
  const teachers = [
    {
      name: "Ali Hassan",
      subject: "Computer",
      exp: "+5 Years Exp",
      desc: "Available for job or private lessons",
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
  ];

  const TeacherCard = ({ teacher }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: "#d8b4e2",
        padding: 10,
        borderRadius: 12,
        marginBottom: 15,
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
      <Text style={{ marginTop: 5, fontWeight: "bold", textAlign: "center" }}>
        {teacher.name}
      </Text>
      <Text style={{ marginTop: 2, fontWeight: "bold", textAlign: "center" }}>
        {teacher.subject}
      </Text>
      <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
        {teacher.desc}
      </Text>
      <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
        {teacher.exp}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "purple",
            padding: 8,
            marginHorizontal: 3,
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("Instituteviewprofile")}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "purple",
            padding: 8,
            marginHorizontal: 3,
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      {/* 🔍 Search Bar */}
      <View
        style={{
          backgroundColor: "purple",
          paddingVertical: 20,
          paddingHorizontal: 10,
        }}
      >
        
         <TextInput
          placeholder="Search Jobs"
          placeholderTextColor="#999"
          style={{
            // flex: 1,
            backgroundColor: '#fff',
            marginHorizontal: 10,
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 40,
            
          }}
        />
      </View>

      {/* 📌 Menu Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("PopularTeachers")}
            style={{
              backgroundColor: "purple",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 50,
              marginLeft: 8,
            }}
          >
            <Text onPress={()=> navigation.navigate("Popularteachers")} style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
              Popular Teachers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("RecentTeachers")}
            style={{
              backgroundColor: "purple",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 50,
              marginLeft: 8,
            }}
          >
            <Text onPress={()=> navigation.navigate("Recentteacher")} style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
              Recent Teachers
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 👨‍🏫 Teacher Cards */}
      <View style={{ paddingHorizontal: 10 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "purple",
            marginVertical: 10,
          }}
        >
          All Teachers
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {teachers.map((t, i) => (
            <TeacherCard key={i} teacher={t} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
