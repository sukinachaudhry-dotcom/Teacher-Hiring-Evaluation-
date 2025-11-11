import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView ,Dimensions,} from 'react-native';
import { Ionicons , MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';


const { width } = Dimensions.get("window");

export default function App({ navigation }) {
    const [images, setImages] = React.useState([
        "https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg",
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
      ]);
    const [teachers, setTeachers] = React.useState([]);
    const [recentTeachers, setRecentTeachers] = React.useState([]);

    React.useEffect(() => {
        try {
            const q = query(collection(db, 'sliders'), where('role', '==', 'student'), orderBy('order', 'asc'));
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

    // Fetch Popular Teachers - sorted by experience (or createdAt as fallback)
    React.useEffect(() => {
        try {
            const q = query(
                collection(db, 'users'),
                where('role', '==', 'Teacher'),
                orderBy('createdAt', 'desc')
            );
            const unsub = onSnapshot(q, (snap) => {
                const arr = [];
                snap.forEach((doc) => {
                    const d = doc.data();
                    // Extract experience years for sorting
                    const expStr = (d?.experience ?? '').toString();
                    const years = Number(expStr.match(/\d+/)?.[0] || 0);
                    arr.push({ 
                        id: doc.id, 
                        ...d,
                        experienceYears: years
                    });
                });
                // Sort by experience (popular teachers have more experience)
                arr.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
                setTeachers(arr);
            });
            return () => unsub();
        } catch (e) {
            console.log('popular teachers subscribe error', e);
        }
    }, []);

    // Fetch Recent Teachers - sorted by createdAt (most recent first)
    React.useEffect(() => {
        try {
            const q = query(
                collection(db, 'users'),
                where('role', '==', 'Teacher'),
                orderBy('createdAt', 'desc')
            );
            const unsub = onSnapshot(q, (snap) => {
                const arr = [];
                snap.forEach((doc) => {
                    const d = doc.data();
                    arr.push({ 
                        id: doc.id, 
                        ...d
                    });
                });
                // Already sorted by createdAt desc from query
                setRecentTeachers(arr);
            });
            return () => unsub();
        } catch (e) {
            console.log('recent teachers subscribe error', e);
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={{ flex: 1 }}>

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
                

                    <TextInput
                        placeholder="Search Teachers"
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

                    <TouchableOpacity>
                        <Ionicons name="notifications" size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("Settings")} >
                    <Ionicons name="settings" size={28} color='#fff' />

                </TouchableOpacity>
                </View>

                {/* <View style={{ height: 20 }} /> */}
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

                {/* Learning System Section */}
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
          {/* <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="dna" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Biology</Text>
            </View>
          </TouchableOpacity> */}

          {/* Islamiyat */}
          {/* <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="mosque" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>Islamiyat</Text>
            </View>
          </TouchableOpacity> */}

          {/* History */}
          {/* <TouchableOpacity>
            <View style={{ marginHorizontal: 10, alignItems: "center" }}>
              <View style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                <MaterialCommunityIcons name="history" size={30} color="#000" />
              </View>
              <Text style={{ marginTop: 5 }}>History</Text>
            </View>
          </TouchableOpacity> */}
        </ScrollView>

                {/* Popular Teachers Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Popular Teachers</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Viewall", { mode: 'popular' })}>
                        <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Popular Teacher Cards Grid (2 per row) */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", margin: 10 }}>
                    {teachers.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 10, width: '100%' }}>No popular teachers yet.</Text>
                    ) : (
                    teachers.slice(0, 6).map((teacher, index) => (
                        <View
                            key={teacher.id || index}
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
                    ))
                    )}
                </View>

                {/* Recent Teachers Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Recent Teachers</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Viewall", { mode: 'recent' })}>
                        <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Teacher Cards Grid (2 per row) */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", margin: 10 }}>
                    {recentTeachers.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 10, width: '100%' }}>No recent teachers yet.</Text>
                    ) : (
                    recentTeachers.slice(0, 6).map((teacher, index) => (
                        <View
                            key={`recent_${teacher.id || index}`}
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
                    ))
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
