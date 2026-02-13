import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, doc, onSnapshot, orderBy, query, where, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { getAuth } from "firebase/auth";
import { getOrCreateConversation, getDataById } from "../Helper/firebaseHelper";

export default function Applicants({ route }) {
  const { jobId, jobTitle: jobTitleParam, showTestResults } = route.params || {};
  const [applicants, setApplicants] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [testResults, setTestResults] = useState({});
  const navigation = useNavigation();
  const user = useSelector(state => state.home.user);


  console.log(jobId);

  // Fetch job details
  React.useEffect(() => {
    if (!jobId) return;
    
    const fetchJobDetails = async () => {
      try {
        const jobDoc = await getDoc(doc(db, 'post jobs', jobId));
        if (jobDoc.exists()) {
          setJobDetails({ id: jobDoc.id, ...jobDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    
    fetchJobDetails();
  }, [jobId]);

  const fetchTestResults = async (applicantUserId, jobId) => {
    try {
      console.log('🔍 Fetching test results for:', { applicantUserId, jobId });
      
      // First, let's check if there are ANY test results in the database
      const allTestResultsQuery = query(collection(db, 'testResults'));
      const allTestResultsSnapshot = await getDocs(allTestResultsQuery);
      console.log('📊 Total test results in database:', allTestResultsSnapshot.size);
      
      allTestResultsSnapshot.docs.forEach(doc => {
        const result = doc.data();
        console.log('📝 Test result:', {
          id: doc.id,
          teacherId: result.teacherId,
          userId: result.userId,
          jobId: result.jobId,
          score: result.score,
          passed: result.passed
        });
      });
      
      // Try multiple query approaches
      let testResultsSnapshot;
      
      // Approach 1: teacherId field
      try {
        const testResultsQuery1 = query(
          collection(db, 'testResults'),
          where('teacherId', '==', applicantUserId),
          where('jobId', '==', jobId)
        );
        testResultsSnapshot = await getDocs(testResultsQuery1);
        console.log('🎯 Approach 1 (teacherId):', testResultsSnapshot.size);
      } catch (error1) {
        console.log('❌ Approach 1 failed:', error1.message);
      }
      
      // Approach 2: userId field (fallback)
      if (!testResultsSnapshot || testResultsSnapshot.empty) {
        try {
          const testResultsQuery2 = query(
            collection(db, 'testResults'),
            where('userId', '==', applicantUserId),
            where('jobId', '==', jobId)
          );
          testResultsSnapshot = await getDocs(testResultsQuery2);
          console.log('🎯 Approach 2 (userId):', testResultsSnapshot.size);
        } catch (error2) {
          console.log('❌ Approach 2 failed:', error2.message);
        }
      }
      
      // Approach 3: Any applicant field (fallback)
      if (!testResultsSnapshot || testResultsSnapshot.empty) {
        try {
          const testResultsQuery3 = query(
            collection(db, 'testResults'),
            where('applicantId', '==', applicantUserId),
            where('jobId', '==', jobId)
          );
          testResultsSnapshot = await getDocs(testResultsQuery3);
          console.log('🎯 Approach 3 (applicantId):', testResultsSnapshot.size);
        } catch (error3) {
          console.log('❌ Approach 3 failed:', error3.message);
        }
      }
      
      if (testResultsSnapshot && !testResultsSnapshot.empty) {
        const result = testResultsSnapshot.docs[0].data();
        console.log('✅ Test result data:', result);
        return {
          hasTest: true,
          score: result.score,
          passed: result.passed,
          submittedAt: result.submittedAt
        };
      }
      console.log('❌ No test results found for:', { applicantUserId, jobId });
      return { hasTest: false };
    } catch (error) {
      console.error('💥 Error fetching test results:', error);
      return { hasTest: false };
    }
  };

  const fetchApplicationsByJobId = async () => {
    try {
      setLoading(true);
      const allApplications = [];
      const institutionId = user?.uid || auth?.currentUser?.uid;
      
      if (!institutionId) {
        console.warn('No institution ID found');
        setApplicants([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      let applicationsSnapshot;
      let useManualSort = false;
      
      if (jobId) {
        // Fetch applications for a specific job
        try {
          // Try with orderBy first
          const applicationsQuery = query(
            collection(db, 'applications'),
            where('jobId', '==', jobId),
            orderBy('updatedAt', 'desc')
          );
          applicationsSnapshot = await getDocs(applicationsQuery);
          console.log('Applications fetched with orderBy:', applicationsSnapshot.docs.length);
        } catch (error) {
          // If orderBy fails (no index), use simple query and sort manually
          console.warn('OrderBy failed, using simple query:', error.message);
          useManualSort = true;
          const applicationsQuery = query(
            collection(db, 'applications'),
            where('jobId', '==', jobId)
          );
          applicationsSnapshot = await getDocs(applicationsQuery);
          console.log('Applications fetched without orderBy:', applicationsSnapshot.docs.length);
        }
      } else {
        // Fetch all applications for all jobs of this institution
        // First, get all job IDs for this institution
        const jobsQuery = query(
          collection(db, 'post jobs'),
          where('institutionId', '==', institutionId)
        );
        const jobsSnapshot = await getDocs(jobsQuery);
        const jobIds = jobsSnapshot.docs.map(doc => doc.id);
        
        if (jobIds.length === 0) {
          console.log('No jobs found for this institution');
          setApplicants([]);
          setLoading(false);
          setRefreshing(false);
          return;
        }
        
        // Fetch all applications for all these jobs
        // Note: Firestore 'in' query supports up to 10 items, so we may need to batch
        const batchSize = 10;
        const allDocs = [];
        
        for (let i = 0; i < jobIds.length; i += batchSize) {
          const batch = jobIds.slice(i, i + batchSize);
          try {
            const applicationsQuery = query(
              collection(db, 'applications'),
              where('jobId', 'in', batch)
            );
            const batchSnapshot = await getDocs(applicationsQuery);
            allDocs.push(...batchSnapshot.docs);
          } catch (error) {
            console.error('Error fetching applications batch:', error);
          }
        }
        
        applicationsSnapshot = { docs: allDocs };
        useManualSort = true; // Always sort manually when fetching multiple jobs
        console.log('Applications fetched for all jobs:', allDocs.length);
      }
      
      console.log("Applications found:", applicationsSnapshot.docs.length);
      
      // Convert to array and sort manually if needed
      let docsArray = Array.from(applicationsSnapshot.docs);
      if (useManualSort) {
        docsArray.sort((a, b) => {
          const aTime = a.data().updatedAt?.toDate?.() || new Date(0);
          const bTime = b.data().updatedAt?.toDate?.() || new Date(0);
          return bTime - aTime; // Descending order
        });
      }
      
      // 2. For each application, fetch user data and job data from collections
      for (const appDoc of docsArray) {
        const appData = appDoc.data();
        
        // Fetch job details if not already fetched
        let currentJobDetails = jobDetails;
        if (!currentJobDetails && appData.jobId) {
          try {
            const jobDoc = await getDoc(doc(db, 'post jobs', appData.jobId));
            if (jobDoc.exists()) {
              currentJobDetails = { id: jobDoc.id, ...jobDoc.data() };
            }
          } catch (jobError) {
            console.error('Error fetching job details:', jobError);
          }
        }
        
        // Fetch user data using userId from application document
        if (appData.userId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', appData.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              
              // Fetch test results if showTestResults is true
              let testResultData = { hasTest: false };
              if (showTestResults) {
                console.log('Fetching test results for applicant:', appData.userId);
                testResultData = await fetchTestResults(appData.userId, appData.jobId || jobId);
                console.log('Test result attached to applicant:', testResultData);
              }
              
              allApplications.push({
                id: appDoc.id,
                ...appData,
                updatedAt: appData.updatedAt?.toDate?.() || new Date(),
                jobTitle: appData.jobTitle || currentJobDetails?.jobTitle || 'Job Title',
                jobId: appData.jobId || jobId,
                applicantInfo: userData,
                name: userData?.name || userData?.fullname || 'Unnamed',
                subject: userData?.teachingsubjects || userData?.subjects || '',
                experience: userData?.experience || '',
                location: userData?.location || userData?.address || '',
                photoUrl: userData?.profileImage || userData?.profilePicUrl || userData?.photoUrl || null,
                status: appData.status || 'Pending',
                userId: appData.userId,
                testResult: testResultData
              });
            } else {
              console.warn('User not found for userId:', appData.userId);
            }
          } catch (userError) {
            console.error('Error fetching user data for userId:', appData.userId, userError);
          }
        } else {
          console.warn('Application missing userId:', appDoc.id);
        }
      }
      
      console.log('Total applicants processed:', allApplications.length);
      setApplicants(allApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplicants([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    const institutionId = user?.uid || auth?.currentUser?.uid;
    
    if (!institutionId) {
      console.warn('No institution ID found');
      setLoading(false);
      return;
    }
    
    console.log('Fetching applications for jobId:', jobId || 'all jobs');
    fetchApplicationsByJobId();
    
    // Set up real-time listener for applications
    try {
      let applicationsQuery;
      
      if (jobId) {
        // Listen to applications for a specific job
        applicationsQuery = query(
          collection(db, 'applications'),
          where('jobId', '==', jobId)
        );
      } else {
        // Listen to all applications (we'll filter by institution jobs in the callback)
        applicationsQuery = query(collection(db, 'applications'));
      }
      
      const unsubscribe = onSnapshot(
        applicationsQuery, 
        () => {
          console.log('Applications updated, refetching...');
          fetchApplicationsByJobId();
        },
        (error) => {
          console.error('Error in onSnapshot:', error);
          setLoading(false);
        }
      );
      
      return () => {
        console.log('Cleaning up listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up listener:', error);
      setLoading(false);
    }
  }, [jobId, user?.uid]);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchApplicationsByJobId();
  };

  const renderApplicant = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ApplicantDetails', { applicant: item })}
    >
      <View style={styles.row}>
        {item.photoUrl ? (
          <Image 
            source={{ uri: item.photoUrl }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {item.name?.[0]?.toUpperCase() || 'A'}
            </Text>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
            <Text style={[
              styles.statusBadge, 
              item.status === 'accepted' ? styles.statusApproved : 
              item.status === 'rejected' ? styles.statusRejected : 
              item.status === 'contacted' ? styles.statusContacted :
              styles.statusPending
            ]}>
              {item.status === 'contacted' ? 'Contacted' : item.status || 'pending'}
            </Text>
          </View>
          <Text style={styles.jobTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.jobTitle || 'No Job Title'}
          </Text>
          <Text style={styles.detail}>
            <Icon name="work" size={14} color="#666" /> {item.subject || 'N/A'}
          </Text>
          <Text style={styles.detail}>
            <Icon name="school" size={14} color="#666" /> {item.experience || 'N/A'} experience
          </Text>
          
          {/* Test Results Display */}
          {showTestResults && item.testResult?.hasTest && (
            <View style={styles.testResultContainer}>
              <View style={styles.testResultHeader}>
                <Icon name="assignment" size={16} color="#4CAF50" />
                <Text style={styles.testResultTitle}>Test Result</Text>
              </View>
              <View style={[
                styles.testScoreBadge,
                item.testResult.passed ? styles.testPassed : styles.testFailed
              ]}>
                <Text style={styles.testScoreText}>
                  {item.testResult.score}% 
                  {item.testResult.passed ? ' ✓' : ' ✗'}
                </Text>
              </View>
              <Text style={styles.testDate}>
                Taken: {new Date(item.testResult.submittedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          <Text style={[styles.detail, { color: '#666', fontSize: 12, marginTop: 5 }]}>
            Updated: {item.updatedAt?.toLocaleDateString?.() || 'N/A'}
          </Text>
          
          {/* Chat Button */}
          <TouchableOpacity
            style={styles.chatButton}
            onPress={async () => {
              try {
                const authInstance = getAuth();
                const currentUser = authInstance.currentUser;

                if (!currentUser?.uid) {
                  Alert.alert("Error", "Please login first to start chat.");
                  return;
                }

                if (!item?.userId) {
                  Alert.alert("Error", "Teacher ID not found.");
                  return;
                }

                const conversationId = await getOrCreateConversation(currentUser.uid, item.userId);
                const otherUser = await getDataById("users", item.userId);

                if (!conversationId) {
                  Alert.alert("Error", "Unable to start chat. Please try again.");
                  return;
                }

                // Update applicant status to 'contacted' when chat starts
                try {
                  const applicationRef = doc(db, 'applications', item.id);
                  await updateDoc(applicationRef, {
                    status: 'contacted',
                    updatedAt: new Date()
                  });
                  console.log('✅ Applicant status updated to contacted');
                } catch (updateError) {
                  console.error('Error updating applicant status:', updateError);
                  // Continue with chat even if status update fails
                }

                navigation.navigate("ChatScreen", {
                  conversationId,
                  otherUser: {
                    id: item.userId,
                    name: otherUser?.name || otherUser?.fullname || item.name || "User",
                    photoUrl: otherUser?.profilePicUrl || otherUser?.profileImage || otherUser?.photoUrl || item.photoUrl || null,
                  },
                });
              } catch (error) {
                console.error("Error starting chat:", error);
                Alert.alert("Error", "Chat open nahi ho rahi. Please try again.");
              }
            }}
          >
            <Icon name="chat" size={16} color="#fff" />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={{ marginTop: 10 }}>Loading applicants...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={applicants}
        renderItem={renderApplicant}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9B5DE5']}
            tintColor="#9B5DE5"
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>
              {jobDetails?.jobTitle || jobTitleParam || 'Job Applications'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} found
            </Text>
            {jobDetails && (
              <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' }}>
                <Text style={styles.jobDetailText}>
                  <Icon name="location-on" size={14} color="#666" /> {jobDetails.location || jobDetails.jobLocation || 'N/A'}
                </Text>
                <Text style={styles.jobDetailText}>
                  <Icon name="attach-money" size={14} color="#666" /> {jobDetails.salary || 'N/A'}
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="assignment" size={60} color="#ddd" />
              <Text style={styles.emptyText}>No applications found</Text>
              <Text style={styles.emptySubtext}>Applications will appear here when teachers apply to your jobs</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  jobDetailText: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'flex-start',
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatarPlaceholder: {
    backgroundColor: '#e9d8fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    color: '#6B46C1',
    fontWeight: 'bold',
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333',
    flex: 1,
  },
  detail: { 
    fontSize: 13, 
    color: '#666', 
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  statusApproved: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusRejected: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  statusContacted: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusPending: {
    backgroundColor: '#e2e3e5',
    color: '#383d41',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '500', 
    fontSize: 12,
  },
  testResultContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  testResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  testResultTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  testScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  testPassed: {
    backgroundColor: '#d4edda',
  },
  testFailed: {
    backgroundColor: '#f8d7da',
  },
  testScoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  testDate: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
