import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function TestManagement({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionCounts, setQuestionCounts] = useState({});

  useEffect(() => {
    const instUid = auth?.currentUser?.uid;
    if (!instUid) {
      setLoading(false);
      return;
    }

    // Listen to subjects in the tests collection for this institution
    const q = query(
      collection(db, 'tests'),
      where('institutionUid', '==', instUid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const subjectsList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          subjectsList.push({
            id: doc.id,
            subjectName: data.subjectName || 'Unnamed Subject',
            createdAt: data.createdAt,
          });
        });
        setSubjects(subjectsList);
        // Fetch MCQ counts for each subject's questions subcollection
        Promise.all(
          subjectsList.map(async (s) => {
            try {
              const qsSnap = await getDocs(collection(db, 'tests', s.id, 'questions'));
              return [s.id, qsSnap.size];
            } catch (e) {
              return [s.id, 0];
            }
          })
        ).then((entries) => {
          setQuestionCounts(Object.fromEntries(entries));
        });
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching subjects:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load subjects');
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDeleteSubject = (subjectId, subjectName) => {
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${subjectName}"? This will also delete all questions in this subject.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete all questions first
              const questionsRef = collection(db, 'tests', subjectId, 'questions');
              const questionsSnapshot = await getDocs(questionsRef);
              const deletePromises = questionsSnapshot.docs.map((doc) =>
                deleteDoc(doc.ref)
              );
              await Promise.all(deletePromises);

              // Delete the subject
              await deleteDoc(doc(db, 'tests', subjectId));
              Alert.alert('Success', 'Subject deleted successfully');
            } catch (error) {
              console.error('Error deleting subject:', error);
              Alert.alert('Error', 'Failed to delete subject');
            }
          },
        },
      ]
    );
  };

  const renderSubjectItem = ({ item }) => (
    <View style={styles.subjectCard}>
      <TouchableOpacity
        style={styles.subjectContent}
        onPress={() => navigation.navigate('SubjectQuestions', { subjectId: item.id, subjectName: item.subjectName })}
      >
        <View style={styles.subjectInfo}>
          <Ionicons name="book" size={24} color="purple" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.subjectName}>{item.subjectName}</Text>
            <Text style={styles.mcqCount}>{questionCounts[item.id] ?? 0} MCQs</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.iconButton, styles.editButton]}
          onPress={() => navigation.navigate('AddSubject', { subjectId: item.id, subjectName: item.subjectName, isEdit: true })}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.deleteButton]}
          onPress={() => handleDeleteSubject(item.id, item.subjectName)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Test Management</Text>
      </View>

      <FlatList
        data={subjects}
        renderItem={renderSubjectItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No subjects yet</Text>
            <Text style={styles.emptySubtext}>Tap the button below to add your first subject</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddSubject', { isEdit: false })}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.addButtonText}>Add Subject</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'purple',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  subjectCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  subjectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  mcqCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
    minWidth: 40,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  addButton: {
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

