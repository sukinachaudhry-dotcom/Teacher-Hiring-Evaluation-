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
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, doc, onSnapshot, orderBy, query, where, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';

export default function Applicants({ route }) {
  const { jobId } = route.params || {};
  const [applicants, setApplicants] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchApplicationsByJobId = async () => {
    if (!jobId) {
      console.warn('No jobId provided');
      setApplicants([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    
    try {
      setLoading(true);
      const allApplications = [];
      
      // 1. Fetch all applications for this specific jobId
      let applicationsSnapshot;
      let useManualSort = false;
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
      
      // 2. For each application, fetch user data from users collection
      for (const appDoc of docsArray) {
        const appData = appDoc.data();
        
        // Fetch user data using userId from application document
        if (appData.userId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', appData.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              allApplications.push({
                id: appDoc.id,
                ...appData,
                updatedAt: appData.updatedAt?.toDate?.() || new Date(),
                jobTitle: appData.jobTitle || jobDetails?.jobTitle || 'Job Title',
                jobId: appData.jobId || jobId,
                applicantInfo: userData,
                name: userData?.name || userData?.fullname || 'Unnamed',
                subject: userData?.teachingsubjects || userData?.subjects || '',
                experience: userData?.experience || '',
                location: userData?.location || userData?.address || '',
                photoUrl: userData?.profileImage || userData?.profilePicUrl || userData?.photoUrl || null,
                status: appData.status || 'Pending',
                userId: appData.userId
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
    if (!jobId) {
      console.warn('No jobId in route params');
      setLoading(false);
      return;
    }
    
    console.log('Fetching applications for jobId:', jobId);
    fetchApplicationsByJobId();
    
    // Set up real-time listener for applications of this specific job
    try {
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId)
      );
      
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
  }, [jobId]);
  
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
              styles.statusPending
            ]}>
              {item.status || 'pending'}
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
          <Text style={[styles.detail, { color: '#666', fontSize: 12, marginTop: 5 }]}>
            Updated: {item.updatedAt?.toLocaleDateString?.() || 'N/A'}
          </Text>
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
              {jobDetails?.jobTitle || 'Job Applications'}
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
    backgroundColor: '#E6F7E6',
    color: '#2E7D32',
  },
  statusRejected: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  statusPending: {
    backgroundColor: '#FFF8E1',
    color: '#F57F17',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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
});
