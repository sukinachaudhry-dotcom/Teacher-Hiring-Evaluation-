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
import { collection, onSnapshot, deleteDoc, doc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function SubjectQuestions({ navigation, route }) {
  const { subjectId, subjectName } = route.params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) {
      setLoading(false);
      return;
    }

    // Listen to questions in the subject
    const q = query(
      collection(db, 'tests', subjectId, 'questions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const questionsList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          questionsList.push({
            id: doc.id,
            question: data.question || '',
            options: data.options || [],
            correctAnswer: data.correctAnswer || '',
            createdAt: data.createdAt,
          });
        });
        setQuestions(questionsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching questions:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load questions');
      }
    );

    return () => unsubscribe();
  }, [subjectId]);

  const handleDeleteQuestion = (questionId) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'tests', subjectId, 'questions', questionId));
              Alert.alert('Success', 'Question deleted successfully');
            } catch (error) {
              console.error('Error deleting question:', error);
              Alert.alert('Error', 'Failed to delete question');
            }
          },
        },
      ]
    );
  };

  const renderQuestionItem = ({ item, index }) => (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>Question {index + 1}</Text>
        <View style={styles.questionActions}>
          <TouchableOpacity
            style={[styles.iconButton, styles.editButton]}
            onPress={() =>
              navigation.navigate('AddQuestion', {
                subjectId,
                questionId: item.id,
                question: item.question,
                options: item.options,
                correctAnswer: item.correctAnswer,
                isEdit: true,
              })
            }
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.deleteButton]}
            onPress={() => handleDeleteQuestion(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.questionText}>{item.question}</Text>
      <View style={styles.optionsContainer}>
        {item.options.map((option, optIndex) => {
          const optionLabel = ['A', 'B', 'C', 'D'][optIndex];
          const isCorrect = item.correctAnswer === option;
          return (
            <View
              key={optIndex}
              style={[
                styles.optionItem,
                isCorrect && styles.correctOption,
              ]}
            >
              <Text style={styles.optionLabel}>{optionLabel}.</Text>
              <Text style={[styles.optionText, isCorrect && styles.correctText]}>
                {option}
              </Text>
              {isCorrect && (
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subjectName}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={questions}
        renderItem={renderQuestionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="help-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No questions yet</Text>
            <Text style={styles.emptySubtext}>Tap the button below to add your first question</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('AddQuestion', {
            subjectId,
            isEdit: false,
          })
        }
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.addButtonText}>Add Question</Text>
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
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 34,
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
  questionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: 'purple',
  },
  questionActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
    marginLeft: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  correctOption: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
    minWidth: 20,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  correctText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 8,
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


