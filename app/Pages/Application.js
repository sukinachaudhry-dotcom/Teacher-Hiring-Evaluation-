import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { db } from "../../firebase";
import { auth } from "../../firebase";

export default function MyApplicationsScreen({ navigation }) {
  // Fetch applications from Firestore
  const [applications, setApplications] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [hasTest, setHasTest] = useState(false);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!userId) return;

        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('applicantId', '==', userId));
        const querySnapshot = await getDocs(q);

        const apps = [];
        for (const doc of querySnapshot.docs) {
          const appData = { id: doc.id, ...doc.data() };

          // Check if there's a test for this application
          if (appData.institutionId) {
            const testsRef = collection(db, 'tests');
            const testQuery = query(
              testsRef,
              where('institutionUid', '==', appData.institutionId),
              where('subjectName', '==', appData.jobTitle?.split(' ')[0] || '')
            );

            const testSnapshot = await getDocs(testQuery);
            if (!testSnapshot.empty) {
              const testData = testSnapshot.docs[0].data();
              appData.hasTest = true;
              appData.testId = testSnapshot.docs[0].id;
              appData.testData = testData;
            }
          }

          apps.push(appData);
        }

        setApplications(apps);
      } catch (error) {
        console.error('Error fetching applications:', error);
        Alert.alert('Error', 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId]);

  const handleTakeTest = (testId, institutionId, jobId) => {
    navigation.navigate('TestList', { testId, institutionId, jobId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.jobTitle || item.title}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <Ionicons name="school-outline" size={18} color="black" style={{ marginRight: 6 }} />
        <Text style={styles.institute}>{item.institutionName || item.institute}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <Ionicons name="cash-outline" size={18} color="black" style={{ marginRight: 6 }} />
        <Text style={styles.salary}>{item.salary || 'Salary not specified'}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
        <MaterialCommunityIcons name="progress-clock" size={18} color="black" style={{ marginRight: 6 }} />
        <Text style={styles.status}>Status: {item.status || 'Pending'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Jobdetails", { jobId: item.jobId })}
          style={[styles.button, { flex: 1, marginRight: 5 }]}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>

        {item.hasTest && (
          <TouchableOpacity
            onPress={() => handleTakeTest(item.testId, item.institutionId, item.jobId)}
            style={[styles.button, styles.testButton]}
          >
            <Text style={styles.buttonText}>Take Test</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", padding: 15 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
        My Applications
      </Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
        </View>
      ) : applications.length > 0 ? (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No applications found</Text>
          <Text style={styles.emptySubtext}>Apply to jobs to see them here</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  institute: {
    fontSize: 14,
    color: "#555",
  },
  salary: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    color: "purple",
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: "purple",
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  testButton: {
    backgroundColor: '#6a1b9a',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    padding: 20,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
