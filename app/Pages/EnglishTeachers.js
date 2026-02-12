import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { getOrCreateConversation, getDataById } from '../Helper/firebaseHelper';

export default function EnglishTeachers({ navigation }) {
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Fetch English teachers
    useEffect(() => {
        const fetchEnglishTeachers = async () => {
            try {
                setLoading(true);
                
                // Query teachers who teach English
                const q = query(
                    collection(db, 'users'),
                    where('role', '==', 'Teacher'),
                    where('teachingsubjects', '==', 'english')
                );

                const unsub = onSnapshot(q, (snap) => {
                    const teacherArray = [];
                    snap.forEach((doc) => {
                        const data = doc.data();
                        teacherArray.push({
                            id: doc.id,
                            name: data.name || data.fullname || 'Unnamed',
                            teachingsubjects: data.teachingsubjects || '',
                            experience: data.experience || '',
                            location: data.location || '',
                            photoUrl: data.photoUrl || data.profileImage || data.profilePicUrl || null,
                            ...data
                        });
                    });
                    
                    setTeachers(teacherArray);
                    setLoading(false);
                }, (error) => {
                    console.error('Error fetching English teachers:', error);
                    setLoading(false);
                });

                return () => unsub();
            } catch (e) {
                console.error('Error setting up English teachers query:', e);
                setLoading(false);
            }
        };

        fetchEnglishTeachers();
    }, []);

    // Filter teachers based on search
    const filteredTeachers = teachers.filter((teacher) =>
        teacher.name?.toLowerCase().includes(search.toLowerCase()) ||
        teacher.teachingsubjects?.toLowerCase().includes(search.toLowerCase()) ||
        teacher.location?.toLowerCase().includes(search.toLowerCase())
    );

    const onRefresh = () => {
        // Refresh functionality
    };

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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            {/* <View
                style={{
                    backgroundColor: 'purple',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color='#fff' />
                </TouchableOpacity>

                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    English Teachers
                </Text>

                <View style={{ width: 28 }} />
            </View> */}

            {/* Search Bar */}
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
                      placeholder="Search English Teachers"
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
            
                    <Ionicons name="book-outline" size={28} color="white" />
                  </View>

            {/* Teachers List */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="purple" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Loading English Teachers...</Text>
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1, paddingHorizontal: 10 }}
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={onRefresh} />
                    }
                >
                    {filteredTeachers.length > 0 ? (
                        <>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 5, marginVertical: 10 }}>
                                {filteredTeachers.length} English Teacher{filteredTeachers.length !== 1 ? 's' : ''} Found
                            </Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", margin: 10 }}>
                                {filteredTeachers.map((teacher, index) => (
                                    <TeacherCard key={teacher.id} teacher={teacher} />
                                ))}
                            </View>
                        </>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
                            <Ionicons name="school-outline" size={60} color="#ccc" />
                            <Text style={{ marginTop: 20, fontSize: 16, color: '#666', textAlign: 'center' }}>
                                {search ? 'No English teachers found matching your search' : 'No English teachers available at the moment'}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
