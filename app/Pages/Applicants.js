import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, doc, onSnapshot, orderBy, query, where, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function Applicants({ route }) {
  const { jobId } = route.params || {};
  const [applicants, setApplicants] = React.useState([]);
  const [jobDetails, setJobDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

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

  // Fetch applicants for the specific job
  React.useEffect(() => {
    let userUnsubs = [];
    setLoading(true);
    
    try {
      const instUid = auth?.currentUser?.uid;
      if (!instUid || !jobId) return;

      // Query applications for this specific job
      const appsQ = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId),
        orderBy('appliedAt', 'desc')
      );

      const unsubApps = onSnapshot(appsQ, (snap) => {
        const applications = [];
        snap.forEach(doc => {
          applications.push({ id: doc.id, ...doc.data() });
        });

        // Clean previous listeners
        userUnsubs.forEach((u) => u && u());
        userUnsubs = [];

        if (applications.length === 0) {
          setApplicants([]);
          setLoading(false);
          return;
        }

        // Fetch teacher details for each application
        applications.forEach(app => {
          if (app.teacherUid) {
            const uUnsub = onSnapshot(doc(db, 'users', app.teacherUid), (uSnap) => {
              if (uSnap.exists()) {
                const data = uSnap.data();
                setApplicants(prev => {
                  const existing = prev.filter(a => a.uid !== app.teacherUid);
                  return [
                    ...existing,
                    {
                      ...app,
                      id: uSnap.id,
                      name: data?.name || data?.fullname || 'Unnamed',
                      subject: data?.teachingsubjects || data?.subjects || '',
                      experience: data?.experience || '',
                      location: data?.location || data?.address || '',
                      photoUrl: data?.profileImage || data?.photoUrl || null,
                      status: app.status || 'Pending',
                      appliedAt: app.appliedAt?.toDate?.() || new Date(),
                    }
                  ];
                });
              }
              setLoading(false);
            });
            userUnsubs.push(uUnsub);
          }
        });
      }, (error) => {
        console.error('Error fetching applications:', error);
        setLoading(false);
        setApplicants([]);
      });

      return () => {
        unsubApps && unsubApps();
        userUnsubs.forEach((u) => u && u());
      };
    } catch (e) {
      console.error('Error in useEffect:', e);
      setLoading(false);
      setApplicants([]);
    }
  }, [jobId]);

  const renderApplicant = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image 
          source={item.photoUrl ? { uri: item.photoUrl } : require("./Ali.jpeg")} 
          style={styles.avatar} 
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={[
              styles.statusBadge, 
              item.status === 'Approved' ? styles.statusApproved : 
              item.status === 'Rejected' ? styles.statusRejected : 
              styles.statusPending
            ]}>
              {item.status || 'Pending'}
            </Text>
          </View>
          <Text style={styles.detail}>
            <Icon name="work" size={14} color="#666" /> {item.subject || 'N/A'}
          </Text>
          <Text style={styles.detail}>
            <Icon name="school" size={14} color="#666" /> {item.experience || 'N/A'} experience
          </Text>
          <Text style={styles.detail}>
            <Icon name="location-on" size={14} color="#666" /> {item.location || 'Location not specified'}
          </Text>
          <Text style={[styles.detail, { color: '#666', fontSize: 12, marginTop: 5 }]}>
            Applied on: {item.appliedAt?.toLocaleDateString?.() || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#4A90E2' }]}
          onPress={() => {
            // Navigate to teacher profile or show details
          }}
        >
          <Text style={styles.btnText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
          onPress={() => {
            // Handle approve action
          }}
        >
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#F44336' }]}
          onPress={() => {
            // Handle reject action
          }}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
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
      <ScrollView>
        {jobDetails && (
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{jobDetails.jobTitle || 'Job Title'}</Text>
            <View style={styles.jobMeta}>
              <Text style={styles.jobMetaText}>
                <Icon name="location-on" size={14} color="#666" /> {jobDetails.location || 'N/A'}
              </Text>
              <Text style={styles.jobMetaText}>
                <Icon name="attach-money" size={14} color="#666" /> {jobDetails.salary || 'Salary not specified'}
              </Text>
              <Text style={styles.jobMetaText}>
                <Icon name="access-time" size={14} color="#666" /> {jobDetails.jobType || 'Full-time'}
              </Text>
            </View>
            {jobDetails.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Description</Text>
                <Text style={styles.jobDescription}>{jobDetails.description}</Text>
              </View>
            )}
            {jobDetails.requirements && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                <Text style={styles.jobDescription}>{jobDetails.requirements}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.applicantsContainer}>
          <Text style={styles.applicantsHeader}>
            {applicants.length} {applicants.length === 1 ? 'Applicant' : 'Applicants'}
          </Text>
          
          {applicants.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="people-outline" size={50} color="#ccc" />
              <Text style={styles.emptyStateText}>No applicants yet</Text>
              <Text style={styles.emptyStateSubtext}>Applicants will appear here when they apply to your job posting.</Text>
            </View>
          ) : (
            <FlatList
              data={applicants}
              renderItem={renderApplicant}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  jobHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  jobMeta: {
    marginBottom: 15,
  },
  jobMetaText: {
    color: '#666',
    marginBottom: 5,
    fontSize: 14,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  jobDescription: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  applicantsContainer: {
    padding: 15,
  },
  applicantsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
  },
  statusApproved: {
    backgroundColor: '#E8F5E9',
    color: '#388E3C',
  },
  statusRejected: {
    backgroundColor: '#FFEBEE',
    color: '#D32F2F',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
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
