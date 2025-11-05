import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";

const JobsScreen = ({navigation}) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const uid = auth?.currentUser?.uid;
    if (!uid) return;
    const q = query(collection(db, "post jobs"), where("institutionId", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setJobs(list);
    }, () => setJobs([]));
    return () => unsub();
  }, []);

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
