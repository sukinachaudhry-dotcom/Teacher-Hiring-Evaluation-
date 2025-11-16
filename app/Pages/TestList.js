import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function TestList({ route, navigation }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { jobId, institutionId } = route.params;
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Get tests for this institution and subject
        const jobRef = doc(db, 'post jobs', jobId);
        const jobSnap = await getDoc(jobRef);
        
        if (jobSnap.exists()) {
          const jobData = jobSnap.data();
          const subject = jobData.subject;
          
          // Query tests for this institution and subject
          const testsRef = collection(db, 'tests');
          const q = query(
            testsRef,
            where('institutionUid', '==', institutionId),
            where('subjectName', '==', subject)
          );
          
          const querySnapshot = await getDocs(q);
          const testsData = [];
          
          for (const doc of querySnapshot.docs) {
            // Check if user has already taken this test
            const testData = { id: doc.id, ...doc.data() };
            testData.attempted = testData.attemptedBy?.includes(userId) || false;
            testsData.push(testData);
          }
          
          setTests(testsData);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
        Alert.alert('Error', 'Failed to load tests. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTests();
  }, [jobId, institutionId, userId]);

  const handleTestPress = (test) => {
    if (test.attempted) {
      Alert.alert('Test Already Taken', 'You have already attempted this test.');
    } else {
      navigation.navigate('TakeTest', { testId: test.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  if (tests.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTestsText}>No tests available for this position yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Tests</Text>
      <Text style={styles.subtitle}>Complete the test to proceed with your application</Text>
      
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.testCard, item.attempted && styles.attemptedCard]}
            onPress={() => handleTestPress(item)}
            disabled={item.attempted}
          >
            <View style={styles.testHeader}>
              <Text style={styles.testTitle}>{item.subjectName} Test</Text>
              {item.attempted ? (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Completed</Text>
                </View>
              ) : (
                <Ionicons name="arrow-forward-circle" size={24} color="purple" />
              )}
            </View>
            <Text style={styles.testInfo}>Questions: {item.questionCount || 'Loading...'}</Text>
            <Text style={styles.testInfo}>Duration: {item.duration || 'N/A'} minutes</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  testCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: 'purple',
  },
  attemptedCard: {
    opacity: 0.7,
    borderLeftColor: '#4CAF50',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  testInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noTestsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
});
