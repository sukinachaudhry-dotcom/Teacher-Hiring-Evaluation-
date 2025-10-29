import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const JobDetail = ({ route, navigation }) => {
  // Example job data (you can also pass via navigation route params)
  const job = route?.params?.job || {
    id: "1",
    name: "City School",
    type: "Institute",
    subject: "Mathematics Teacher",
    location: "Lahore",
    established: "2005",
    experience: "3+ Years Required",
    jobVacancy: "Mathematics Teacher Required (8am to 1pm)",
    description:
      "We are looking for an experienced Mathematics Teacher who can teach grades 6–10. The candidate should have strong subject knowledge and good communication skills.",
    image: require("./School.jpeg"),
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8f8f8" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Job Image */}
      <Image
        source={job.image}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 15,
          marginBottom: 20,
        }}
      />

      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        {job.jobVacancy}
      </Text>

      {/*  Teacher Info */}
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{job.name}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Ionicons name="briefcase-outline" size={18} color="#555" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 14, color: "#555" }}>{job.type}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Ionicons name="location-outline" size={18} color="#555" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 14, color: "#555" }}>
          Location: {job.location}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name="calendar-outline" size={18} color="#555" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 14, color: "#555" }}>
          Established: {job.established}
        </Text>
      </View>

      {/* Job Requirements */}
      <View style={{
        backgroundColor: "#d8b4e2",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: "purple"
      }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Requirements:
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
          <Ionicons name="book-outline" size={18} color="#444" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: "#444" }}>
            Subject: {job.subject}
          </Text>
        </View>

        {/* Experience with Icon */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="briefcase-outline" size={18} color="#444" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: "#444" }}>
            Experience: {job.experience}
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={{
        backgroundColor: "#d8b4e2",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: "purple"
      }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          Job Description:
        </Text>
        <Text style={{ fontSize: 14, color: "#444", lineHeight: 20 }}>
          {job.description}
        </Text>
      </View>

      {/* Apply Button */}
      <TouchableOpacity onPress={() => navigation.navigate("Submitted")}
        style={{
          marginTop: 30,
          backgroundColor: "purple",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
       
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          Apply Now
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default JobDetail;
