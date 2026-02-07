import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getOrCreateConversation, getDataById } from '../Helper/firebaseHelper';

// Course subjects (same as Createprofile: React, Python, Node, etc.)
// Teachers who selected these show in Courses category. Firestore 'in' max 10.
const COURSE_SUBJECTS = ['react', 'python', 'node', 'java', 'webdev', 'mobiledev', 'ml', 'ai'];

export default function CoursesJobs({ navigation }) {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = useSelector((state) => state.home.role);

  // Fetch teachers from Firestore – course subjects only (real-time, like Computer)
  useEffect(() => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'Teacher'),
        where('teachingsubjects', 'in', COURSE_SUBJECTS)
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
        console.error('Error fetching course teachers:', error);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.error('Error setting up course teachers query:', e);
      setLoading(false);
    }
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(search.toLowerCase()) ||
    (teacher.teachingsubjects || '').toLowerCase().includes(search.toLowerCase())
  );

  // Teacher Card – same styling as Computer.js
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

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}
          onPress={() => {
            if (role === "Institution") {
              navigation.navigate("Viewprofile", { institutionId: teacher.id });
            } else {
              navigation.navigate("Studentviewprofile", { teacherId: teacher.id });
            }
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: "purple", padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}
          onPress={async () => {
            try {
              const auth = getAuth();
              const currentUser = auth.currentUser;
              if (!currentUser?.uid) {
                Alert.alert("Error", "Please login first to start chat.");
                return;
              }
              if (!teacher?.id) {
                Alert.alert("Error", "Teacher not found.");
                return;
              }
              const conversationId = await getOrCreateConversation(currentUser.uid, teacher.id);
              const otherUser = await getDataById("users", teacher.id);
              if (!conversationId) {
                Alert.alert("Error", "Unable to start chat. Try again.");
                return;
              }
              navigation.navigate("ChatScreen", {
                conversationId,
                otherUser: {
                  id: teacher.id,
                  name: otherUser?.name || otherUser?.fullname || "User",
                  photoUrl: otherUser?.profilePicUrl || otherUser?.profileImage || otherUser?.photoUrl || null,
                },
              });
            } catch (error) {
              console.error("Chat error:", error);
              Alert.alert("Error", "Chat open nahi ho rahi. Please try again.");
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
          placeholder="Search Course Teachers"
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

        <Ionicons name="school-outline" size={28} color="white" />
      </View>

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
                No course teachers found
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
