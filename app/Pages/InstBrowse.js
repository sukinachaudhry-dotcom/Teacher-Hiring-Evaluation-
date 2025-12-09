import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { getDataById, getOrCreateConversation } from "../Helper/firebaseHelper";

export default function InstBrowse({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Simple query - just fetch all jobs from post jobs collection
    const unsubscribe = onSnapshot(
      collection(db, "post jobs"),
      (snap) => {
        const jobsList = [];
        snap.forEach((doc) => {
          const j = doc.data();
          jobsList.push({
            id: doc.id,
            title: j.jobTitle || "Teaching Job",
            city: j.location || "",
            salary: j.salary || "",
            subject: j.subject || "",
            jobType: j.jobType || "",
            requirements: j.requirements || "",
            experience: j.experience || "",
            classLevel: j.classLevel || "",
            jobId: doc.id,
            institutionId: j.institutionId || "",
            status: j.status || "active",
          });
        });
        setJobs(jobsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching jobs:", error);
        setJobs([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>

      {/* Header */}
      <View
        style={{
          backgroundColor: 'purple',
          paddingVertical: 10,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Bar */}
        <TextInput
          placeholder="Search Jobs"
          placeholderTextColor="#999"
          style={{
            flex: 1,
            backgroundColor: '#fff',
            marginHorizontal: 10,
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 40,
          }}
        />
      </View>
     {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
  <View style={{ flexDirection: "row" }}>
    <TouchableOpacity onPress={() => navigation.navigate("InstBrowse")}
              style={{ backgroundColor: "purple", padding: 15, borderRadius: 50,  marginLeft: 5 }}>
    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginHorizontal: 8 }}>Institution Jobs</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate("PrivBrowse")}
              style={{ backgroundColor: "purple", padding: 15, borderRadius: 50,  marginLeft: 5 }}>
    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginHorizontal: 8 }}>Private Jobs</Text>
    </TouchableOpacity>
    
  </View>
</ScrollView> */}


      {/* Jobs List */}
      <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : jobs.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No institution jobs yet.</Text>
        ) : (
          jobs.map((job) => (
            <View key={job.id} style={{
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
              <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8, color: "#000" }}>
                {job.title || "Teaching Job"}
              </Text>
              
              {job.subject && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <Ionicons name="book-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: "#333" }}>Subject: {job.subject}</Text>
                </View>
              )}
              
              {job.city && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <Ionicons name="location-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: "#333" }}>{job.city}</Text>
                </View>
              )}
              
              {job.classLevel && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: "#333" }}>Class: {job.classLevel}</Text>
                </View>
              )}
              
              {job.jobType && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <Ionicons name="time-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: "#333" }}>Timing: {job.jobType}</Text>
                </View>
              )}
              
              {job.experience && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <Ionicons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: "#333" }}>Experience: {job.experience}</Text>
                </View>
              )}
              
              {job.salary && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14, color: "#333", fontWeight: "600" }}>Salary: {job.salary}</Text>
                </View>
              )}
              
              {job.requirements && (
                <View style={{ marginTop: 8, padding: 8, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 5 }}>
                  <Text style={{ fontSize: 12, color: "#555", fontWeight: "600", marginBottom: 4 }}>Requirements:</Text>
                  <Text style={{ fontSize: 12, color: "#666" }} numberOfLines={2}>
                    {job.requirements}
                  </Text>
                </View>
              )}
              
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("Jobdetails", { jobId: job.jobId || job.id })} 
                  style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}
                >
                  <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={async () => {
                    try {
                      const auth = getAuth();
                      const currentUser = auth.currentUser;
                      
                      if (currentUser && job.institutionId) {
                        const conversationId = await getOrCreateConversation(currentUser.uid, job.institutionId);
                        const otherUser = await getDataById('users', job.institutionId);
                        navigation.navigate('ChatScreen', {
                          conversationId,
                          otherUser: {
                            id: job.institutionId,
                            name: otherUser?.institutionname || 'Institution',
                            photoUrl: otherUser?.profileImage || null,
                          }
                        });
                      }
                    } catch (error) {
                      console.error('Error starting chat:', error);
                    }
                  }}
                  style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}
                >
                  <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
