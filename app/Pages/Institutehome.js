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
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { getAuth } from "firebase/auth";
import { getOrCreateConversation, getDataById } from "../Helper/firebaseHelper";

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

  // Fetch categories from Firestore collection "categories institute"
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    try {
      // Query the "categories institute" collection
      const q = query(collection(db, 'categories institute'));
      const unsub = onSnapshot(q, (snap) => {
        const catArray = [];
        snap.forEach((doc) => {
          const data = doc.data();
          // Get document ID as cid and add it to the data
          catArray.push({
            cid: doc.id, // Document ID
            icon: data.icon || 'book-outline', // Icon name from Firestore
            title: data.title || 'Category', // Title from Firestore
          });
        });
        setCategories(catArray);
      });
      return () => unsub();
    } catch (e) {
      console.log('categories subscribe error', e);
    }
  }, []);

  // Applicants -> Teachers (real-time)
  const [teachers, setTeachers] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    try {
      // Show ALL teachers (real-time)
      const teachersQ = query(
        collection(db, 'users'),
        where('role', '==', 'Teacher')
      );

      const unsubTeachers = onSnapshot(
        teachersQ,
        (snap) => {
          const arr = [];
          snap.forEach((d) => {
            arr.push({ id: d.id, ...d.data() });
          });
          setTeachers(arr);
        },
        () => setTeachers([])
      );

      return () => unsubTeachers && unsubTeachers();
    } catch (e) {
      console.log('applicants subscribe error', e);
    }
  }, []);

  // Filter teachers based on search text
  const filteredTeachers = React.useMemo(() => {
    if (!searchText.trim()) {
      return teachers;
    }
    
    const searchLower = searchText.toLowerCase().trim();
    return teachers.filter(teacher => {
      const name = (teacher.name || '').toLowerCase();
      const subject = (teacher.teachingsubjects || teacher.subjects || '').toLowerCase();
      return name.includes(searchLower) || subject.includes(searchLower);
    });
  }, [teachers, searchText]);

  // Teacher Card Component
  const TeacherCard = ({ teacher }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#e0e0e0",
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
          onPress={() => navigation.navigate("Viewprofile", { institutionId: teacher.id })}
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
          onPress={async () => {
            try {
              const authInstance = getAuth();
              const currentUser = authInstance.currentUser;

              if (!currentUser?.uid) {
                Alert.alert("Error", "Please login first to start chat.");
                return;
              }

              if (!teacher?.id) {
                Alert.alert("Error", "Teacher ID not found.");
                return;
              }

              const conversationId = await getOrCreateConversation(currentUser.uid, teacher.id);
              const otherUser = await getDataById("users", teacher.id);

              if (!conversationId) {
                Alert.alert("Error", "Unable to start chat. Please try again.");
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
              console.error("Error starting chat:", error);
              Alert.alert("Error", "Chat open nahi ho rahi. Please try again.");
            }
          }}
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
            placeholder="Search Teachers by Name or Subject"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            style={{
              flex: 1,
              backgroundColor: '#fff',
              marginHorizontal: 10,
              borderRadius: 20,
              paddingHorizontal: 15,
              height: 40,
            }}
          />

          


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

        {/* Categories - Fetched from Firestore */}
        <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>
          Learning System
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.length === 0 ? (
            <View style={styles.categoriesEmpty}>
              <Text style={styles.categoriesEmptyText}>Loading categories...</Text>
            </View>
          ) : (
            categories.map((category) => (
              <TouchableOpacity
                key={category.cid}
                style={styles.categoryTouchable}
                activeOpacity={0.7}
                onPress={() => {
                  const categoryTitle = (category.title || '').trim();
                  const pageMap = {
                    'computer': 'Computer',
                    'physics': 'Physics',
                    'math': 'Maths',
                    'maths': 'Maths',
                    'chemistry': 'Chemistry',
                    'courses': 'CoursesJobs',
                  };
                  const routeName = pageMap[categoryTitle.toLowerCase()];
                  if (routeName) {
                    navigation.navigate(routeName);
                  } else {
                    navigation.navigate('Viewall', { category: categoryTitle });
                  }
                }}
              >
                <View style={styles.categoryItem}>
                  <View style={styles.categoryBox}>
                    <Ionicons name={category.icon || 'book-outline'} size={30} color="#000" />
                  </View>
                  <Text style={styles.categoryTitle}>{category.title || 'Category'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
        {filteredTeachers.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 10, width: '100%', color: '#666' }}>
            {searchText.trim() ? 'No teachers found matching your search.' : 'No popular teachers yet.'}
          </Text>
        ) : (
          filteredTeachers.map((teacher, index) => (
            <TeacherCard key={teacher.id || index} teacher={teacher} />
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

const styles = StyleSheet.create({
  categoriesScroll: { marginVertical: 10 },
  categoriesEmpty: { padding: 20 },
  categoriesEmptyText: { color: '#999' },
  categoryTouchable: {},
  categoryItem: { marginHorizontal: 10, alignItems: 'center' },
  categoryBox: {
    backgroundColor: '#d8b4e2',
    padding: 20,
    borderRadius: 10,
  },
  categoryTitle: {
    marginTop: 5,
  },
});
