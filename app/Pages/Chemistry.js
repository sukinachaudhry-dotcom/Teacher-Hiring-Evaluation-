// ChemistryCoursesPage.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export default function ChemistryCoursesPage({ navigation }) {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the subject value for filtering (Chemistry = 'chemistry')
  const subjectValue = 'chemistry';

  // Fetch teachers from Firestore filtered by subject
  useEffect(() => {
    try {
      setLoading(true);
      // Query teachers where teachingsubjects matches the subject
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'Teacher'),
        where('teachingsubjects', '==', subjectValue)
      );
      
      const unsub = onSnapshot(q, (snap) => {
        const teacherArray = [];
        snap.forEach((doc) => {
          const data = doc.data();
          teacherArray.push({
            id: doc.id,
            name: data.name || 'Unnamed',
            teachingsubjects: data.teachingsubjects || '',
            experience: data.experience || '',
            location: data.location || '',
            photoUrl: data.photoUrl || data.profileImage || null,
            ...data
          });
        });
        setTeachers(teacherArray);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching chemistry teachers:', error);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.error('Error setting up chemistry teachers query:', e);
      setLoading(false);
    }
  }, []);

  // ✅ Search Filter
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    (teacher.teachingsubjects || '').toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Teacher Card Component
  const TeacherCard = ({ teacher }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Image
        source={teacher.photoUrl || teacher.profileImage ? { uri: teacher.photoUrl || teacher.profileImage } : require("./Ali.jpeg")}
        style={{ width: 60, height: 60, borderRadius: 30, alignSelf: "center" }}
      />
      <Text style={{ marginTop: 5, fontWeight: 'bold', textAlign: "center" }}>{teacher.name || 'Unnamed'}</Text>
      <Text style={{ marginTop: 2, fontWeight: 'bold', textAlign: "center" }}>{teacher.teachingsubjects || ''}</Text>
      <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.location || ''}</Text>
      <Text style={{ marginTop: 2, color: '#555', textAlign: "center" }}>{teacher.experience ? `${teacher.experience}` : ''}</Text>

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}
          onPress={() => navigation.navigate("Studentviewprofile", { teacherId: teacher.id })}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 🔥 Purple Header */}
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "purple",
        }}
      >
        <TextInput
          placeholder="Search Chemistry Teachers"
          placeholderTextColor="#ddd"
          value={search}
          onChangeText={setSearch}
          style={{
            flex: 1,
            backgroundColor: "#fff",
            marginHorizontal: 10,
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 40,
            fontSize: 14,
          }}
        />

        <Ionicons name="flask-outline" size={28} color="white" />
      </View>

      {/* ✅ Teachers Grid */}
      <ScrollView style={{ padding: 10 }}>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            Loading teachers...
          </Text>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher, index) => (
                <TeacherCard key={teacher.id || index} teacher={teacher} />
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20, color: "gray", width: '100%' }}>
                No chemistry teachers found
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


