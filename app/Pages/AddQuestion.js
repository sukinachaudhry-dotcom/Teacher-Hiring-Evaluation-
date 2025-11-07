import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AddQuestion({ navigation, route }) {
  const { subjectId, questionId, question, options, correctAnswer, isEdit } = route.params || {};
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [selectedCorrectAnswer, setSelectedCorrectAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && question && options) {
      setQuestionText(question);
      setOptionA(options[0] || '');
      setOptionB(options[1] || '');
      setOptionC(options[2] || '');
      setOptionD(options[3] || '');
      setSelectedCorrectAnswer(correctAnswer || '');
    }
  }, [isEdit, question, options, correctAnswer]);

  const handleSave = async () => {
    // Validation
    if (!questionText.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      Alert.alert('Error', 'Please enter all four options');
      return;
    }

    if (!selectedCorrectAnswer) {
      Alert.alert('Error', 'Please select the correct answer');
      return;
    }

    setLoading(true);
    try {
      const optionsArray = [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()];

      if (isEdit && questionId) {
        // Update existing question
        await setDoc(
          doc(db, 'tests', subjectId, 'questions', questionId),
          {
            question: questionText.trim(),
            options: optionsArray,
            correctAnswer: selectedCorrectAnswer,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        Alert.alert('Success', 'Question updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        // Create new question
        const newQuestionRef = doc(collection(db, 'tests', subjectId, 'questions'));
        await setDoc(newQuestionRef, {
          question: questionText.trim(),
          options: optionsArray,
          correctAnswer: selectedCorrectAnswer,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        Alert.alert('Success', 'Question created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Error saving question:', error);
      Alert.alert('Error', 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Question' : 'Add Question'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Question</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your question here..."
              placeholderTextColor="#999"
              value={questionText}
              onChangeText={setQuestionText}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Option A</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter option A"
              placeholderTextColor="#999"
              value={optionA}
              onChangeText={setOptionA}
            />

            <Text style={styles.label}>Option B</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter option B"
              placeholderTextColor="#999"
              value={optionB}
              onChangeText={setOptionB}
            />

            <Text style={styles.label}>Option C</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter option C"
              placeholderTextColor="#999"
              value={optionC}
              onChangeText={setOptionC}
            />

            <Text style={styles.label}>Option D</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter option D"
              placeholderTextColor="#999"
              value={optionD}
              onChangeText={setOptionD}
            />

            <Text style={styles.label}>Correct Answer</Text>
            <View style={styles.radioContainer}>
              {[
                { label: 'A', value: optionA },
                { label: 'B', value: optionB },
                { label: 'C', value: optionC },
                { label: 'D', value: optionD },
              ].map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.radioButton,
                    selectedCorrectAnswer === option.value && styles.radioButtonSelected,
                  ]}
                  onPress={() => {
                    if (option.value.trim()) {
                      setSelectedCorrectAnswer(option.value);
                    } else {
                      Alert.alert('Error', `Please enter option ${option.label} first`);
                    }
                  }}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      selectedCorrectAnswer === option.value && styles.radioCircleSelected,
                    ]}
                  >
                    {selectedCorrectAnswer === option.value && (
                      <View style={styles.radioInnerCircle} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>Option {option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>
                    {isEdit ? 'Update Question' : 'Create Question'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  radioButtonSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#4CAF50',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

