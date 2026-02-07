import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function PrivateJobs({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Stream institution course-specific jobs (flag 'course' must be true)
    const courseJobsQ = query(
      collection(db, "institutionJobs"),
      where("course", "==", true)
    );

    const unsub = onSnapshot(courseJobsQ, (snap) => {
      const courseList = [];
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
      setItems(courseList);
      setLoading(false);
    }, () => {
      setItems([]);
      setLoading(false);
    });

    return () => unsub();
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
        ) : items.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No private jobs yet.</Text>
        ) : (
          items.map((it) => (
            <View key={it.id} style={{
              backgroundColor: "#d8b4e2",
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              elevation: 3,
             
              
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
