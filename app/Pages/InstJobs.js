import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from "react-native";

const JobsScreen = ({navigation}) => {
  const [jobs, setJobs] = useState([
    { id: 1, title: "Physics Lecturer", applicants: 5 },
    { id: 2, title: "Mathematics Teacher", applicants: 3 },
    { id: 3, title: "Computer Science Instructor", applicants: 8 },
    { id: 4, title: "English Teacher", applicants: 6 },
  ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d8b4e2" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333" }}>
            Manage Jobs
          </Text>
        </View>

        {/* Job Cards */}
        {jobs.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: "#fff",
              marginHorizontal: 20,
              marginBottom: 15,
              borderRadius: 12,
              padding: 15,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4A235A" }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 14, color: "#555", marginTop: 5 }}>
              {item.applicants} Applicants
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Viewjobdetail")}
                style={{
                  backgroundColor: "purple",
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                }}
              >
                
                <Text style={{ color: "#fff", fontWeight: "bold" }}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={() =>
                //   setJobs(jobs.filter((job) => job.id !== item.id))
                // }
                style={{
                  backgroundColor: "red",
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default JobsScreen;
