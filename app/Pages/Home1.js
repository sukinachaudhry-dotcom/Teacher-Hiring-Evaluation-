import { Dimensions, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { useEffect } from 'react';
import React, { useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAllData } from '../Helper/firebaseHelper';
const { width } = Dimensions.get("window");



export default function App({ navigation }) {
   const defaultImages = [
  "https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg", 
  "https://images.pexels.com/photos/5212335/pexels-photo-5212335.jpeg", 
  "https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg", 
];
   const [carouselImages, setCarouselImages] = useState([]);

    const [data, setData] = useState([]);
    const [instJobs, setInstJobs] = useState([]);
    const [privateJobs, setPrivateJobs] = useState([]);
    const getDataFromDatabase = async () => {

        const cData = await getAllData("categories");  // Firestore se data fetch

        console.log("this is c data", cData);

        setData(cData)

    };
    const getCarouselFromDb = async () => {
        try {
            const items = await getAllData("homeCarousel");
            const active = (items || []).filter(i => i?.active !== false);
            const sorted = active.sort((a,b) => (a?.order||0) - (b?.order||0));
            const urls = sorted.map(i => i?.url).filter(Boolean);
            setCarouselImages(urls);
        } catch (e) {
            setCarouselImages([]);
        }
    };
    useEffect(() => {
        getDataFromDatabase();
        getCarouselFromDb();
        // Subscribe to Institution Jobs (school/college) real-time
        const q = query(
            collection(db, 'institutionJobs'),
            where('institutionType', 'in', ['school', 'college', 'undergraduate', 'postgraduate'])
        );
        const unsubInst = onSnapshot(q, (snap) => {
            const list = [];
            snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
            setInstJobs(list);
        }, () => setInstJobs([]));

        // Subscribe to Private Jobs (students + course-specific institution jobs)
        let studentList = [];
        let courseList = [];
        const studentsQ = query(
            collection(db, 'users'),
            where('role', '==', 'Student'),
            where('profileCompleted', '==', true),
            where('modeofteaching', 'in', ['inperson', 'online', 'hybrid'])
        );
        const courseJobsQ = query(
            collection(db, 'institutionJobs'),
            where('course', '==', true)
        );
        const unsubStudents = onSnapshot(studentsQ, (snap) => {
            studentList = [];
            snap.forEach((d) => {
                const s = d.data();
                studentList.push({
                    id: `stu_${d.id}`,
                    title: s.subjects ? `${s.subjects} Tutor Needed` : 'Home Tuition',
                    subtitle: s.address || '',
                    classLevel: s.selectclass || '',
                    salary: s.expectedFee || '',
                    mode: s.modeofteaching || '',
                });
            });
            setPrivateJobs([...
                courseList,
                ...studentList
            ]);
        }, () => setPrivateJobs([...courseList]));

        const unsubCourse = onSnapshot(courseJobsQ, (snap) => {
            courseList = [];
            snap.forEach((d) => {
                const j = d.data();
                courseList.push({
                    id: `course_${d.id}`,
                    title: j.title || 'Course Instructor Required',
                    subtitle: j.institutionName || j.city || j.address || '',
                    classLevel: j.classLevel || j.grade || '',
                    salary: j.salary || '',
                    mode: j.mode || j.modeofteaching || '',
                });
            });
            setPrivateJobs([...
                courseList,
                ...studentList
            ]);
        }, () => setPrivateJobs([...studentList]));

        return () => {
            unsubInst();
            unsubStudents();
            unsubCourse();
        };
    }, [])

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

                {/* Bell Icon */}
                <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")}>
                    <Ionicons name="notifications" size={28} color='#fff' />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => {
  // navigate to Settings defined in the parent StudentStack
  navigation.getParent()?.navigate('Settings');
}} >
                    <Ionicons name="settings" size={28} color='#fff' />

                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Carousel
                    loop
                    width={width}
                    height={150}
                    autoPlay={true}
                    data={carouselImages.length ? carouselImages : defaultImages}
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



            {/* Apply For Section */}
            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "bold", marginTop: 20 }}>
                Apply For
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                {/* All */}
                {data?.map((item, index) => (
                    <TouchableOpacity onPress={() => {
                        const title = (item?.title || "").toString();
                        const normalized = title.trim().toLowerCase();
                        if (normalized === "all") {
                            navigation.navigate("PrivBrowse");
                        } else if (normalized === "home tuition" || normalized.includes("home") && normalized.includes("tuition")) {
                            navigation.navigate("TuitionJobs");
                        } else {
                            navigation.navigate("InstBrowse");
                        }
                    }} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name={item.icon} size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.title}</Text>
                    </TouchableOpacity>

                ))}
                {/* School / College */}
                {/* <TouchableOpacity onPress={() => navigation.navigate("ClgJobs")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name={item.icon} size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.title}</Text>
                    </TouchableOpacity> */}

                {/* University */}
                {/* <TouchableOpacity onPress={() => navigation.navigate("UniJobs")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name="business-outline" size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.name2}</Text>
                    </TouchableOpacity> */}

                {/* Home Tuition */}
                {/* <TouchableOpacity onPress={() => navigation.navigate("TuitionJobs")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name="home-outline" size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.name3}</Text>
                    </TouchableOpacity> */}

                {/* Courses */}
                {/* <TouchableOpacity onPress={() => navigation.navigate("CoursesJobs")} style={{ marginHorizontal: 10, alignItems: "center" }}>
                        <View key={index} style={{ backgroundColor: "#d8b4e2", padding: 20, borderRadius: 10 }}>
                            <Ionicons name="book-outline" size={30} color="#000" />
                        </View>
                        <Text style={{ marginTop: 5 }}>{item.name4}</Text>

                    </TouchableOpacity> */}


            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Institution Jobs</Text>
                <TouchableOpacity onPress={() => navigation.navigate("InstBrowse")} >
                    <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Vertical Job List */}
            <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                {instJobs.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>No institution jobs yet.</Text>
                ) : (
                    instJobs.slice(0, 5).map((job) => (
                        <View key={job.id} style={{
                            backgroundColor: "#d8b4e2",
                            borderRadius: 10,
                            padding: 15,
                            marginBottom: 15,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            borderWidth: 2,
                            borderColor: "purple"
                        }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>{job.title || 'Teaching Job'}</Text>
                            <Text>{job.institutionName || job.city || job.address || 'Institution'}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                                <Text>{job.classLevel ? `Class: ${job.classLevel}` : (job.grade ? `Class: ${job.grade}` : '')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
                                <Text>{job.salary ? `${job.salary}` : ''}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")} style={{ backgroundColor: 'purple', padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={{ backgroundColor: 'purple', padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Private Jobs</Text>
                <TouchableOpacity onPress={() => navigation.navigate("PrivBrowse")} >
                    <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                {privateJobs.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>No private jobs yet.</Text>
                ) : (
                    privateJobs.slice(0, 5).map((it) => (
                        <View key={it.id} style={{
                            backgroundColor: "#d8b4e2",
                            borderRadius: 10,
                            padding: 15,
                            marginBottom: 15,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            borderWidth: 2,
                            borderColor: "purple"
                        }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5 }}>{it.title}</Text>
                            <Text>{it.subtitle}</Text>
                            {!!it.classLevel && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
                                    <Text>{`Class: ${it.classLevel}`}</Text>
                                </View>
                            )}
                            {!!it.salary && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
                                    <Text>{it.salary}</Text>
                                </View>
                            )}
                            {!!it.mode && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <MaterialCommunityIcons name="briefcase-outline" size={18} color="black" style={{ marginRight: 6 }} />
                                    <Text>{`Mode: ${it.mode}`}</Text>
                                </View>
                            )}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <TouchableOpacity onPress={() => navigation.navigate("Jobdetails")} style={{ backgroundColor: 'purple', padding: 8, borderRadius: 20, flex: 1, marginRight: 5 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={{ backgroundColor: 'purple', padding: 8, borderRadius: 20, flex: 1, marginLeft: 5 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>Chat</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>

        </ScrollView>
    );
}