import React, { useEffect, useState } from "react";
import { View, Text, ScrollView,TextInput, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function TuitionJobs({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modeFilter, setModeFilter] = useState("all");

  useEffect(() => {
    const constraints = [
      where("role", "==", "Student"),
      where("profileCompleted", "==", true),
    ];
    if (modeFilter === "all") {
      constraints.push(where("modeofteaching", "in", ["inperson", "online", "hybrid"]));
    } else {
      constraints.push(where("modeofteaching", "==", modeFilter));
    }
    const q = query(collection(db, "users"), ...constraints);
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setStudents(list);
      setLoading(false);
    }, (e) => {
      setStudents([]);
      setLoading(false);
    });
    return () => unsub();
  }, [modeFilter]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
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
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginHorizontal: 8 }}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ClgJobs")}
                              style={{ backgroundColor: "purple", padding: 15, borderRadius: 50,  marginLeft: 5 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginHorizontal: 8 }}>School/College </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("UniJobs")}
                              style={{ backgroundColor: "purple", padding: 15, borderRadius: 50,  marginLeft: 5 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginHorizontal: 8 }}>University </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("CoursesJobs")}
                              style={{ backgroundColor: "purple", padding: 15, borderRadius: 50,  marginLeft: 5 }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginHorizontal: 8 }}>Courses</Text>
                    </TouchableOpacity>
                    
                  </View>
                </ScrollView> */}

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => setModeFilter("all")}
                      style={{ backgroundColor: modeFilter === "all" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, fontWeight: "bold", color: modeFilter === "all" ? "white" : "purple", marginHorizontal: 8 }}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModeFilter("inperson")}
                      style={{ backgroundColor: modeFilter === "inperson" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, fontWeight: "bold", color: modeFilter === "inperson" ? "white" : "purple", marginHorizontal: 8 }}>In-person</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModeFilter("online")}
                      style={{ backgroundColor: modeFilter === "online" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, fontWeight: "bold", color: modeFilter === "online" ? "white" : "purple", marginHorizontal: 8 }}>Online</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModeFilter("hybrid")}
                      style={{ backgroundColor: modeFilter === "hybrid" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, fontWeight: "bold", color: modeFilter === "hybrid" ? "white" : "purple", marginHorizontal: 8 }}>Hybrid</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>

      {/* Jobs Container */}
      <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : students.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No student profiles yet.</Text>
        ) : (
          students.map((s) => (
            <View key={s.id} style={{ backgroundColor: "#d8b4e2", padding: 15, borderRadius: 10, marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>{s.fullname || "Student"}</Text>
              <Text>{s.address || ""}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                <Text>{s.selectclass ? `Class: ${s.selectclass}` : ""}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Ionicons name="book-outline" size={18} color="black" style={{ marginRight: 6 }} />
                <Text>{s.subjects ? `Subject: ${s.subjects}` : ""}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <MaterialCommunityIcons name="account-school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                <Text>{s.modeofteaching ? `Mode: ${s.modeofteaching}` : ""}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <TouchableOpacity style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
                  <Text style={{ color: "#fff", textAlign: "center" }}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
                  <Text style={{ color: "#fff", textAlign: "center" }}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

    </ScrollView>
  );
}