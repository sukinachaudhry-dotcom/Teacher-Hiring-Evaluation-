import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, getDocs, getDoc, updateDoc, arrayUnion, serverTimestamp, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

export default function TakeTest({ route, navigation }) {
  const { testId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testDetails, setTestDetails] = useState(null);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchTest = async () => {
      try {
        // Get test details
        const testRef = doc(db, 'tests', testId);
        const testSnap = await getDoc(testRef);
        
        if (testSnap.exists()) {
          setTestDetails({ id: testSnap.id, ...testSnap.data() });
          
          // Get questions for this test
          const questionsRef = collection(db, 'tests', testId, 'questions');
          const querySnapshot = await getDocs(questionsRef);
          
          const questionsData = [];
          querySnapshot.forEach((doc) => {
            questionsData.push({ id: doc.id, ...doc.data() });
          });
          
          setQuestions(questionsData);
          
          // Initialize answers object
          const initialAnswers = {};
          questionsData.forEach((q) => {
            initialAnswers[q.id] = '';
          });
          setAnswers(initialAnswers);
        }
      } catch (error) {
        console.error('Error fetching test:', error);
        Alert.alert('Error', 'Failed to load test. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTest();
  }, [testId]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      score: Math.round((correct / questions.length) * 100),
      total: questions.length,
      correct,
      incorrect: questions.length - correct
    };
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Calculate score
      const { score, total, correct, incorrect } = calculateScore();
      
      // Save test result
      const resultData = {
        userId,
        testId,
        score,
        totalQuestions: total,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        answers,
        submittedAt: serverTimestamp(),
      };
      
      // Add to test results collection
      const resultsRef = collection(db, 'testResults');
      const resultDoc = await addDoc(resultsRef, resultData);
      
      // Update test document to mark as attempted by user
      const testRef = doc(db, 'tests', testId);
      await updateDoc(testRef, {
        attemptedBy: arrayUnion(userId),
        updatedAt: serverTimestamp(),
      });
      
      // Navigate to results screen
      navigation.replace('TestResult', {
        result: {
          ...resultData,
          id: resultDoc.id,
          testTitle: testDetails?.subjectName || 'Test',
        },
      });
      
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Error', 'Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={styles.loadingText}>Loading test...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{testDetails?.subjectName || 'Test'}</Text>
            <Text style={styles.questionCount}>
              Question {Object.keys(answers).filter(k => answers[k]).length} of {questions.length}
            </Text>
          </View>
        </View>
        
        <ScrollView 
          style={styles.questionsContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {questions.map((question, index) => (
            <View key={question.id} style={styles.questionCard}>
              <Text style={styles.questionText}>
                {index + 1}. {question.question}
              </Text>
              
              <View style={styles.optionsContainer}>
                {question.options.map((option, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.option,
                      answers[question.id] === option && styles.optionSelected
                    ]}
                    onPress={() => handleAnswerSelect(question.id, option)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.radioOuter}>
                      {answers[question.id] === option && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={[
                      styles.optionText,
                      answers[question.id] === option && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || Object.values(answers).some(a => !a)}
            style={[
              styles.submitButton,
              (submitting || Object.values(answers).some(a => !a)) && styles.submitButtonDisabled
            ]}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                Submit Test
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  questionCount: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  questionsContainer: {
    flex: 1,
    padding: 15,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    lineHeight: 24,
  },
  optionsContainer: {
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
  },
  optionSelected: {
    backgroundColor: '#f0e6ff',
    borderColor: '#d9c4ff',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'purple',
  },
  optionText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  optionTextSelected: {
    color: '#6a1b9a',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: 'purple',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
