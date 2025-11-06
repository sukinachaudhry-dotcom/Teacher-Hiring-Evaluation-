import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function Viewall({ navigation, route }) {
  const mode = route?.params?.mode === 'recent' ? 'recent' : 'popular';
  const [teachers, setTeachers] = React.useState([]);

  React.useEffect(() => {
    let userUnsubs = [];
    try {
      const instUid = auth?.currentUser?.uid;
      if (!instUid) return;

      // Get applications for this institution
      const appsQ = query(
        collection(db, 'applications'),
        where('institutionUid', '==', instUid),
        orderBy('createdAt', 'desc')
      );

      const unsubApps = onSnapshot(appsQ, (snap) => {
        const applicantTeacherUids = [];
        snap.forEach((d) => {
          const a = d.data();
          if (a && a.teacherUid && !applicantTeacherUids.includes(a.teacherUid)) {
            applicantTeacherUids.push(a.teacherUid);
          }
        });

        // cleanup previous
        userUnsubs.forEach((u) => u && u());
        userUnsubs = [];

        // Subscribe to those teachers' user docs
        const teacherMap = {};
        applicantTeacherUids.forEach((uid) => {
          const uUnsub = onSnapshot(doc(db, 'users', uid), (uSnap) => {
            if (uSnap.exists()) {
              const data = uSnap.data();
              // derive numeric years from various formats like "+5 Years Exp", 3, "3", etc.
              const expStr = (data?.experience ?? '').toString();
              const years = Number(expStr.match(/\d+/)?.[0] || 0);
              teacherMap[uid] = {
                id: uid,
                name: data?.name || data?.fullname || 'Unnamed',
                teachingsubjects: data?.teachingsubjects || data?.subjects || '',
                location: data?.location || data?.address || '',
                experience: expStr,
                experienceYears: years,
                photoUrl: data?.profileImage || data?.photoUrl || null,
              };
            } else {
              delete teacherMap[uid];
            }

            // Sort by experience based on mode
            const arr = Object.values(teacherMap);
            arr.sort((a, b) => {
              if (mode === 'popular') return b.experienceYears - a.experienceYears;
              return a.experienceYears - b.experienceYears;
            });
            setTeachers(arr);
          });
          userUnsubs.push(uUnsub);
        });

        if (applicantTeacherUids.length === 0) setTeachers([]);
      }, () => setTeachers([]));

      return () => {
        unsubApps && unsubApps();
        userUnsubs.forEach((u) => u && u());
      };
    } catch (e) {
      console.log('viewall subscribe error', e);
    }
  }, [route?.params?.mode]);

  const TeacherCard = ({ teacher }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: "#d8b4e2",
        padding: 10,
        borderRadius: 12,
        marginBottom: 15,
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
        {teacher.name}
      </Text>
      <Text style={{ marginTop: 2, fontWeight: "bold", textAlign: "center" }}>
        {teacher.teachingsubjects || ''}
      </Text>
      <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
        {teacher.location || ''}
      </Text>
      <Text style={{ marginTop: 2, color: "#555", textAlign: "center" }}>
        {teacher.experience || ''}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "purple",
            padding: 8,
            marginHorizontal: 3,
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("Instituteviewprofile")}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "purple",
            padding: 8,
            marginHorizontal: 3,
            borderRadius: 20,
          }}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
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
          placeholder="Search Jobs"
          placeholderTextColor="#999"
          style={{
            // flex: 1,
            backgroundColor: '#fff',
            marginHorizontal: 10,
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 40,
            
          }}
        />
      </View>

      {/* 📌 Menu Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("PopularTeachers")}
            style={{
              backgroundColor: "purple",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 50,
              marginLeft: 8,
            }}
          >
            <Text onPress={()=> navigation.navigate("Popularteachers")} style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
              Popular Teachers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("RecentTeachers")}
            style={{
              backgroundColor: "purple",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 50,
              marginLeft: 8,
            }}
          >
            <Text onPress={()=> navigation.navigate("Recentteacher")} style={{ fontSize: 14, fontWeight: "bold", color: "white" }}>
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
          All Teachers
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {teachers.map((t, i) => (
            <TeacherCard key={i} teacher={t} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
