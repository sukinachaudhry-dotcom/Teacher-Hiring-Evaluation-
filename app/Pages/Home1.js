import { Dimensions, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { useEffect } from 'react';
import React, { useState } from 'react';
import { getAllData, getOrCreateConversation, getDataById } from '../Helper/firebaseHelper';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';

const { width } = Dimensions.get("window");

export default function App({ navigation }) {
    const images = [
        "https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg",
        "https://images.pexels.com/photos/5212335/pexels-photo-5212335.jpeg",
        "https://images.pexels.com/photos/3059748/pexels-photo-3059748.jpeg",
    ];

    const [data, setData] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [privateJobs, setPrivateJobs] = useState([]);
    const [institutionData, setInstitutionData] = useState({}); // Store institution data by institutionId

    const getDataFromDatabase = async () => {

        const cData = await getAllData("categories");  // Firestore se data fetch

        console.log("this is c data", cData);

        setData(cData)

    };
    useEffect(() => {
        getDataFromDatabase();
    }, [])

    // Subscribe to real-time institution jobs
    useEffect(() => {
        const q = query(collection(db, 'post jobs'));
        const unsub = onSnapshot(q, async (snap) => {
            const list = [];
            const instDataMap = {};
            
            for (const d of snap.docs) {
                const jobData = { id: d.id, ...d.data() };
                list.push(jobData);
                
                // Fetch institution data if institutionId exists
                if (jobData.institutionId) {
                    try {
                        const instData = await getDataById('users', jobData.institutionId);
                        if (instData) {
                            instDataMap[jobData.institutionId] = instData;
                        }
                    } catch (error) {
                        console.error('Error fetching institution data:', error);
                    }
                }
            }
            
            setJobs(list);
            setInstitutionData(prev => ({ ...prev, ...instDataMap }));
        }, () => setJobs([]));
        return () => unsub();
    }, []);

    // Subscribe to real-time private (course) jobs posted by institutes
    // Assumption: course-specific jobs are marked with jobType = "Course"
    useEffect(() => {
        const q = query(collection(db, 'post jobs'), where('jobType', '==', 'Course'));
        const unsub = onSnapshot(q, async (snap) => {
            const list = [];
            const instDataMap = {};
            
            for (const d of snap.docs) {
                const jobData = { id: d.id, ...d.data() };
                list.push(jobData);
                
                // Fetch institution data if institutionId exists
                if (jobData.institutionId) {
                    try {
                        const instData = await getDataById('users', jobData.institutionId);
                        if (instData) {
                            instDataMap[jobData.institutionId] = instData;
                        }
                    } catch (error) {
                        console.error('Error fetching institution data:', error);
                    }
                }
            }
            
            setPrivateJobs(list);
            setInstitutionData(prev => ({ ...prev, ...instDataMap }));
        }, () => setPrivateJobs([]));
        return () => unsub();
    }, []);

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
                    // navigate to Settings defined in the parent TeacherStack
                    navigation.getParent()?.getParent()?.navigate('Settings');
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



            {/* Apply For Section */}
            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "bold", marginTop: 20 }}>
                Apply For
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                {/* All */}
                {data?.map((item, index) => (
                    <TouchableOpacity onPress={() => navigation.navigate("InstBrowse")} style={{ marginHorizontal: 10, alignItems: "center" }}>
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
            <View style={{ marginVertical: 10, paddingHorizontal: 15 }}>
                {jobs.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        onPress={() => navigation.navigate('Jobdetails', { jobId: item.id })}
                        activeOpacity={0.9}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 16,
                            padding: 18,
                            marginBottom: 16,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 4,
                            borderWidth: 1,
                            borderColor: "#e0e0e0"
                        }}>
                        {/* Header Row with Logo and Title */}
                        <View style={{ flexDirection: "row", marginBottom: 12 }}>
                            {/* Institution Logo */}
                            <View style={{ 
                                width: 60, 
                                height: 60, 
                                borderRadius: 12, 
                                backgroundColor: "#f5f5f5",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 12,
                                overflow: "hidden"
                            }}>
                                {institutionData[item.institutionId]?.profileImage || institutionData[item.institutionId]?.profilePicUrl ? (
                            <Image
                                        source={{ uri: institutionData[item.institutionId]?.profileImage || institutionData[item.institutionId]?.profilePicUrl }}
                                        style={{ width: 60, height: 60, borderRadius: 12 }}
                            />
                                ) : (
                                    <Ionicons name="business" size={30} color="purple" />
                                )}
                        </View>

                            {/* Title and Institution */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ 
                                    fontWeight: "bold", 
                                    fontSize: 17, 
                                    color: "#1a1a1a",
                                    marginBottom: 4,
                                    lineHeight: 22
                                }}>
                                    {item.jobTitle || 'Teaching Job'}
                                </Text>
                                <Text style={{ 
                                    fontSize: 14, 
                                    color: "purple",
                                    fontWeight: "500"
                                }}>
                                    {institutionData[item.institutionId]?.institutionname || 'Institution'}
                                </Text>
                            </View>
                        </View>

                        {/* Job Details Grid */}
                        <View style={{ marginBottom: 12 }}>
                            {!!item.subject && (
                                <View style={{ 
                                    flexDirection: "row", 
                                    alignItems: "center", 
                                    marginBottom: 8,
                                    backgroundColor: "#f8f8f8",
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    borderRadius: 8
                                }}>
                                    <Ionicons name="book-outline" size={16} color="purple" style={{ marginRight: 8 }} />
                                    <Text style={{ fontSize: 13, color: "#444", fontWeight: "500" }}>
                                        {item.subject}
                                    </Text>
                            </View>
                        )}
                            
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                {!!item.location && (
                                    <View style={{ 
                                        flexDirection: "row", 
                                        alignItems: "center",
                                        backgroundColor: "#f8f8f8",
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        borderRadius: 8,
                                        flex: 1,
                                        minWidth: "45%"
                                    }}>
                                        <Ionicons name="location-outline" size={14} color="purple" style={{ marginRight: 6 }} />
                                        <Text style={{ fontSize: 12, color: "#666", flex: 1 }} numberOfLines={1}>
                                            {item.location}
                                        </Text>
                            </View>
                        )}
                                
                        {!!item.salary && (
                                    <View style={{ 
                                        flexDirection: "row", 
                                        alignItems: "center",
                                        backgroundColor: "#f8f8f8",
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        borderRadius: 8,
                                        flex: 1,
                                        minWidth: "45%"
                                    }}>
                                        <Ionicons name="cash-outline" size={14} color="purple" style={{ marginRight: 6 }} />
                                        <Text style={{ fontSize: 12, color: "#666", fontWeight: "600" }}>
                                            {item.salary}
                                        </Text>
                            </View>
                        )}
                            </View>
                            
                            {!!item.experience && (
                                <View style={{ 
                                    flexDirection: "row", 
                                    alignItems: "center", 
                                    marginTop: 8,
                                    backgroundColor: "#f8f8f8",
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    borderRadius: 8
                                }}>
                                    <MaterialCommunityIcons name="briefcase-outline" size={14} color="purple" style={{ marginRight: 6 }} />
                                    <Text style={{ fontSize: 12, color: "#666" }}>
                                        Experience: {item.experience}
                                    </Text>
                            </View>
                        )}
                        </View>

                        {/* Action Buttons */}
                        <View style={{ 
                            flexDirection: "row", 
                            justifyContent: "space-between", 
                            marginTop: 8,
                            gap: 10
                        }}>
                            <TouchableOpacity 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    navigation.navigate("Jobdetails", { jobId: item.id });
                                }}
                                style={{ 
                                    backgroundColor: "purple", 
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 10, 
                                    flex: 1,
                                    marginRight: 5,
                                    shadowColor: "purple",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}>
                                <Text style={{ 
                                    color: "#fff", 
                                    textAlign: "center", 
                                    fontSize: 14,
                                    fontWeight: "600"
                                }}>
                                    View Details
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        const auth = getAuth();
                                        const currentUser = auth.currentUser;
                                        
                                        if (currentUser && item.institutionId) {
                                            const conversationId = await getOrCreateConversation(currentUser.uid, item.institutionId);
                                            const otherUser = await getDataById('users', item.institutionId);
                                            navigation.navigate('ChatScreen', {
                                                conversationId,
                                                otherUser: {
                                                    id: item.institutionId,
                                                    name: otherUser?.institutionname || 'Institution',
                                                    photoUrl: otherUser?.profileImage || null,
                                                }
                                            });
                                        }
                                    } catch (error) {
                                        console.error('Error starting chat:', error);
                                    }
                                }}
                                style={{ 
                                    backgroundColor: "#fff", 
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 10, 
                                    flex: 1,
                                    marginLeft: 5,
                                    borderWidth: 1.5,
                                    borderColor: "purple"
                                }}
                            >
                                <Text style={{ 
                                    color: "purple", 
                                    textAlign: "center", 
                                    fontSize: 14,
                                    fontWeight: "600"
                                }}>
                                    Chat
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Private Jobs</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("PrivBrowse")} >
                    <Text style={{ color: 'purple', fontWeight: 'bold' }}>View All</Text>
                </TouchableOpacity>
                </View>

                {/* Private (Course) Jobs from Firestore */}
                {privateJobs.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        onPress={() => navigation.navigate('Jobdetails', { jobId: item.id })}
                        activeOpacity={0.9}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 16,
                            padding: 18,
                            marginBottom: 16,
                        shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 4,
                            borderWidth: 1,
                            borderColor: "#e0e0e0"
                        }}>
                        {/* Header Row with Logo and Title */}
                        <View style={{ flexDirection: "row", marginBottom: 12 }}>
                            {/* Institution Logo */}
                            <View style={{ 
                                width: 60, 
                                height: 60, 
                                borderRadius: 12, 
                                backgroundColor: "#f5f5f5",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 12,
                                overflow: "hidden"
                            }}>
                                {institutionData[item.institutionId]?.profileImage || institutionData[item.institutionId]?.profilePicUrl ? (
                            <Image
                                        source={{ uri: institutionData[item.institutionId]?.profileImage || institutionData[item.institutionId]?.profilePicUrl }}
                                        style={{ width: 60, height: 60, borderRadius: 12 }}
                            />
                                ) : (
                                    <Ionicons name="business" size={30} color="purple" />
                                )}
                        </View>

                            {/* Title and Institution */}
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                    <View style={{ 
                                        backgroundColor: "#E8D5FF", 
                                        paddingHorizontal: 8, 
                                        paddingVertical: 3, 
                                        borderRadius: 6,
                                        marginRight: 8
                                    }}>
                                        <Text style={{ fontSize: 10, color: "purple", fontWeight: "600" }}>
                                            COURSE
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ 
                                    fontWeight: "bold", 
                                    fontSize: 17, 
                                    color: "#1a1a1a",
                                    marginBottom: 4,
                                    lineHeight: 22
                                }}>
                                    {item.jobTitle || 'Course Tutor Required'}
                                </Text>
                                <Text style={{ 
                                    fontSize: 14, 
                                    color: "purple",
                                    fontWeight: "500"
                                }}>
                                    {institutionData[item.institutionId]?.institutionname || 'Institution'}
                                </Text>
                            </View>
                        </View>

                        {/* Job Details Grid */}
                        <View style={{ marginBottom: 12 }}>
                            {!!item.subject && (
                                <View style={{ 
                                    flexDirection: "row", 
                                    alignItems: "center", 
                                    marginBottom: 8,
                                    backgroundColor: "#f8f8f8",
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    borderRadius: 8
                                }}>
                                    <Ionicons name="book-outline" size={16} color="purple" style={{ marginRight: 8 }} />
                                    <Text style={{ fontSize: 13, color: "#444", fontWeight: "500" }}>
                                        Course: {item.subject}
                                    </Text>
                            </View>
                        )}
                            
                            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                {!!item.location && (
                                    <View style={{ 
                                        flexDirection: "row", 
                                        alignItems: "center",
                                        backgroundColor: "#f8f8f8",
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        borderRadius: 8,
                                        flex: 1,
                                        minWidth: "45%"
                                    }}>
                                        <Ionicons name="location-outline" size={14} color="purple" style={{ marginRight: 6 }} />
                                        <Text style={{ fontSize: 12, color: "#666", flex: 1 }} numberOfLines={1}>
                                            {item.location}
                                        </Text>
                            </View>
                        )}
                                
                        {!!item.salary && (
                                    <View style={{ 
                                        flexDirection: "row", 
                                        alignItems: "center",
                                        backgroundColor: "#f8f8f8",
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        borderRadius: 8,
                                        flex: 1,
                                        minWidth: "45%"
                                    }}>
                                        <Ionicons name="cash-outline" size={14} color="purple" style={{ marginRight: 6 }} />
                                        <Text style={{ fontSize: 12, color: "#666", fontWeight: "600" }}>
                                            {item.salary}
                                        </Text>
                            </View>
                        )}
                            </View>
                            
                            {!!item.experience && (
                                <View style={{ 
                                    flexDirection: "row", 
                                    alignItems: "center", 
                                    marginTop: 8,
                                    backgroundColor: "#f8f8f8",
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    borderRadius: 8
                                }}>
                                    <MaterialCommunityIcons name="briefcase-outline" size={14} color="purple" style={{ marginRight: 6 }} />
                                    <Text style={{ fontSize: 12, color: "#666" }}>
                                        Experience: {item.experience}
                                    </Text>
                            </View>
                        )}
                        </View>

                        {/* Action Buttons */}
                        <View style={{ 
                            flexDirection: "row", 
                            justifyContent: "space-between", 
                            marginTop: 8,
                            gap: 10
                        }}>
                            <TouchableOpacity 
                                onPress={(e) => {
                                    e.stopPropagation();
                                    navigation.navigate("Jobdetails", { jobId: item.id });
                                }}
                                style={{ 
                                    backgroundColor: "purple", 
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 10, 
                                    flex: 1,
                                    marginRight: 5,
                                    shadowColor: "purple",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}>
                                <Text style={{ 
                                    color: "#fff", 
                                    textAlign: "center", 
                                    fontSize: 14,
                                    fontWeight: "600"
                                }}>
                                    View Details
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        const auth = getAuth();
                                        const currentUser = auth.currentUser;
                                        
                                        if (currentUser && item.institutionId) {
                                            const conversationId = await getOrCreateConversation(currentUser.uid, item.institutionId);
                                            const otherUser = await getDataById('users', item.institutionId);
                                            navigation.navigate('ChatScreen', {
                                                conversationId,
                                                otherUser: {
                                                    id: item.institutionId,
                                                    name: otherUser?.institutionname || 'Institution',
                                                    photoUrl: otherUser?.profileImage || null,
                                                }
                                            });
                                        }
                                    } catch (error) {
                                        console.error('Error starting chat:', error);
                                    }
                                }}
                                style={{ 
                                    backgroundColor: "#fff", 
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 10, 
                                    flex: 1,
                                    marginLeft: 5,
                                    borderWidth: 1.5,
                                    borderColor: "purple"
                                }}
                            >
                                <Text style={{ 
                                    color: "purple", 
                                    textAlign: "center", 
                                    fontSize: 14,
                                    fontWeight: "600"
                                }}>
                                    Chat
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

        </ScrollView>
    );
} 