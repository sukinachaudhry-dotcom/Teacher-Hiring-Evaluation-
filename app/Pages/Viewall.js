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
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("Studentviewprofile", { teacherId: teacher.id })}
      style={{
        width: "48%",
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#e0e0e0",
      }}
    >
      {/* Profile Picture */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        {teacher.photoUrl || teacher.profileImage ? (
      <Image
            source={{ uri: teacher.photoUrl || teacher.profileImage }}
            style={{ width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: "purple" }}
          />
        ) : (
          <View style={{ 
            width: 70, 
            height: 70, 
            borderRadius: 35, 
            backgroundColor: "#f5f5f5",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "purple"
          }}>
            <Ionicons name="person" size={35} color="purple" />
          </View>
        )}
      </View>

      {/* Teacher Name */}
      <Text style={{ 
        marginTop: 5, 
        fontWeight: 'bold', 
        fontSize: 16,
        textAlign: "center",
        color: "#1a1a1a",
        marginBottom: 4
      }}>
        {teacher.name || 'Unnamed'}
      </Text>

      {/* Subject */}
      {teacher.teachingsubjects && (
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          justifyContent: "center",
          marginBottom: 6,
          backgroundColor: "#f8f8f8",
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 8,
          alignSelf: "center"
        }}>
          <Ionicons name="book-outline" size={14} color="purple" style={{ marginRight: 4 }} />
          <Text style={{ 
            fontSize: 12, 
            color: "#444",
            fontWeight: "500"
          }}>
            {teacher.teachingsubjects}
          </Text>
        </View>
      )}

      {/* Location */}
      {teacher.location && (
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          justifyContent: "center",
          marginBottom: 4
        }}>
          <Ionicons name="location-outline" size={12} color="#666" style={{ marginRight: 4 }} />
          <Text style={{ fontSize: 11, color: '#666', textAlign: "center" }}>
            {teacher.location}
          </Text>
        </View>
      )}

      {/* Experience */}
      {teacher.experience && (
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          justifyContent: "center",
          marginBottom: 10
        }}>
          <Ionicons name="briefcase-outline" size={12} color="#666" style={{ marginRight: 4 }} />
          <Text style={{ fontSize: 11, color: '#666', textAlign: "center" }}>
            {teacher.experience}
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, gap: 6 }}>
        <TouchableOpacity
          style={{ 
            backgroundColor: "purple", 
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 10, 
            flex: 1,
            marginRight: 3
          }}
          onPress={(e) => {
            e.stopPropagation();
            navigation.navigate("Studentviewprofile", { teacherId: teacher.id });
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 12, fontWeight: "600" }}>
            Detail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ 
            backgroundColor: "#fff", 
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 10, 
            flex: 1,
            marginLeft: 3,
            borderWidth: 1.5,
            borderColor: "purple"
          }}
          onPress={async (e) => {
            e.stopPropagation();
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
                    photoUrl: otherUser?.profilePicUrl || otherUser?.profileImage || null,
                  }
                });
              }
            } catch (error) {
              console.error('Error starting chat:', error);
            }
          }}
        >
          <Text style={{ color: "purple", textAlign: "center", fontSize: 12, fontWeight: "600" }}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
