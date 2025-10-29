import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";

export default function TeacherProfile({navigation}) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Cover + Avatar */}
      <ImageBackground
        source={require("./Ali.jpeg")}
        style={styles.coverImg}
      >
        <Image source={require("./Ali.jpeg")} style={styles.avatar} />
      </ImageBackground>

      {/* Profile Info */}
      <View style={{ alignItems: "center", marginTop: 70 }}>
        <Text style={styles.name}>Ahmed</Text>
        <Text style={styles.role}>Male Teacher</Text>
        <Text style={styles.subject}>Computer Science Teacher</Text>
        <Text style={styles.availability}>
          Available for a job or private lessons
        </Text>
      </View>

      {/* Last Job */}
      <View style={styles.lastJobBox}>
        <Text style={styles.lastJobText}>Last Job</Text>
        <Text style={styles.lastJobDetail}>
          Computer Science Teacher at Progressive Public School (2019 - 2024)
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Years Experience</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>25</Text>
          <Text style={styles.statLabel}>Projects Guided</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>120</Text>
          <Text style={styles.statLabel}>Students Taught</Text>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutBox}>
        <Text style={styles.aboutTitle}>About this teacher</Text>
        <Text style={styles.aboutText}>
          As a Computer Science teacher, I specialize in programming,
          algorithms, and problem-solving. My goal is to make coding easy
          and exciting for students by combining theory with practical
          projects. I focus on helping learners understand core concepts
          of Python, Java, and web development, while encouraging
          creativity, logical thinking, and real-world application of
          computer science.{"\n\n"}
          I have successfully guided many students at Progressive Public
          School to achieve excellent results and develop a strong interest
          in technology and innovation.
        </Text>
      </View>

      {/* Main Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity onPress={()=> navigation.navigate("Chat")} style={styles.chatBtn}>
          <Text style={styles.chatText}>Chat with Teacher</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigation.navigate("Hirepage")} style={styles.hireBtn}>
          <Text style={styles.hireText}>Send Hiring Request</Text>
        </TouchableOpacity>
      </View>

      {/* Extra Buttons */}
      <View style={styles.extraBtnRow}>
        <TouchableOpacity  onPress={()=> navigation.navigate("Favourite")} style={styles.extraBtn}>
          <Text style={styles.extraText}>⭐ Save to Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.extraBtn}>
          <Text style={styles.extraText}>📤 Share Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  coverImg: {
    width: "100%",
    height: 180,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: -40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: -60,
    alignSelf: "center",
    backgroundColor: "#eee",
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#000" },
  role: { fontSize: 14, color: "purple", marginTop: 2 },
  subject: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  availability: { fontSize: 12, color: "#555", marginTop: 2 },

  lastJobBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  lastJobText: { fontWeight: "bold", fontSize: 16 },
  lastJobDetail: { fontSize: 13, color: "#333", marginTop: 4 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  statBox: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "purple",
    backgroundColor: "#d8b4e2",
    borderRadius: 10,
    padding: 10,
    width: "28%",
  },
  statValue: { fontSize: 16, fontWeight: "bold", marginTop: 4 },
  statLabel: { fontSize: 12, color: "#555", textAlign: "center", marginTop: 2 },

  aboutBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "purple",
    borderRadius: 10,
  },
  aboutTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  aboutText: { fontSize: 13, color: "#333", lineHeight: 20 },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  chatBtn: {
    borderWidth: 1,
    borderColor: "purple",
    backgroundColor: "purple",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    width: "40%",
    alignItems: "center",
  },
  chatText: { color: "white", fontWeight: "600" },

  hireBtn: {
    borderWidth: 1,
    borderColor: "purple",
    backgroundColor: "purple",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    width: "40%",
    alignItems: "center",
  },
  hireText: { color: "white", fontWeight: "600" },

  extraBtnRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  extraBtn: {
    borderWidth: 1,
    borderColor: "purple",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 25,
    width: "40%",
    alignItems: "center",
  },
  extraText: { color: "purple", fontWeight: "600" },
});
