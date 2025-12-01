import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Viewall({ navigation, route }) {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get mode from route params (popular or recent)
  const mode = route?.params?.mode || 'popular';
  
  // Fetch teachers from Firestore
  useEffect(() => {
    try {
      setLoading(true);
      // Query all teachers
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'Teacher')
      );
      
      const unsub = onSnapshot(q, (snap) => {
        const teacherArray = [];
        snap.forEach((doc) => {
          const data = doc.data();
          // Extract experience years for sorting
          const expStr = (data?.experience ?? '').toString();
          const years = Number(expStr.match(/\d+/)?.[0] || 0);
          
          teacherArray.push({
            id: doc.id,
            name: data.name || 'Unnamed',
            teachingsubjects: data.teachingsubjects || '',
            experience: data.experience || '',
            location: data.location || '',
            photoUrl: data.photoUrl || data.profileImage || null,
            createdAt: data.createdAt || '',
            experienceYears: years,
            ...data
          });
        });
        
        // Filter and sort based on mode
        let filteredArray = teacherArray;
        
        if (mode === 'popular') {
          // Filter: Show only teachers with more experience (2+ years) AND old accounts (15+ days old)
          const now = new Date();
          const fifteenDaysAgo = new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000)); // 15 days ago
          
          filteredArray = teacherArray.filter((teacher) => {
            // Check experience: 2 years or more (includes exactly 2 years)
            const hasEnoughExperience = (teacher.experienceYears || 0) >= 2;
            
            // Check account age: created at least 15 days ago
            const accountCreatedAt = teacher.createdAt ? new Date(teacher.createdAt) : null;
            const isOldAccount = accountCreatedAt && accountCreatedAt.getTime() < fifteenDaysAgo.getTime();
            
            // Show only if both conditions are met
            return hasEnoughExperience && isOldAccount;
          });
          
          // Sort by experience (highest first), then by account age (oldest first)
          filteredArray.sort((a, b) => {
            // First sort by experience
            const expDiff = (b.experienceYears || 0) - (a.experienceYears || 0);
            if (expDiff !== 0) return expDiff;
            
            // If experience is same, sort by account age (oldest first)
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return aTime - bTime; // Ascending (oldest first)
          });
        } else if (mode === 'recent') {
          // Filter: Show only teachers who recently created accounts (within last 30 days)
          const now = new Date();
          const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
          
          filteredArray = teacherArray.filter((teacher) => {
            // Check if account was created recently (within last 30 days)
            const accountCreatedAt = teacher.createdAt ? new Date(teacher.createdAt) : null;
            return accountCreatedAt && accountCreatedAt.getTime() >= thirtyDaysAgo.getTime();
          });
          
          // Sort by createdAt (most recent first)
          filteredArray.sort((a, b) => {
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bTime - aTime; // Descending order (most recent first)
          });
        }
        
        setTeachers(filteredArray);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching teachers:', error);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.error('Error setting up teachers query:', e);
      setLoading(false);
    }
  }, [mode]);

  // Search filter
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    (teacher.teachingsubjects || '').toLowerCase().includes(search.toLowerCase()) ||
    (teacher.location || '').toLowerCase().includes(search.toLowerCase())
  );

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
      <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
        {/* 🔍 Search Bar */}
        <View
          style={{
            backgroundColor: "purple",
            paddingVertical: 20,
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            placeholder="Search Teachers"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            style={{
              backgroundColor: '#fff',
              marginHorizontal: 10,
              borderRadius: 20,
              paddingHorizontal: 15,
              height: 40,
            }}
          />
        </View>

        {/* 📌 Mode Toggle Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 10 }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Viewall", { mode: 'popular' })}
              style={{
                backgroundColor: mode === 'popular' ? "purple" : "#d8b4e2",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 50,
                marginLeft: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "bold", color: mode === 'popular' ? "white" : "#333" }}>
                Popular Teachers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Viewall", { mode: 'recent' })}
              style={{
                backgroundColor: mode === 'recent' ? "purple" : "#d8b4e2",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 50,
                marginLeft: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "bold", color: mode === 'recent' ? "white" : "#333" }}>
                Recent Teachers
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 👨‍🏫 Teacher Cards */}
        <View style={{ paddingHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "purple",
              marginVertical: 10,
            }}
          >
            {mode === 'popular' ? 'All Popular Teachers' : 'All Recent Teachers'}
          </Text>
          
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
                  No teachers found
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
