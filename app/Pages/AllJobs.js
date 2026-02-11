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

export default function AllJobs({ navigation }) {
    const [search, setSearch] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [institutionData, setInstitutionData] = useState({});

    // Fetch all jobs from all categories
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                setLoading(true);
                
                // Fetch all jobs from post jobs collection
                const jobsQuery = collection(db, 'post jobs');
                const jobsUnsub = onSnapshot(jobsQuery, async (snap) => {
                    const jobArray = [];
                    const instDataMap = {};
                    
                    for (const d of snap.docs) {
                        const jobData = { id: d.id, ...d.data() };
                        
                        // Fetch institution data
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
                        jobArray.push(jobData);
                    }
                    
                    console.log('AllJobs: Total jobs found:', jobArray.length);
                    setJobs(jobArray);
                    setInstitutionData(instDataMap);
                    setLoading(false);
                });

                return () => {
                    jobsUnsub();
                };
            } catch (e) {
                console.error('Error fetching jobs:', e);
                setLoading(false);
            }
        };

        fetchAllJobs();
    }, []);

    // Filter jobs based on search
    const filteredJobs = jobs.filter((job) =>
        job.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        job.subject?.toLowerCase().includes(search.toLowerCase()) ||
        job.location?.toLowerCase().includes(search.toLowerCase()) ||
        institutionData[job.institutionId]?.institutionname?.toLowerCase().includes(search.toLowerCase())
    );

    const onRefresh = () => {
        // Refresh functionality
    };

    // Job Card Component
    const JobCard = ({ job }) => (
        <TouchableOpacity 
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
            }}
            onPress={() => {
                navigation.navigate('Jobdetails', { jobId: job.id });
            }}
        >
            {/* Header */}
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
                        <Image source={{ uri: institutionData[job.institutionId]?.profileImage || institutionData[job.institutionId]?.profilePicUrl }} style={{ width: 60, height: 60, borderRadius: 12 }} />
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
                        {job.jobTitle || 'Job'}
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

            {/* Job Details */}
            <View style={{ marginBottom: 12 }}>
                {job.subject && (
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

                    {job.salary && (
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

                {job.experience && (
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

            {/* View Details Button */}
            <TouchableOpacity 
                style={{ 
                    backgroundColor: "purple", 
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 10, 
                    shadowColor: "purple",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                <Text style={{ 
                    color: "#fff", 
                    textAlign: "center", 
                    fontSize: 14,
                    fontWeight: "600"
                }}>
                    View Details
                </Text>
            </TouchableOpacity>
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
                    All Jobs
                </Text>

                <View style={{ width: 28 }} />
            </View>

            {/* Search Bar */}
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                <TextInput
                    placeholder="Search All Jobs..."
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
                    <Text style={{ marginTop: 10, color: '#666' }}>Loading All Jobs...</Text>
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1, paddingHorizontal: 10 }}
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={onRefresh} />
                    }
                >
                    {filteredJobs.length > 0 ? (
                        <>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 5, marginVertical: 10 }}>
                                {filteredJobs.length} Jobs Found
                            </Text>
                            {filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
                            <Ionicons name="briefcase-outline" size={60} color="#ccc" />
                            <Text style={{ marginTop: 20, fontSize: 16, color: '#666', textAlign: 'center' }}>
                                {search ? 'No jobs found matching your search' : 'No jobs available at the moment'}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
