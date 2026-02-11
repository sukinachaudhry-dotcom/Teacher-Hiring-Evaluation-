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
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getDataById } from '../Helper/firebaseHelper';

export default function SchoolCollegeJobs({ navigation }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [institutionData, setInstitutionData] = useState({});

    // Fetch all jobs (simplified)
    useEffect(() => {
        console.log('SchoolCollegeJobs: Starting to fetch jobs...');
        
        const fetchJobs = async () => {
            try {
                setLoading(true);
                
                // Query all post jobs
                const q = collection(db, 'post jobs');
                
                const unsub = onSnapshot(q, async (snap) => {
                    console.log('SchoolCollegeJobs: Got snapshot with', snap.size, 'documents');
                    const list = [];
                    const instDataMap = {};
                    
                    for (const d of snap.docs) {
                        const jobData = { id: d.id, ...d.data() };
                        console.log('SchoolCollegeJobs: Processing job', jobData.id);
                        
                        // Fetch institution data
                        if (jobData.institutionId) {
                            try {
                                const instData = await getDataById('users', jobData.institutionId);
                                if (instData) {
                                    console.log('SchoolCollegeJobs: Got institution data for', jobData.institutionId);
                                    instDataMap[jobData.institutionId] = instData;
                                    list.push(jobData);
                                }
                            } catch (error) {
                                console.error('SchoolCollegeJobs: Error fetching institution data:', error);
                            }
                        }
                    }
                    
                    console.log('SchoolCollegeJobs: Total jobs found:', list.length);
                    setJobs(list);
                    setInstitutionData(instDataMap);
                    setLoading(false);
                    setRefreshing(false);
                }, (error) => {
                    console.error('SchoolCollegeJobs: Error fetching jobs:', error);
                    setLoading(false);
                    setRefreshing(false);
                });

                return () => {
                    console.log('SchoolCollegeJobs: Cleaning up listener');
                    unsub();
                };
            } catch (e) {
                console.error('SchoolCollegeJobs: Error setting up query:', e);
                setLoading(false);
                setRefreshing(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter jobs based on search
    const filteredJobs = jobs.filter(job => {
        const searchLower = search.toLowerCase();
        return (
            job.jobTitle?.toLowerCase().includes(searchLower) ||
            job.subject?.toLowerCase().includes(searchLower) ||
            job.location?.toLowerCase().includes(searchLower) ||
            institutionData[job.institutionId]?.institutionname?.toLowerCase().includes(searchLower)
        );
    });

    const onRefresh = () => {
        console.log('SchoolCollegeJobs: Refreshing...');
        setRefreshing(true);
    };

    const JobCard = ({ job }) => (
        <TouchableOpacity 
            key={job.id} 
            onPress={() => {
                console.log('SchoolCollegeJobs: Job card pressed, job ID:', job.id);
                navigation.navigate('Jobdetails', { jobId: job.id });
            }}
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
                    {institutionData[job.institutionId]?.profileImage || institutionData[job.institutionId]?.profilePicUrl ? (
                        <Image
                            source={{ uri: institutionData[job.institutionId]?.profileImage || institutionData[job.institutionId]?.profilePicUrl }}
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
                        {job.jobTitle || 'Teaching Job'}
                    </Text>
                    <Text style={{ 
                        fontSize: 14, 
                        color: "purple",
                        fontWeight: "500"
                    }}>
                        {institutionData[job.institutionId]?.institutionname || 'Institution'}
                    </Text>
                </View>
            </View>

            {/* Job Details Grid */}
            <View style={{ marginBottom: 12 }}>
                {!!job.subject && (
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
                            {job.subject}
                        </Text>
                    </View>
                )}
                
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {!!job.location && (
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

                    {!!job.salary && (
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
                                {job.salary}
                            </Text>
                        </View>
                    )}
                </View>

                {!!job.experience && (
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
                            Experience: {job.experience}
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
                        console.log('SchoolCollegeJobs: View Details pressed, job ID:', job.id);
                        navigation.navigate("Jobdetails", { jobId: job.id });
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
                <TouchableOpacity onPress={() => {
                    console.log('SchoolCollegeJobs: Back button pressed');
                    navigation.goBack();
                }}>
                    <Ionicons name="arrow-back" size={28} color='#fff' />
                </TouchableOpacity>

                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    School & College Jobs
                </Text>

                <View style={{ width: 28 }} />
            </View>

            {/* Search Bar */}
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                <TextInput
                    placeholder="Search School/College Jobs..."
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

            {/* Jobs List */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="purple" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Loading School/College Jobs...</Text>
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
                                {filteredJobs.length} School/College Job{filteredJobs.length !== 1 ? 's' : ''} Found
                            </Text>
                            {filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
                            <Ionicons name="business-outline" size={60} color="#ccc" />
                            <Text style={{ marginTop: 20, fontSize: 16, color: '#666', textAlign: 'center' }}>
                                {search ? 'No school/college jobs found matching your search' : 'No school/college jobs available at the moment'}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
