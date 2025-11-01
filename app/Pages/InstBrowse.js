import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function InstBrowse({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all"); // all | school | college | university

  useEffect(() => {
    setLoading(true);
    let unsubs = [];
    let instList = [];
    let uniStudentList = [];

    if (typeFilter === "university") {
      const qInst = query(
        collection(db, "institutionJobs"),
        where("institutionType", "==", "university")
      );
      const u1 = onSnapshot(qInst, (snap) => {
        instList = [];
        snap.forEach((d) => {
          const j = d.data();
          instList.push({
            id: `inst_${d.id}`,
            title: j.title || "Teaching Job",
            institutionName: j.institutionName || "",
            city: j.city || "",
            address: j.address || "",
            classLevel: j.classLevel || j.grade || "",
            salary: j.salary || "",
          });
        });
        setJobs([...
          instList,
          ...uniStudentList
        ]);
        setLoading(false);
      }, () => {
        instList = [];
        setJobs([...
          instList,
          ...uniStudentList
        ]);
        setLoading(false);
      });

      const qStu = query(
        collection(db, "users"),
        where("role", "==", "Student"),
        where("profileCompleted", "==", true),
        where("modeofteaching", "in", ["inperson", "online", "hybrid"]),
        where("selectclass", "in", ["Undergraduate", "Postgraduate"])
      );
      const u2 = onSnapshot(qStu, (snap) => {
        uniStudentList = [];
        snap.forEach((d) => {
          const s = d.data();
          uniStudentList.push({
            id: `stu_${d.id}`,
            title: s.subjects ? `${s.subjects} Tutor Needed` : "University Level Tuition",
            institutionName: "",
            city: "",
            address: s.address || "",
            classLevel: s.selectclass || "",
            salary: s.expectedFee || "",
          });
        });
        setJobs([...
          instList,
          ...uniStudentList
        ]);
        setLoading(false);
      }, () => {
        uniStudentList = [];
        setJobs([...
          instList,
          ...uniStudentList
        ]);
        setLoading(false);
      });

      unsubs = [u1, u2];
    } else {
      const filters = [];
      if (typeFilter !== "all") {
        filters.push(where("institutionType", "==", typeFilter));
      } else {
        filters.push(where("institutionType", "in", ["school", "college", "university"]));
      }
      const q = query(collection(db, "institutionJobs"), ...filters);
      const u = onSnapshot(q, (snap) => {
        const list = [];
        snap.forEach((d) => {
          const j = d.data();
          list.push({
            id: d.id,
            title: j.title || "Teaching Job",
            institutionName: j.institutionName || "",
            city: j.city || "",
            address: j.address || "",
            classLevel: j.classLevel || j.grade || "",
            salary: j.salary || "",
          });
        });
        setJobs(list);
        setLoading(false);
      }, () => {
        setJobs([]);
        setLoading(false);
      });
      unsubs = [u];
    }

    return () => {
      unsubs.forEach((fn) => fn && fn());
    };
  }, [typeFilter]);

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

     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
       <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
         <TouchableOpacity onPress={() => setTypeFilter("all")} style={{ backgroundColor: typeFilter === "all" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginRight: 8 }}>
           <Text style={{ color: typeFilter === "all" ? "#fff" : "purple", fontWeight: "bold" }}>All</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => setTypeFilter("school")} style={{ backgroundColor: typeFilter === "school" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginRight: 8 }}>
           <Text style={{ color: typeFilter === "school" ? "#fff" : "purple", fontWeight: "bold" }}>School</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => setTypeFilter("college")} style={{ backgroundColor: typeFilter === "college" ? "purple" : "#eee", padding: 10, borderRadius: 20 }}>
           <Text style={{ color: typeFilter === "college" ? "#fff" : "purple", fontWeight: "bold" }}>College</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => setTypeFilter("university")} style={{ backgroundColor: typeFilter === "university" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginLeft: 8 }}>
           <Text style={{ color: typeFilter === "university" ? "#fff" : "purple", fontWeight: "bold" }}>University</Text>
         </TouchableOpacity>
       </View>
     </ScrollView>

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
              <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>{job.title || "Teaching Job"}</Text>
              <Text>{job.institutionName || job.city || job.address || "Institution"}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                <Text>{job.classLevel ? `Class: ${job.classLevel}` : (job.grade ? `Class: ${job.grade}` : "")}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
                <Text>{job.salary ? `${job.salary}` : ""}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
                  <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
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
