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
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { getOrCreateConversation, getDataById } from '../Helper/firebaseHelper';

export default function Viewall({ navigation, route }) {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch all teachers from Firestore
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
          
          // Sort by experience (highest first), then by account age (oldest first)
        teacherArray.sort((a, b) => {
            // First sort by experience
            const expDiff = (b.experienceYears || 0) - (a.experienceYears || 0);
            if (expDiff !== 0) return expDiff;
            
            // If experience is same, sort by account age (oldest first)
            const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return aTime - bTime; // Ascending (oldest first)
          });
        
        setTeachers(teacherArray);
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
  }, []);

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
      {teacher.photoUrl ? (
        <Image
          source={{ uri: teacher.photoUrl }}
          style={{ width: 60, height: 60, borderRadius: 30, alignSelf: "center" }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ width: 60, height: 60, borderRadius: 30, alignSelf: "center", backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="person" size={30} color="#999" />
        </View>
      )}
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
          onPress={async () => {
            try {
              const auth = getAuth();
              const currentUser = auth.currentUser;
              
              if (currentUser && teacher.id) {
                const conversationId = await getOrCreateConversation(currentUser.uid, teacher.id);
                const otherUser = await getDataById('users', teacher.id);
                navigation.navigate('ChatScreen', {
                  conversationId,
                  otherUser: {
                    id: teacher.id,
                    name: otherUser?.name || otherUser?.fullname || 'User',
                    photoUrl: otherUser?.profilePicUrl || otherUser?.profileImage || otherUser?.photoUrl || null,
                  }
                });
              }
            } catch (error) {
              console.error('Error starting chat:', error);
            }
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
        {/* Search Bar */}
        <View
          style={{
            backgroundColor: "purple",
            paddingVertical: 15,
            paddingHorizontal: 15,
          }}
        >
          <TextInput
            placeholder="Search Teachers by name, subject, or location"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            style={{
              backgroundColor: '#fff',
              borderRadius: 25,
              paddingHorizontal: 20,
              paddingVertical: 12,
              fontSize: 14,
            }}
          />
        </View>

        {/* Teacher Cards */}
        <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
          <View style={{ 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: 15
          }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1a1a1a",
              }}
            >
              All Teachers
              </Text>
            <View style={{ 
              backgroundColor: "purple", 
              paddingHorizontal: 12, 
              paddingVertical: 6, 
              borderRadius: 15 
            }}>
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                {filteredTeachers.length}
              </Text>
            </View>
          </View>
          
          {loading ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ textAlign: "center", color: "#666", fontSize: 16 }}>
              Loading teachers...
            </Text>
            </View>
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
                <View style={{ width: '100%', alignItems: "center", marginTop: 40 }}>
                  <Ionicons name="search-outline" size={50} color="#ccc" />
                  <Text style={{ textAlign: "center", marginTop: 15, color: "#666", fontSize: 16 }}>
                  No teachers found
                </Text>
                  <Text style={{ textAlign: "center", marginTop: 5, color: "#999", fontSize: 14 }}>
                    Try a different search term
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
