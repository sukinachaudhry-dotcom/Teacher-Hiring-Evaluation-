import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { collection, onSnapshot, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";

const JobsScreen = ({navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const user = auth?.currentUser;

  const handleDeleteJob = async (jobId) => {
    Alert.alert(
      "Delete Job",
      "Are you sure you want to delete this job posting?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "post jobs", jobId));
              console.log("Job deleted successfully");
            } catch (error) {
              console.error("Error deleting job:", error);
              Alert.alert("Error", "Failed to delete job. Please try again.");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const uid = auth?.currentUser?.uid;
    if (!uid) return;
    const q = query(
      collection(db, "post jobs"), 
      where("institutionId", "==", uid),
      where("status", "==", "active")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      console.log(list);
      
      setJobs(list);
    }, () => setJobs([]));
    return () => unsub();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "Black" }}>
              {item.jobTitle || "Teaching Job"}
            </Text>
            {!!item.location && (
              <Text style={{ fontSize: 14, color: "#555", marginTop: 5 }}>
                {item.location}
              </Text>
            )}
            {!!item.salary && (
              <Text style={{ fontSize: 14, color: "#555", marginTop: 5 }}>
                Salary: {item.salary}
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("EditJob", { jobId: item.id })}
                style={{
                  backgroundColor: "purple",
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => navigation.navigate("Applicants", {
                  screen: "ApplicantsList",
                  params: { 
                    jobId: item.id, 
                    jobTitle: item.jobTitle,
                    showTestResults: true
                  }
                })}
                style={{
                  backgroundColor: "#4CAF50",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  marginHorizontal: 5,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>View Applicants</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDeleteJob(item.id)}
                style={{
                  backgroundColor: "purple",
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
              </TouchableOpacity>
            </View>

            {expandedId === item.id && (
              <View style={{ marginTop: 15, backgroundColor: "#F8F4FB", padding: 12, borderRadius: 10 }}>
                {!!item.description && (
                  <Text style={{ fontSize: 14, color: "#333", marginBottom: 6 }}>
                    {item.description}
                  </Text>
                )}
                {!!item.jobType && (
                  <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                    Type: {item.jobType}
                  </Text>
                )}
                {!!item.subject && (
                  <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                    Subject: {item.subject}
                  </Text>
                )}
                {!!item.experience && (
                  <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                    Experience: {item.experience}
                  </Text>
                )}
                {!!item.timing && (
                  <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                    Timing: {item.timing}
                  </Text>
                )}
                {!!item.contactEmail && (
                  <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                    Email: {item.contactEmail}
                  </Text>
                )}
                {!!item.contactPhone && (
                  <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
                    Phone: {item.contactPhone}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default JobsScreen;
