import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";

export default function Viewprofile({ navigation }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Cover + Profile */}
      <ImageBackground
        source={require("./Ahmed.jpg")}
        style={{
          width: "100%",
          height: 180,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: -40,
        }}
      >
        <Image
          source={require("./Ahmed.jpg")}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: "#fff",
            marginBottom: -60,
            alignSelf: "center",
            backgroundColor: "#eee",
          }}
        />
      </ImageBackground>

      {/* Basic Info */}
      <View style={{ alignItems: "center", marginTop: 70 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
          Ahmed
        </Text>
        <Text style={{ fontSize: 14, color: "purple", marginTop: 2 }}>
          Male Teacher
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "600", marginTop: 4 }}>
          Computer Science Teacher
        </Text>
        <Text style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
          Available for a job or private lessons
        </Text>
      </View>

      {/* Last Job */}
      <View
        style={{
          marginTop: 15,
          padding: 12,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Last Job</Text>
        <Text style={{ fontSize: 13, color: "#333", marginTop: 4 }}>
          Computer Science Teacher at Progressive Public School (2019 - 2024)
        </Text>
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 15,
        }}
      >
        <View
          style={{
            alignItems: "center",
            borderWidth: 1,
            borderColor: "purple",
            backgroundColor: "#d8b4e2",
            borderRadius: 10,
            padding: 10,
            width: "28%",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 4 }}>5</Text>
          <Text
            style={{
              fontSize: 12,
              color: "#555",
              textAlign: "center",
              marginTop: 2,
            }}
          >
            Years Experience
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            borderWidth: 1,
            borderColor: "purple",
            backgroundColor: "#d8b4e2",
            borderRadius: 10,
            padding: 10,
            width: "28%",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 4 }}>
            25
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#555",
              textAlign: "center",
              marginTop: 2,
            }}
          >
            Projects Guided
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            borderWidth: 1,
            borderColor: "purple",
            backgroundColor: "#d8b4e2",
            borderRadius: 10,
            padding: 10,
            width: "28%",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 4 }}>
            120
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#555",
              textAlign: "center",
              marginTop: 2,
            }}
          >
            Students Taught
          </Text>
        </View>
      </View>

      {/* About */}
      <View
        style={{
          marginTop: 15,
          padding: 12,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "purple",
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>
          About this teacher
        </Text>
        <Text style={{ fontSize: 13, color: "#333", lineHeight: 20 }}>
          As a Computer Science teacher, I specialize in programming, algorithms,
          and problem-solving. My goal is to make coding easy and exciting for
          students by combining theory with practical projects. I focus on
          helping learners understand core concepts of Python, Java, and web
          development, while encouraging creativity, logical thinking, and
          real-world application of computer science.{"\n\n"}I have successfully
          guided many students at Progressive Public School to achieve excellent
          results and develop a strong interest in technology and innovation.
        </Text>
      </View>

      {/* Edit Profile Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 25,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 25,
          }}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
