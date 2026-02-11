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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { getDataById } from '../Helper/firebaseHelper';

export default function HomeTuitionJobs({ navigation }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [institutionData, setInstitutionData] = useState({});

    // Fetch students looking for home tuition
    useEffect(() => {
        const fetchStudentsForTuition = async () => {
            try {
                setLoading(true);
                
                // First try to query by role
                let q = query(
                    collection(db, 'users'),
                    where('role', '==', 'Student')
                );
                
                const unsub = onSnapshot(q, async (snap) => {
                    const list = [];
                    
                    console.log('Students snapshot size:', snap.size);
                    
                    // If no students found with role 'Student', try without role filter
                    if (snap.size === 0) {
                        console.log('No students found with role=Student, trying without role filter...');
                        
                        // Get all users and filter manually
                        const allUsersQuery = query(collection(db, 'users'));
                        const allUsersUnsub = onSnapshot(allUsersQuery, async (allSnap) => {
                            const studentList = [];
                            
                            for (const d of allSnap.docs) {
                                const userData = { id: d.id, ...d.data() };
                                console.log('User data:', userData);
                                
                                // Check if this user is a student (by role or by absence of teacher fields)
                                const isStudent = userData.role === 'Student' || 
                                                  (!userData.role && !userData.teachingsubjects && !userData.experience) ||
                                                  userData.userType === 'Student' ||
                                                  userData.accountType === 'Student';
                                
                                if (isStudent) {
                                    studentList.push({
                                        id: userData.id,
                                        studentId: userData.id,
                                        studentName: userData.fullname || userData.name || 'Student',
                                        studentPhoto: userData.profileImage || userData.profilePicUrl || null,
                                        location: userData.location || '',
                                        subjectsNeeded: userData.subjectsNeeded || userData.preferredSubjects || userData.teachingsubjects || '',
                                        gradeLevel: userData.gradeLevel || userData.class || userData.educationLevel || '',
                                        budget: userData.budget || userData.expectedSalary || '',
                                        description: userData.description || userData.about || '',
                                        availability: userData.availability || '',
                                        createdAt: userData.createdAt || null,
                                        email: userData.email || '',
                                        phone: userData.phone || ''
                                    });
                                }
                            }
                            
                            console.log('Total students found (manual filter):', studentList.length);
                            
                            // Sort by createdAt (most recent first)
                            studentList.sort((a, b) => {
                                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                return bTime - aTime;
                            });
                            
                            setJobs(studentList);
                            setLoading(false);
                            setRefreshing(false);
                        });
                        
                        return allUsersUnsub;
                    }
                    
                    // Normal flow - students found with role='Student'
                    for (const d of snap.docs) {
                        const studentData = { id: d.id, ...d.data() };
                        console.log('Student data:', studentData);
                        
                        // Include all students - they are all potentially looking for home tuition
                        list.push({
                            id: studentData.id,
                            studentId: studentData.id,
                            studentName: studentData.fullname || studentData.name || 'Student',
                            studentPhoto: studentData.profileImage || studentData.profilePicUrl || null,
                            location: studentData.location || '',
                            subjectsNeeded: studentData.subjectsNeeded || studentData.preferredSubjects || studentData.teachingsubjects || '',
                            gradeLevel: studentData.gradeLevel || studentData.class || studentData.educationLevel || '',
                            budget: studentData.budget || studentData.expectedSalary || '',
                            description: studentData.description || studentData.about || '',
                            availability: studentData.availability || '',
                            createdAt: studentData.createdAt || null,
                            email: studentData.email || '',
                            phone: studentData.phone || ''
                        });
                    }
                    
                    console.log('Total students found:', list.length);
                    
                    // Sort by createdAt (most recent first)
                    list.sort((a, b) => {
                        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return bTime - aTime;
                    });
                    
                    setJobs(list);
                    setLoading(false);
                    setRefreshing(false);
                }, (error) => {
                    console.error('Error fetching students for tuition:', error);
                    setLoading(false);
                    setRefreshing(false);
                });

                return () => unsub();
            } catch (e) {
                console.error('Error setting up students query:', e);
                setLoading(false);
                setRefreshing(false);
            }
        };

        fetchStudentsForTuition();
    }, []);

    // Filter jobs based on search
    const filteredJobs = jobs.filter(job => {
        const searchLower = search.toLowerCase();
        return (
            job.studentName?.toLowerCase().includes(searchLower) ||
            job.subjectsNeeded?.toLowerCase().includes(searchLower) ||
            job.location?.toLowerCase().includes(searchLower) ||
            job.gradeLevel?.toLowerCase().includes(searchLower) ||
            job.description?.toLowerCase().includes(searchLower) ||
            job.email?.toLowerCase().includes(searchLower)
        );
    });

    const onRefresh = () => {
        setRefreshing(true);
        // The useEffect will handle the refresh
    };

    const JobCard = ({ job }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Studentviewprofile', { studentId: job.studentId })}
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
            {/* Header Row with Student Profile */}
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {/* Student Profile Picture */}
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
                    {job.studentPhoto ? (
                        <Image
                            source={{ uri: job.studentPhoto }}
                            style={{ width: 60, height: 60, borderRadius: 12 }}
                        />
                    ) : (
                        <Ionicons name="person" size={30} color="purple" />
                    )}
                </View>

                {/* Student Name and Title */}
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: 17,
                        color: "#1a1a1a",
                        marginBottom: 4,
                        lineHeight: 22
                    }}>
                        {job.studentName || 'Student'}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: "purple",
                        fontWeight: "500"
                    }}>
                        Looking for Home Tutor
                    </Text>
                </View>
            </View>

            {/* Student Details Grid */}
            <View style={{ marginBottom: 12 }}>
                {job.subjectsNeeded && (
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
                            {job.subjectsNeeded}
                        </Text>
                    </View>
                )}

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {job.location && (
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
                                {job.location}
                            </Text>
                        </View>
                    )}

                    {job.gradeLevel && (
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
                            <Ionicons name="school-outline" size={14} color="purple" style={{ marginRight: 6 }} />
                            <Text style={{ fontSize: 12, color: "#666", fontWeight: "600" }}>
                                {job.gradeLevel}
                            </Text>
                        </View>
                    )}
                </View>

                {job.budget && (
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 8,
                        backgroundColor: "#f8f8f8",
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 8
                    }}>
                        <Ionicons name="cash-outline" size={14} color="purple" style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 12, color: "#666" }}>
                            Budget: {job.budget}
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
                        navigation.navigate("Studentviewprofile", { studentId: job.studentId });
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
                        elevation: 3
                    }}>
                    <Text style={{ color: "white", fontWeight: "bold", textAlign: "center", fontSize: 14 }}>
                        View Profile
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color='#fff' />
                </TouchableOpacity>

                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    Home Tuition Jobs
                </Text>

                <View style={{ width: 28 }} />
            </View>

            {/* Search Bar */}
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                <TextInput
                    placeholder="Search Students..."
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                    style={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: 20,
                        paddingHorizontal: 15,
                        height: 40,
                        fontSize: 14
                    }}
                />
            </View>

            {/* Students List */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="purple" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Loading Students...</Text>
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1, paddingHorizontal: 10 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {filteredJobs.length > 0 ? (
                        <>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 5, marginVertical: 10 }}>
                                {filteredJobs.length} Student{filteredJobs.length !== 1 ? 's' : ''} Looking for Home Tuition
                            </Text>
                            {filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
                            <Ionicons name="people-outline" size={60} color="#ccc" />
                            <Text style={{ marginTop: 20, fontSize: 16, color: '#666', textAlign: 'center' }}>
                                {search ? 'No students found matching your search' : 'No students looking for home tuition at the moment'}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
