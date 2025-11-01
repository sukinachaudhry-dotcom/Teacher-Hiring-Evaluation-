import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function PrivateJobs({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all"); // all | students | courses

  useEffect(() => {
    // Stream students who created accounts to hire teachers
    const studentsQ = query(
      collection(db, "users"),
      where("role", "==", "Student"),
      where("profileCompleted", "==", true),
      where("modeofteaching", "in", ["inperson", "online", "hybrid"]) 
    );

    // Stream institution course-specific jobs (flag 'course' must be true)
    const courseJobsQ = query(
      collection(db, "institutionJobs"),
      where("course", "==", true)
    );

    // Stream all institution jobs (school/college/university)
    const instAllQ = query(
      collection(db, "institutionJobs"),
      where("institutionType", "in", ["school", "college", "university"]) 
    );

    let studentList = [];
    let courseList = [];
    let instAllList = [];

    const unsub1 = onSnapshot(studentsQ, (snap) => {
      studentList = [];
      snap.forEach((d) => {
        const s = d.data();
        studentList.push({
          id: `stu_${d.id}`,
          source: "student",
          title: s.subjects ? `${s.subjects} Tutor Needed` : "Home Tuition",
          subtitle: s.address || "",
          classLevel: s.selectclass || "",
          salary: s.expectedFee || "",
          mode: s.modeofteaching || "",
        });
      });
      setItems([...courseList, ...instAllList, ...studentList]);
      setLoading(false);
    }, () => {
      studentList = [];
      setItems([...courseList, ...instAllList]);
      setLoading(false);
    });

    const unsub2 = onSnapshot(courseJobsQ, (snap) => {
      courseList = [];
      snap.forEach((d) => {
        const j = d.data();
        courseList.push({
          id: `course_${d.id}`,
          source: "course",
          title: j.title || "Course Instructor Required",
          subtitle: j.institutionName || j.city || j.address || "",
          classLevel: j.classLevel || j.grade || "",
          salary: j.salary || "",
          mode: j.mode || j.modeofteaching || "",
        });
      });
      setItems([...courseList, ...instAllList, ...studentList]);
      setLoading(false);
    }, () => {
      courseList = [];
      setItems([...instAllList, ...studentList]);
      setLoading(false);
    });

    const unsub3 = onSnapshot(instAllQ, (snap) => {
      instAllList = [];
      snap.forEach((d) => {
        const j = d.data();
        instAllList.push({
          id: `inst_${d.id}`,
          source: "institution",
          title: j.title || "Teaching Job",
          subtitle: j.institutionName || j.city || j.address || "",
          classLevel: j.classLevel || j.grade || "",
          salary: j.salary || "",
          mode: j.mode || j.modeofteaching || "",
        });
      });
      setItems([...courseList, ...instAllList, ...studentList]);
      setLoading(false);
    }, () => {
      instAllList = [];
      setItems([...courseList, ...studentList]);
      setLoading(false);
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
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

      {/* Mirror InstBrowse: chips bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => setTypeFilter("all")} style={{ backgroundColor: typeFilter === "all" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginRight: 8 }}>
            <Text style={{ color: typeFilter === "all" ? "#fff" : "purple", fontWeight: "bold" }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTypeFilter("students")} style={{ backgroundColor: typeFilter === "students" ? "purple" : "#eee", padding: 10, borderRadius: 20, marginRight: 8 }}>
            <Text style={{ color: typeFilter === "students" ? "#fff" : "purple", fontWeight: "bold" }}>Students</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTypeFilter("courses")} style={{ backgroundColor: typeFilter === "courses" ? "purple" : "#eee", padding: 10, borderRadius: 20 }}>
            <Text style={{ color: typeFilter === "courses" ? "#fff" : "purple", fontWeight: "bold" }}>Courses</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Jobs List */}
      <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : (items.filter(it => typeFilter === 'all' ? true : (typeFilter === 'students' ? it.source === 'student' : it.source === 'course'))).length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No private jobs yet.</Text>
        ) : (
          items.filter(it => typeFilter === 'all' ? true : (typeFilter === 'students' ? it.source === 'student' : it.source === 'course')).map((it) => (
            <View key={it.id} style={{
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
              <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>{it.title}</Text>
              <Text>{it.subtitle}</Text>
              {!!it.classLevel && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text>{`Class: ${it.classLevel}`}</Text>
                </View>
              )}
              {!!it.salary && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text>{it.salary}</Text>
                </View>
              )}
              {!!it.mode && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
                  <Text>{`Mode: ${it.mode}`}</Text>
                </View>
              )}
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
