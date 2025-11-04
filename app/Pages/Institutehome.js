import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { collection, onSnapshot, query, where, orderBy, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const { width } = Dimensions.get("window");

export default function Institutehome({ navigation }) {

  const [images, setImages] = React.useState([
    "https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg",
    "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
  ]);

  React.useEffect(() => {
    try {
      const q = query(
        collection(db, 'sliders'),
        where('role', '==', 'institution'),
        where('active', '==', true),
        orderBy('order', 'asc')
      );
      const unsub = onSnapshot(q, (snap) => {
        const arr = [];
        snap.forEach((doc) => {
          const d = doc.data();
          if (d && d.url) arr.push(d.url);
        });
        if (arr.length) setImages(arr);
      });
      return () => unsub();
    } catch (e) {
      console.log('slider subscribe error', e);
    }
  }, []);

  // Applicants -> Teachers (real-time)
  const [teachers, setTeachers] = React.useState([]);

  React.useEffect(() => {
    let userUnsubs = [];
    try {
      const instUid = auth?.currentUser?.uid;
      if (!instUid) return;

      const appsQ = query(
        collection(db, 'applications'),
        where('institutionUid', '==', instUid),
        orderBy('createdAt', 'desc')
      );
      const unsubApps = onSnapshot(appsQ, (snap) => {
        // Unique teacher UIDs from applications
        const uids = [];
        snap.forEach((d) => {
          const a = d.data();
          if (a && a.teacherUid && !uids.includes(a.teacherUid)) uids.push(a.teacherUid);
        });

        // Clean previous listeners
        userUnsubs.forEach((u) => u && u());
        userUnsubs = [];

        // Subscribe to first few teachers' profiles for real-time updates
        const shown = uids.slice(0, 12);
        const collected = {};

        shown.forEach((uid) => {
          const uUnsub = onSnapshot(doc(db, 'users', uid), (uSnap) => {
            if (uSnap.exists()) {
              collected[uid] = { id: uid, ...uSnap.data() };
            } else {
              delete collected[uid];
            }
            // Update array in a stable order based on apps order
            const arr = shown.map((id) => collected[id]).filter(Boolean);
            setTeachers(arr);
          });
          userUnsubs.push(uUnsub);
        });
        if (shown.length === 0) setTeachers([]);
      }, () => setTeachers([]));

      return () => {
        unsubApps && unsubApps();
        userUnsubs.forEach((u) => u && u());
      };
    } catch (e) {
      console.log('applicants subscribe error', e);
    }
  }, []);

  // Subjects
  const subjects = [
    { name: "Courses", page: "Courses" },
    { name: "Physics", page: "Physics" },
    { name: "Computer", page: "Computer" },
    { name: "Math", page: "Math" },
  ];

  // Teacher Card Component
  const TeacherCard = ({ teacher }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: "#d8b4e2",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: "purple",
      }}
    >
      <Image
        source={teacher.photoUrl ? { uri: teacher.photoUrl } : require("./Ali.jpeg")}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          alignSelf: "center",
        }}
      />
      <Text style={{ marginTop: 5, fontWeight: "bold", textAlign: "center" }}>
        {teacher.name || 'Unnamed'}
      </Text>
      <Text style={{ marginTop: 2, fontWeight: "bold", textAlign: "center" }}>
        {teacher.teachingsubjects || ''}
      </Text>
      <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
        {teacher.location || ''}
      </Text>
      <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
        {teacher.experience ? `${teacher.experience}` : ''}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            padding: 8,
            borderRadius: 20,
            flex: 1,
            marginRight: 5,
          }}
          onPress={() => navigation.navigate("Viewprofile")}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>
            Detail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "purple",
            padding: 8,
            borderRadius: 20,
            flex: 1,
            marginLeft: 5,
          }}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 14 }}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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

          {/* Bell Icon */}
          <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
            <Ionicons name="notifications" size={28} color='#fff' />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => navigation.navigate("Settings")} >
            <Ionicons name="settings" size={28} color='#fff' />

          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Carousel
            loop
            width={width}
            height={150}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: 340, height: "100%", borderRadius: 22, alignSelf: "center", marginTop: 5 }}
                resizeMode="cover"
              />
            )}
          />
        </View>

        {/* Subjects */}
        <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>
          Learning System
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {/* Computer */}
          <TouchableOpacity onPress={() => navigation.navigate("Computer")}>
            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#d8b4e2', padding: 20, borderRadius: 10 }}>
                <Ionicons name="laptop-outline" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Computer</Text>
            </View>
          </TouchableOpacity>

          {/* Physics */}
          <TouchableOpacity onPress={() => navigation.navigate("Physics")}>
            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#d8b4e2', padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="atom" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Physics</Text>
            </View>
          </TouchableOpacity>
          {/* Chemistry */}
          <TouchableOpacity onPress={() => navigation.navigate("CoursesJobs")}>
            <View style={{ marginHorizontal: 10, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#d8b4e2', padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="book-open-page-variant" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Course</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Maths")}>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="calculator" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Math</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="dna" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Biology</Text>
            </View>
          </TouchableOpacity>

          {/* Islamiyat */}
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="mosque" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Islamiyat</Text>
            </View>
          </TouchableOpacity>

          {/* History */}
          <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="history" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>History</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Popular Teachers */}
        
       
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginTop: 20,
          }}
        >    
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Popular Teachers</Text>
         <TouchableOpacity onPress={() => navigation.navigate("Viewall")} >   
          <Text style={{ color: "purple", fontWeight: "bold" }}>
            View All
          </Text>
          </TouchableOpacity>
        </View>
      
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", margin: 10 }}>
        {teachers.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 10, width: '100%' }}>No popular teachers yet.</Text>
        ) : (
          teachers.slice(0, 6).map((teacher, index) => (
            <TeacherCard key={teacher.id || index} teacher={teacher} />
          ))
        )}
      </View>

      {/* Recent Teachers */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Recent Teachers</Text>
        <Text onPress={() => navigation.navigate("Viewall")} style={{ color: "purple", fontWeight: "bold" }}>
          View All
        </Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", margin: 10 }}>
        {teachers.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 10, width: '100%' }}>No recent teachers yet.</Text>
        ) : (
          teachers.slice(0, 6).map((teacher, index) => (
            <TeacherCard key={(teacher.id ? `r_${teacher.id}` : `r_${index}`)} teacher={teacher} />
          ))
        )}
      </View>
    </ScrollView>

      {/* Floating Post Job Button */ }
  <TouchableOpacity
    style={{
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: "purple",
      flexDirection: "row",
      paddingHorizontal: 15,
      height: 55,
      borderRadius: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    }}
    onPress={() => navigation.navigate("Postjob")}
  >
    <Ionicons name="add" size={26} color="#fff" />
    <Text style={{ color: "#fff", fontWeight: "bold", marginLeft: 8 }}>Post Job</Text>
  </TouchableOpacity>

    </SafeAreaView >
  );
}
